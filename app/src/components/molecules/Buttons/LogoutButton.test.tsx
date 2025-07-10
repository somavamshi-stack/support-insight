// import { fireEvent, render, screen, waitFor } from "@testing-library/react";
// import { LogoutButton } from "./LogoutButton";
// import { useAppDispatch } from "@redux/hooks";
// import { resetLogin } from "@redux/slices";
// import { logout } from "@redux/actions";
// import { useRouter } from "next/router";
// import { clearCookies } from "@utils";

// // Mock dependencies
// jest.mock("@redux/hooks", () => ({
//     useAppDispatch: jest.fn()
// }));

// jest.mock("next/router", () => ({
//     useRouter: jest.fn()
// }));

// jest.mock("@redux/slices", () => ({
//     resetLogin: jest.fn()
// }));

// jest.mock("@redux/actions", () => ({
//     logout: jest.fn()
// }));

// jest.mock("@utils", () => ({
//     clearCookies: jest.fn()
// }));

// jest.mock("../Tooltip", () => ({
//     Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</> // Mock Tooltip
// }));

// describe("LogoutButton", () => {
//     const mockDispatch = jest.fn();
//     const mockPush = jest.fn();

//     beforeEach(() => {
//         jest.clearAllMocks();
//         (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
//         (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
//     });

//     test("renders the LogoutButton with tooltip and icon", () => {
//         render(<LogoutButton />);

//         // Check if the button is rendered
//         const button = screen.getByTestId("logout-button");
//         expect(button).toBeInTheDocument();

//         // Check if the icon is rendered
//         const icon = button.querySelector("svg");
//         expect(icon).toBeInTheDocument();
//     });

//     test("dispatches resetLogin, logout, and clears cookies on logout", async () => {
//         render(<LogoutButton />);
//         const button = screen.getByTestId("logout-button");

//         fireEvent.click(button);

//         await waitFor(() => {
//             expect(mockDispatch).toHaveBeenCalledWith(resetLogin());
//             expect(mockDispatch).toHaveBeenCalledWith(logout());
//             expect(clearCookies).toHaveBeenCalled();
//         });
//     });

//     test("navigates to /login after logout", async () => {
//         render(<LogoutButton />);
//         const button = screen.getByTestId("logout-button");

//         fireEvent.click(button);

//         await waitFor(() => {
//             expect(mockPush).toHaveBeenCalledWith("/login");
//         });
//     });

//     test("handles errors gracefully during logout", async () => {
//         mockDispatch.mockImplementationOnce(() => {
//             throw new Error("Logout failed");
//         });

//         render(<LogoutButton />);
//         const button = screen.getByTestId("logout-button");

//         fireEvent.click(button);

//         await waitFor(() => {
//             expect(mockPush).toHaveBeenCalledWith("/login"); // Ensure navigation still happens
//         });
//     });

//     test("resets loading state after success", async () => {
//         render(<LogoutButton />);
//         const button = screen.getByTestId("logout-button");

//         fireEvent.click(button);

//         await waitFor(() => {
//             expect(button.querySelector(".animate-spin")).toBeNull();
//         });
//     });
// });
