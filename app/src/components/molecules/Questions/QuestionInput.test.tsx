import { render, screen } from "@testing-library/react";
import QuestionInput from "./QuestionInput";
import { Button, TextArea } from "@atoms";

// Mock dependencies
jest.mock("@atoms", () => ({
    Button: jest.fn(({ onClick, label }) => (
        <button data-testid="submit-button" onClick={onClick}>
            {label}
        </button>
    )),
    TextArea: jest.fn(({ value, onChange, placeholder, rows, className }) => (
        <textarea data-testid="question-textarea" value={value} onChange={onChange} placeholder={placeholder} rows={rows} className={className} />
    ))
}));

describe("QuestionInput", () => {
    const mockOnSubmit = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders TextArea and Button components", () => {
        render(<QuestionInput onSubmit={mockOnSubmit} />);

        expect(screen.getByTestId("question-textarea")).toBeInTheDocument();
        expect(screen.getByTestId("submit-button")).toBeInTheDocument();
        expect(screen.getByText(">")).toBeInTheDocument();
    });

    test("TextArea has correct props", () => {
        render(<QuestionInput onSubmit={mockOnSubmit} />);

        expect(TextArea).toHaveBeenCalledWith(
            expect.objectContaining({
                placeholder: "Ask your question.",
                value: "",
                rows: 3,
                className: expect.stringContaining("w-[40vw]")
            }),
            {}
        );
    });

    test("Button has correct props", () => {
        render(<QuestionInput onSubmit={mockOnSubmit} />);

        expect(Button).toHaveBeenCalledWith(
            expect.objectContaining({
                label: ">",
                variant: "primary",
                style: expect.objectContaining({
                    minWidth: "3rem",
                    height: "3rem"
                })
            }),
            {}
        );
    });

    test("updates input value when typing in TextArea", () => {
        const { rerender } = render(<QuestionInput onSubmit={mockOnSubmit} />);

        // Get the onChange handler
        const onChangeHandler = (TextArea as jest.Mock).mock.calls[0][0].onChange;

        // Simulate typing
        onChangeHandler({ target: { value: "What is the meaning of life?" } });

        // Re-render to check updated state
        rerender(<QuestionInput onSubmit={mockOnSubmit} />);

        expect(TextArea).toHaveBeenLastCalledWith(
            expect.objectContaining({
                value: "What is the meaning of life?"
            }),
            {}
        );
    });

    test("calls onSubmit with input value when button is clicked", () => {
        const { rerender } = render(<QuestionInput onSubmit={mockOnSubmit} />);

        // Get the initial onChange handler
        const onChangeHandler = (TextArea as jest.Mock).mock.calls[0][0].onChange;

        // Simulate typing
        onChangeHandler({ target: { value: "What is the meaning of life?" } });

        // Rerender to apply state changes
        rerender(<QuestionInput onSubmit={mockOnSubmit} />);

        // Get the updated Button component after state change
        const onClickHandler = (Button as jest.Mock).mock.calls[(Button as jest.Mock).mock.calls.length - 1][0].onClick;

        // Simulate button click
        onClickHandler();

        // Check if onSubmit was called with correct value
        expect(mockOnSubmit).toHaveBeenCalledWith("What is the meaning of life?");
    });

    test("clears input after successful submission", () => {
        const { rerender } = render(<QuestionInput onSubmit={mockOnSubmit} />);

        // Update input value
        const onChangeHandler = (TextArea as jest.Mock).mock.calls[0][0].onChange;
        onChangeHandler({ target: { value: "What is the meaning of life?" } });

        rerender(<QuestionInput onSubmit={mockOnSubmit} />);

        // Get the onClick handler from the Button props
        const onClickHandler = (Button as jest.Mock).mock.calls[(Button as jest.Mock).mock.calls.length - 1][0].onClick;

        // Simulate button click
        onClickHandler();

        // Re-render to check updated state after submission
        rerender(<QuestionInput onSubmit={mockOnSubmit} />);

        // TextArea should have been called again with empty value
        expect(TextArea).toHaveBeenLastCalledWith(
            expect.objectContaining({
                value: ""
            }),
            {}
        );
    });

    test("does not call onSubmit when input is empty", () => {
        const { rerender } = render(<QuestionInput onSubmit={mockOnSubmit} />);

        // Get the onClick handler from the Button props
        const onClickHandler = (Button as jest.Mock).mock.calls[0][0].onClick;

        // Simulate button click with empty input
        onClickHandler();

        // Check onSubmit was not called
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test("does not call onSubmit when input contains only whitespace", () => {
        const { rerender } = render(<QuestionInput onSubmit={mockOnSubmit} />);

        // Update input value to whitespace only
        const onChangeHandler = (TextArea as jest.Mock).mock.calls[0][0].onChange;
        onChangeHandler({ target: { value: "   " } });

        rerender(<QuestionInput onSubmit={mockOnSubmit} />);

        // Get the onClick handler from the Button props
        const onClickHandler = (Button as jest.Mock).mock.calls[0][0].onClick;

        // Simulate button click
        onClickHandler();

        // Check onSubmit was not called
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });
});
