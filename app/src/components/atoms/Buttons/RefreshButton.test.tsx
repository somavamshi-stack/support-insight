import { act, fireEvent, render, screen } from "@testing-library/react";
import { RefreshButton } from "./RefreshButton";

describe("RefreshButton", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("renders the button with the correct label and icon", () => {
        render(<RefreshButton onClick={jest.fn()} />);
        const button = screen.getByRole("button", { name: /refresh/i });
        expect(button).toBeInTheDocument();
        expect(button.querySelector("svg")).toBeInTheDocument();
    });

    it("calls the onClick handler when clicked", () => {
        const handleClick = jest.fn();
        render(<RefreshButton onClick={handleClick} />);
        const button = screen.getByRole("button", { name: /refresh/i });
        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("shows and hides the loading animation when clicked", () => {
        const handleClick = jest.fn();
        render(<RefreshButton onClick={handleClick} />);
        const button = screen.getByRole("button", { name: /refresh/i });
        const icon = button.querySelector("svg");

        // Initial state - no animation
        expect(icon).not.toHaveClass("animate-spin");

        // Click and check animation starts
        fireEvent.click(button);
        expect(icon).toHaveClass("animate-spin");

        // Advance timers and check animation stops
        act(() => {
            jest.advanceTimersByTime(1000);
        });
        expect(icon).not.toHaveClass("animate-spin");
    });
});
