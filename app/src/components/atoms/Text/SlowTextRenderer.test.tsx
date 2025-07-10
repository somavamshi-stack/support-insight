import { act, render, screen } from "@testing-library/react";
import { SlowTextRenderer } from "./SlowTextRenderer";

jest.mock("@atoms", () => ({
    InlineSpinner: jest.fn(() => <div data-testid="inline-spinner" />)
}));

jest.mock("./NewLineText", () => ({
    NewLineText: jest.fn(({ text }) => <div data-testid="new-line-text">{text}</div>)
}));

describe("SlowTextRenderer Component", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    it("renders an InlineSpinner when text is empty", () => {
        render(<SlowTextRenderer text="" />);
        expect(screen.getByTestId("inline-spinner")).toBeInTheDocument();
    });

    it("renders the full text immediately if speed is 0", () => {
        const text = "Hello, world!";
        render(<SlowTextRenderer text={text} speed={0} />);
        expect(screen.getByTestId("new-line-text")).toHaveTextContent(text);
    });

    it("renders the text progressively based on the speed", () => {
        const text = "Hello";
        render(<SlowTextRenderer text={text} speed={100} />);
        expect(screen.queryByTestId("new-line-text")).not.toHaveTextContent(text);

        act(() => {
            jest.advanceTimersByTime(100); // First character
        });
        expect(screen.getByTestId("new-line-text")).toHaveTextContent("H");

        act(() => {
            jest.advanceTimersByTime(400); // Remaining characters
        });
        expect(screen.getByTestId("new-line-text")).toHaveTextContent(text);
    });

    it("calls onShowSpinner with true when spinner is shown", () => {
        const onShowSpinner = jest.fn();
        render(<SlowTextRenderer text="Hello" speed={100} onShowSpinner={onShowSpinner} />);

        expect(onShowSpinner).toHaveBeenCalledWith(true);
    });

    it("respects the initialTime delay before starting to render text", () => {
        const text = "Hello";
        render(<SlowTextRenderer text={text} speed={100} initialTime={500} />);

        // Verify initial empty state
        expect(screen.getByTestId("new-line-text")).toHaveTextContent("");

        // Advance to 499ms (just before initialTime completes)
        act(() => jest.advanceTimersByTime(499));
        expect(screen.getByTestId("new-line-text")).toHaveTextContent("");

        // Complete initialTime (500ms total)
        act(() => jest.advanceTimersByTime(1));
        expect(screen.getByTestId("new-line-text")).toHaveTextContent(""); // Still empty

        // Advance through first speed interval (100ms)
        act(() => jest.advanceTimersByTime(100));
        expect(screen.getByTestId("new-line-text")).toHaveTextContent("H"); // First character

        // Advance another speed interval (200ms total)
        act(() => jest.advanceTimersByTime(100));
        expect(screen.getByTestId("new-line-text")).toHaveTextContent("He"); // Second character
    });
});
