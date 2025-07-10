import { fireEvent, render, screen } from "@testing-library/react";
import { LabelRenderer } from "./LabelRenderer";

jest.mock("@molecules", () => ({
    IconRenderer: jest.fn(({ icon, tooltip, onClick }) => (
        <div data-testid={`icon-${icon}`} onClick={onClick}>
            {tooltip}
        </div>
    ))
}));

describe("LabelRenderer", () => {
    test("renders the label with default font size", () => {
        render(<LabelRenderer label="Test Label" />);
        const label = screen.getByText("Test Label");
        expect(label).toBeInTheDocument();
        expect(label).toHaveStyle("font-size: 12px");
    });

    test("renders the label with custom font size", () => {
        render(<LabelRenderer label="Test Label" fontSize="16px" />);
        const label = screen.getByText("Test Label");
        expect(label).toBeInTheDocument();
        expect(label).toHaveStyle("font-size: 16px");
    });

    test("renders the required asterisk when required", () => {
        render(<LabelRenderer label="Test Label" required />);
        const asterisk = screen.getByText("*");
        expect(asterisk).toBeInTheDocument();
        expect(asterisk).toHaveClass("text-red-600");
    });

    test("hides the required asterisk when hideRequiredAsterisk is true", () => {
        render(<LabelRenderer label="Test Label" required config={{ hideRequiredAsterisk: true }} />);
        const asterisk = screen.queryByText("*");
        expect(asterisk).not.toBeInTheDocument();
    });

    test("renders the description icon with tooltip", () => {
        render(<LabelRenderer label="Test Label" description="This is a description" />);
        const descriptionIcon = screen.getByTestId("icon-HelpOutlined");
        expect(descriptionIcon).toBeInTheDocument();
        expect(descriptionIcon).toHaveTextContent("This is a description");
    });

    test("renders the action icon and handles click events", () => {
        const onActionClick = jest.fn();
        render(<LabelRenderer label="Test Label" actionIcon="ActionIcon" actionTooltip="Action Tooltip" onActionClick={onActionClick} />);
        const actionIcon = screen.getByTestId("icon-ActionIcon");
        expect(actionIcon).toBeInTheDocument();
        expect(actionIcon).toHaveTextContent("Action Tooltip");

        fireEvent.click(actionIcon);
        expect(onActionClick).toHaveBeenCalledTimes(1);
    });

    test("does not render the action icon when onActionClick is not provided", () => {
        render(<LabelRenderer label="Test Label" actionIcon="ActionIcon" actionTooltip="Action Tooltip" />);
        const actionIcon = screen.queryByTestId("icon-ActionIcon");
        expect(actionIcon).not.toBeInTheDocument();
    });
});
