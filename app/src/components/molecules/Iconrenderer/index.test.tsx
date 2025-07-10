import { render, screen } from "@testing-library/react";
import { IconRenderer } from "./index";

// Mock dependencies
jest.mock("@molecules", () => ({
    Tooltip: jest.fn(({ children, title = "", content = "", placement = "", ...props }) => (
        <div data-testid="tooltip" data-title={title} data-content={content} data-placement={placement} {...props}>
            {children}
        </div>
    ))
}));

describe("IconRenderer", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders the icon within a Tooltip component", () => {
        const mockIcon = <div data-testid="mock-icon">Icon</div>;
        render(<IconRenderer icon={mockIcon} />);

        // Verify Tooltip is rendered
        const tooltip = screen.getByTestId("tooltip");
        expect(tooltip).toBeInTheDocument();

        // Verify icon is rendered inside tooltip
        const icon = screen.getByTestId("mock-icon");
        expect(icon).toBeInTheDocument();
        expect(tooltip).toContainElement(icon);
    });

    test("passes tooltip prop as title to Tooltip component", () => {
        const mockIcon = <div>Icon</div>;
        render(<IconRenderer icon={mockIcon} tooltip="Test Tooltip" />);

        const tooltip = screen.getByTestId("tooltip");
        expect(tooltip).toHaveAttribute("data-title", "Test Tooltip");
    });

    test("passes description prop as content to Tooltip component", () => {
        const mockIcon = <div>Icon</div>;
        render(<IconRenderer icon={mockIcon} description="Test Description" />);

        const tooltip = screen.getByTestId("tooltip");
        expect(tooltip).toHaveAttribute("data-content", "Test Description");
    });

    test("passes both tooltip and description to Tooltip component", () => {
        const mockIcon = <div>Icon</div>;
        render(<IconRenderer icon={mockIcon} tooltip="Test Tooltip" description="Test Description" />);

        const tooltip = screen.getByTestId("tooltip");
        expect(tooltip).toHaveAttribute("data-title", "Test Tooltip");
        expect(tooltip).toHaveAttribute("data-content", "Test Description");
    });

    test("renders without tooltip or description", () => {
        const mockIcon = <div data-testid="mock-icon">Icon</div>;
        render(<IconRenderer icon={mockIcon} />);

        const tooltip = screen.getByTestId("tooltip");
        expect(tooltip).toHaveAttribute("data-title", "");
        expect(tooltip).toHaveAttribute("data-content", "");
    });
});
