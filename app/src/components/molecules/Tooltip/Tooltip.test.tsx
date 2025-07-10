import { render, screen } from "@testing-library/react";
import { Tooltip } from "./Tooltip";

// Mock the usePopperTooltip hook
jest.mock("@hooks", () => ({
    usePopperTooltip: () => ({
        getArrowProps: () => ({ "data-testid": "tooltip-arrow" }),
        getTooltipProps: () => ({ style: {}, "data-testid": "tooltip-container" }),
        setTooltipRef: jest.fn(),
        setTriggerRef: jest.fn(),
        visible: true
    })
}));

describe("Tooltip Component", () => {
    test("renders children correctly", () => {
        render(
            <Tooltip title="Tooltip Title">
                <div data-testid="child">Hover me</div>
            </Tooltip>
        );

        expect(screen.getByTestId("child")).toBeInTheDocument();
        expect(screen.getByTestId("child")).toHaveTextContent("Hover me");
    });

    test("renders title correctly", () => {
        render(
            <Tooltip title="Tooltip Title">
                <div>Hover me</div>
            </Tooltip>
        );

        expect(screen.getByText("Tooltip Title")).toBeInTheDocument();
        expect(screen.getByText("Tooltip Title").className).toContain("text-xs");
        expect(screen.getByText("Tooltip Title").className).toContain("leading-4");
    });

    test("renders content correctly", () => {
        render(
            <Tooltip content="Tooltip Content">
                <div>Hover me</div>
            </Tooltip>
        );

        expect(screen.getByText("Tooltip Content")).toBeInTheDocument();
        expect(screen.getByText("Tooltip Content").className).toContain("mt-2");
        expect(screen.getByText("Tooltip Content").className).toContain("text-xs");
    });

    test("renders both title and content", () => {
        render(
            <Tooltip title="Tooltip Title" content="Tooltip Content">
                <div>Hover me</div>
            </Tooltip>
        );

        expect(screen.getByText("Tooltip Title")).toBeInTheDocument();
        expect(screen.getByText("Tooltip Content")).toBeInTheDocument();

        // When content is present, title should have font-semibold class
        expect(screen.getByText("Tooltip Title").className).toContain("font-semibold");
        expect(screen.getByText("Tooltip Title").className).not.toContain("leading-4");
    });

    test("returns only children when no title or content provided", () => {
        const { container } = render(
            <Tooltip>
                <div data-testid="child">No tooltip</div>
            </Tooltip>
        );

        expect(screen.getByTestId("child")).toBeInTheDocument();

        // There should be no tooltip elements rendered
        expect(container.querySelectorAll(".tooltip-container")).toHaveLength(0);
    });

    test("has tooltip-arrow element", () => {
        render(
            <Tooltip title="Tooltip Title">
                <div>Hover me</div>
            </Tooltip>
        );

        // Check for tooltip arrow
        expect(screen.getByTestId("tooltip-arrow")).toBeInTheDocument();
    });

    test("has break-words class on title and content", () => {
        render(
            <Tooltip title="Long tooltip title that should wrap" content="Long tooltip content that should wrap">
                <div>Hover me</div>
            </Tooltip>
        );

        expect(screen.getByText("Long tooltip title that should wrap").className).toContain("break-words");
        expect(screen.getByText("Long tooltip content that should wrap").className).toContain("break-words");
    });
});
