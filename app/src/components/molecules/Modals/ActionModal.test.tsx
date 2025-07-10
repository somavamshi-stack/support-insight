import { fireEvent, render, screen } from "@testing-library/react";
import { ActionModal } from "./ActionModal";

// Mock dependencies
jest.mock("@atoms", () => ({
    Button: jest.fn(({ label, onClick, variant }) => (
        <button data-testid={`button-${variant}`} onClick={onClick}>
            {label}
        </button>
    )),
    TextArea: jest.fn(({ value, onChange, placeholder, rows }) => (
        <textarea data-testid="textarea" value={value || ""} onChange={onChange} placeholder={placeholder} rows={rows} />
    ))
}));

describe("ActionModal", () => {
    const mockProps = {
        isOpen: true,
        onClose: jest.fn(),
        title: "Test Modal",
        onSubmit: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders the modal when isOpen is true", () => {
        render(<ActionModal {...mockProps} />);
        expect(screen.getByText("Test Modal")).toBeInTheDocument();
        expect(screen.getByTestId("textarea")).toBeInTheDocument();
        expect(screen.getByTestId("button-primary")).toBeInTheDocument();
        expect(screen.getByTestId("button-secondary")).toBeInTheDocument();
    });

    test("does not render the modal when isOpen is false", () => {
        render(<ActionModal {...mockProps} isOpen={false} />);
        expect(screen.queryByText("Test Modal")).not.toBeInTheDocument();
        expect(screen.queryByTestId("textarea")).not.toBeInTheDocument();
    });

    test("calls onClose when clicking the backdrop", () => {
        render(<ActionModal {...mockProps} />);
        const backdrop = screen.getByText("Test Modal").parentElement?.parentElement;
        fireEvent.click(backdrop!);
        expect(mockProps.onClose).toHaveBeenCalledTimes(1);
    });

    test("does not call onClose when clicking inside the modal", () => {
        render(<ActionModal {...mockProps} />);
        const modalContent = screen.getByText("Test Modal").parentElement;
        fireEvent.click(modalContent!);
        expect(mockProps.onClose).not.toHaveBeenCalled();
    });

    test("calls onClose when clicking Cancel button", () => {
        render(<ActionModal {...mockProps} />);
        const cancelButton = screen.getByTestId("button-secondary");
        fireEvent.click(cancelButton);
        expect(mockProps.onClose).toHaveBeenCalledTimes(1);
    });

    test("submits input value when Submit button is clicked", () => {
        render(<ActionModal {...mockProps} />);
        const textarea = screen.getByTestId("textarea");
        fireEvent.change(textarea, { target: { value: "Test input" } });

        const submitButton = screen.getByTestId("button-primary");
        fireEvent.click(submitButton);

        expect(mockProps.onSubmit).toHaveBeenCalledWith("Test input");
        expect(mockProps.onClose).toHaveBeenCalledTimes(1);
    });

    test("does not submit when input is empty", () => {
        render(<ActionModal {...mockProps} />);
        const textarea = screen.getByTestId("textarea");
        fireEvent.change(textarea, { target: { value: " " } }); // Just spaces

        const submitButton = screen.getByTestId("button-primary");
        fireEvent.click(submitButton);

        expect(mockProps.onSubmit).not.toHaveBeenCalled();
        expect(mockProps.onClose).not.toHaveBeenCalled();
    });
});
