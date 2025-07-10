import { fireEvent, render, screen } from "@testing-library/react";
import { SmoothDropdown } from "./SmoothDropdown";

describe("SmoothDropdown", () => {
    const options = ["Option 1", "Option 2", "Option 3"];
    const onSelectMock = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders correctly with default props", () => {
        render(<SmoothDropdown options={options} onSelect={onSelectMock} />);
        expect(screen.getByText("Select")).toBeInTheDocument();
        expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    });

    it("opens the dropdown when the button is clicked", () => {
        render(<SmoothDropdown options={options} onSelect={onSelectMock} />);
        const button = screen.getByRole("button");
        fireEvent.click(button);
        expect(screen.getByText("Option 1")).toBeInTheDocument();
        expect(screen.getByText("Option 2")).toBeInTheDocument();
        expect(screen.getByText("Option 3")).toBeInTheDocument();
    });

    it("calls onSelect with the correct option when an option is clicked", () => {
        render(<SmoothDropdown options={options} onSelect={onSelectMock} />);
        const button = screen.getByRole("button");
        fireEvent.click(button);

        const option = screen.getByText("Option 2");
        fireEvent.click(option);
        expect(onSelectMock).toHaveBeenCalledWith("Option 2");
    });

    it("displays the selected option correctly", () => {
        render(<SmoothDropdown options={options} onSelect={onSelectMock} selected="Option 1" />);
        expect(screen.getByText("Option 1")).toBeInTheDocument();
    });
});
