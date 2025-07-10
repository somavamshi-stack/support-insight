import { fireEvent, render, screen } from "@testing-library/react";
import { CustomSelect, CustomSelectProps } from "./CustomSelect";

describe("CustomSelect Component", () => {
    const mockOptions = [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3" }
    ];

    const defaultProps: CustomSelectProps = {
        id: "test-select",
        enabled: true,
        required: false,
        options: mockOptions,
        onChange: jest.fn(),
        value: "option1"
    };

    it("renders without crashing", () => {
        render(<CustomSelect {...defaultProps} />);
        const selectElement = screen.getByRole("combobox");
        expect(selectElement).toBeInTheDocument();
    });

    it("displays the correct value", () => {
        render(<CustomSelect {...defaultProps} />);
        const selectedOption = screen.getByText("Option 1");
        expect(selectedOption).toBeInTheDocument();
    });

    it("calls onChange when a new option is selected", () => {
        const onChangeMock = jest.fn();
        render(<CustomSelect {...defaultProps} onChange={onChangeMock} />);
        const selectElement = screen.getByRole("combobox");

        // Simulate opening the dropdown
        fireEvent.keyDown(selectElement, { key: "ArrowDown", code: "ArrowDown" });

        // Simulate selecting a new option
        const newOption = screen.getByText("Option 2");
        fireEvent.click(newOption);

        expect(onChangeMock).toHaveBeenCalledWith(
            mockOptions[1], // The selected option
            expect.any(Object) // Additional metadata from react-select
        );
    });

    it("is disabled when enabled is set to false", () => {
        render(<CustomSelect {...defaultProps} enabled={false} />);
        const selectElement = screen.getByRole("combobox");
        expect(selectElement).toBeDisabled();
    });

    it("shows the placeholder text when no value is selected", () => {
        render(<CustomSelect {...defaultProps} value={null} />);
        const placeholderElement = screen.getByText("Select...");
        expect(placeholderElement).toBeInTheDocument();
    });
});
