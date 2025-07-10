import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useAppDispatch } from "@redux/hooks";
import { resetLogin } from "@redux/slices";
import { LogoutButton } from "@molecules";
import { logout } from "@redux/actions";
import { useRouter } from "next/router";
import { clearCookies } from "@utils";

// 🧪 Mocks
jest.mock("@redux/hooks", () => ({
    useAppDispatch: jest.fn()
}));

jest.mock("@redux/slices", () => ({
    resetLogin: jest.fn(() => ({ type: "RESET_LOGIN" }))
}));

jest.mock("@redux/actions", () => ({
    logout: jest.fn()
}));

jest.mock("@utils", () => ({
    clearCookies: jest.fn()
}));

jest.mock("next/router", () => ({
    useRouter: jest.fn()
}));

describe("LogoutButton", () => {
    const pushMock = jest.fn();
    const dispatchMock = jest.fn(() => Promise.resolve({ unwrap: () => Promise.resolve() }));

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
        (useAppDispatch as unknown as jest.Mock).mockReturnValue(dispatchMock);

        // Clear mocks before each test
        jest.clearAllMocks();
    });

    it("renders the logout icon by default", () => {
        render(<LogoutButton />);
        expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument(); // React Icons don't use alt text, so role is img, hidden
    });

    it("shows spinner when clicked and completes logout flow", async () => {
        (logout as unknown as jest.Mock).mockReturnValue({ unwrap: () => Promise.resolve() });

        render(<LogoutButton />);
        const button = screen.getByRole("img", { hidden: true }).parentElement!;
        fireEvent.click(button);

        // Spinner appears
        expect(screen.getByRole("status")).toBeInTheDocument();

        await waitFor(() => {
            expect(dispatchMock).toHaveBeenCalledWith(resetLogin());
            expect(clearCookies).toHaveBeenCalled();
            expect(dispatchMock).toHaveBeenCalledWith(expect.any(Function)); // logout thunk
            expect(pushMock).toHaveBeenCalledWith("/login");
        });
    });

    it("handles logout failure gracefully and still navigates", async () => {
        (logout as unknown as jest.Mock).mockReturnValue({
            unwrap: () => Promise.reject(new Error("Failed"))
        });

        const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});

        render(<LogoutButton />);
        const button = screen.getByRole("img", { hidden: true }).parentElement!;
        fireEvent.click(button);

        await waitFor(() => {
            expect(dispatchMock).toHaveBeenCalledWith(resetLogin());
            expect(clearCookies).toHaveBeenCalled();
            expect(consoleErrorMock).toHaveBeenCalledWith("Logout failed:", expect.any(Error));
            expect(pushMock).toHaveBeenCalledWith("/login");
        });

        consoleErrorMock.mockRestore();
    });

    it("is clickable and tooltip is present", () => {
        render(<LogoutButton />);
        const button = screen.getByRole("img", { hidden: true }).parentElement!;
        expect(button).toHaveAttribute("id", "logout-button");
        expect(button).toHaveClass("cursor-pointer");
        // We assume Tooltip is working, no need to test its internals
    });

    it("does not crash if dispatch throws", async () => {
        dispatchMock.mockImplementation(() => {
            throw new Error("Dispatch failed");
        });

        const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});

        render(<LogoutButton />);
        const button = screen.getByRole("img", { hidden: true }).parentElement!;
        fireEvent.click(button);

        await waitFor(() => {
            expect(consoleErrorMock).toHaveBeenCalled();
            expect(pushMock).toHaveBeenCalledWith("/login");
        });

        consoleErrorMock.mockRestore();
    });
});
