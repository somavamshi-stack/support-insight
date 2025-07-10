import { render, screen } from "@testing-library/react";
import { NewLineText } from "./NewLineText";

jest.mock("../Spinners", () => ({
    InlineSpinner: jest.fn(() => <div data-testid="inline-spinner" />)
}));

describe("NewLineText", () => {
    test("renders nothing when text is empty", () => {
        const { container } = render(<NewLineText text="" />);
        expect(container).toBeEmptyDOMElement();
    });

    test("renders single line of text", () => {
        render(<NewLineText text="This is a single line of text." />);
        const line = screen.getByText("This is a single line of text.");
        expect(line).toBeInTheDocument();
        expect(line).toHaveClass("mb-1", "min-h-1", "text-xs");
    });

    test("renders multiple lines of text", () => {
        const text = "Line 1\nLine 2\nLine 3";
        render(<NewLineText text={text} />);
        const lines = text.split("\n");

        lines.forEach((line) => {
            const renderedLine = screen.getByText(line);
            expect(renderedLine).toBeInTheDocument();
            expect(renderedLine).toHaveClass("mb-1", "min-h-1", "text-xs");
        });
    });

    test("renders spinner on the last line when showSpinner is true", () => {
        const text = "Line 1\nLine 2";
        render(<NewLineText text={text} showSpinner />);
        const spinner = screen.getByTestId("inline-spinner");
        expect(spinner).toBeInTheDocument();

        const lastLine = screen.getByText("Line 2");
        expect(lastLine).toContainElement(spinner);
    });

    test("does not render spinner when showSpinner is false", () => {
        const text = "Line 1\nLine 2";
        render(<NewLineText text={text} showSpinner={false} />);
        const spinner = screen.queryByTestId("inline-spinner");
        expect(spinner).not.toBeInTheDocument();
    });

    test("renders nothing when text is undefined", () => {
        const { container } = render(<NewLineText />);
        expect(container).toBeEmptyDOMElement();
    });
});
