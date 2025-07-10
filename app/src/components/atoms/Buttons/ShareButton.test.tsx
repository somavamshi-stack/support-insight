import { fireEvent, render, screen } from "@testing-library/react";
import { ShareButton } from "./ShareButton";

jest.mock("react-icons/fa", () => ({
    FaShareAlt: jest.fn(() => <svg data-testid="share-icon" />)
}));

describe("ShareButton Component", () => {
    it("renders the button with the correct label and icon", () => {
        render(<ShareButton onClick={jest.fn()} />);
        const button = screen.getByRole("button", { name: /share/i });
        expect(button).toBeInTheDocument();
        expect(screen.getByTestId("share-icon")).toBeInTheDocument(); // Check if the icon is rendered
    });

    it("calls the onClick handler when clicked", () => {
        const handleClick = jest.fn();
        render(<ShareButton onClick={handleClick} />);
        const button = screen.getByRole("button", { name: /share/i });
        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("applies the correct id to the button", () => {
        render(<ShareButton id="custom-id" onClick={jest.fn()} />);
        const button = screen.getByRole("button", { name: /share/i });
        expect(button).toHaveAttribute("id", "custom-id-share-btn");
    });

    it("renders with default id when no id is provided", () => {
        render(<ShareButton onClick={jest.fn()} />);
        const button = screen.getByRole("button", { name: /share/i });
        expect(button).toHaveAttribute("id", "btn-share-btn");
    });

    it("applies the correct styles to the button", () => {
        render(<ShareButton onClick={jest.fn()} />);
        const button = screen.getByRole("button", { name: /share/i });
        expect(button).toHaveStyle("display: inline-flex");
        expect(button).toHaveStyle("align-items: center");
    });
});
