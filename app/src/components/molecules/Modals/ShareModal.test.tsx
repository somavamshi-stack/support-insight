import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ShareModal } from "./ShareModal";

// Mock dependencies
jest.mock("@atoms", () => ({
    Button: jest.fn(({ label, onClick, variant }) => (
        <button data-testid={`button-${variant}`} onClick={onClick}>
            {label}
        </button>
    )),
    InputField: jest.fn(({ label, type, value, onChange }) => (
        <div>
            <label>{label}</label>
            <input data-testid={`input-${type}`} type={type} value={value} onChange={onChange} />
        </div>
    )),
    TextArea: jest.fn(({ value, onChange, placeholder, rows }) => (
        <textarea data-testid="textarea" value={value} onChange={onChange} placeholder={placeholder} rows={rows} />
    ))
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;
global.alert = jest.fn();

describe("ShareModal", () => {
    const mockProps = {
        isOpen: true,
        onClose: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders the modal when isOpen is true", () => {
        render(<ShareModal {...mockProps} />);
        expect(screen.getByText("Share Dashboard")).toBeInTheDocument();
        expect(screen.getByTestId("input-email")).toBeInTheDocument();
        expect(screen.getByLabelText("PDF")).toBeInTheDocument();
        expect(screen.getByLabelText("PowerPoint")).toBeInTheDocument();
        expect(screen.getByTestId("textarea")).toBeInTheDocument();
        expect(screen.getByTestId("button-primary")).toBeInTheDocument();
        expect(screen.getByTestId("button-secondary")).toBeInTheDocument();
    });

    test("does not render the modal when isOpen is false", () => {
        render(<ShareModal {...mockProps} isOpen={false} />);
        expect(screen.queryByText("Share Dashboard")).not.toBeInTheDocument();
    });

    test("calls onClose when clicking the backdrop", () => {
        render(<ShareModal {...mockProps} />);
        const backdrop = screen.getByText("Share Dashboard").parentElement?.parentElement;
        fireEvent.click(backdrop!);
        expect(mockProps.onClose).toHaveBeenCalledTimes(1);
    });

    test("does not call onClose when clicking inside the modal", () => {
        render(<ShareModal {...mockProps} />);
        const modalContent = screen.getByText("Share Dashboard").parentElement;
        fireEvent.click(modalContent!);
        expect(mockProps.onClose).not.toHaveBeenCalled();
    });

    test("calls onClose when clicking Cancel button", () => {
        render(<ShareModal {...mockProps} />);
        const cancelButton = screen.getByTestId("button-secondary");
        fireEvent.click(cancelButton);
        expect(mockProps.onClose).toHaveBeenCalledTimes(1);
    });

    test("updates email state when input changes", () => {
        render(<ShareModal {...mockProps} />);
        const emailInput = screen.getByTestId("input-email");
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });

        // Check value directly after change
        expect(emailInput).toHaveValue("test@example.com");
    });

    test("updates format when radio button is clicked", () => {
        const { unmount } = render(<ShareModal {...mockProps} />);

        // Default should be PDF
        const pdfRadio = screen.getByLabelText("PDF");
        const pptRadio = screen.getByLabelText("PowerPoint");
        expect(pdfRadio).toBeChecked();
        expect(pptRadio).not.toBeChecked();

        // Click PowerPoint
        fireEvent.click(pptRadio);

        // Verify state change without re-rendering
        expect(pdfRadio).not.toBeChecked();
        expect(pptRadio).toBeChecked();

        // Clean up before any additional renders
        unmount();
    });

    test("updates message when textarea changes", () => {
        const { unmount } = render(<ShareModal {...mockProps} />);
        const messageTextarea = screen.getByTestId("textarea");
        fireEvent.change(messageTextarea, { target: { value: "Test message" } });

        // Check value directly after change
        expect(messageTextarea).toHaveValue("Test message");
        unmount();
    });

    test("calls fetch with correct data when Send button is clicked", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true
        });

        render(<ShareModal {...mockProps} />);

        // Fill in form data
        const emailInput = screen.getByTestId("input-email");
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });

        const messageTextarea = screen.getByTestId("textarea");
        fireEvent.change(messageTextarea, { target: { value: "Test message" } });

        // Click Send button
        const sendButton = screen.getByTestId("button-primary");
        fireEvent.click(sendButton);

        // Check fetch was called with correct data
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith("/api/share-dashboard", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: "test@example.com",
                    format: "pdf", // Default format
                    message: "Test message"
                })
            });
        });

        // Success alert should be shown
        expect(global.alert).toHaveBeenCalledWith("Dashboard shared successfully!");

        // Modal should be closed
        expect(mockProps.onClose).toHaveBeenCalled();
    });

    test("shows error alert when fetch fails", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false
        });

        render(<ShareModal {...mockProps} />);

        // Click Send button
        const sendButton = screen.getByTestId("button-primary");
        fireEvent.click(sendButton);

        // Error alert should be shown
        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith("Failed to share dashboard");
        });

        // Modal should be closed
        expect(mockProps.onClose).toHaveBeenCalled();
    });

    test("handles fetch exceptions", async () => {
        mockFetch.mockRejectedValueOnce(new Error("Network error"));

        render(<ShareModal {...mockProps} />);

        // Click Send button
        const sendButton = screen.getByTestId("button-primary");
        fireEvent.click(sendButton);

        // Error alert should be shown
        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith("Error sending share request.");
        });

        // Modal should be closed
        expect(mockProps.onClose).toHaveBeenCalled();
    });
});
