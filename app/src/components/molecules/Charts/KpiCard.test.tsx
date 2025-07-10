import { render, screen } from "@testing-library/react";
import { TileLayout } from "@templates";
import { KpiCard } from "./KpiCard";

// Mock dependencies
jest.mock("@templates", () => ({
    TileLayout: jest.fn(({ children }) => <div data-testid="tile-layout">{children}</div>)
}));

describe("KpiCard", () => {
    const mockProps = {
        label: "Test KPI",
        data: { value: 1000 },
        trend: 5,
        currency: true,
        loading: false,
        insight: "Test Insight",
        onRefine: jest.fn(),
        onAnalyze: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders the TileLayout component with the correct props", () => {
        render(<KpiCard {...mockProps} />);
        const tileLayout = screen.getByTestId("tile-layout");
        expect(tileLayout).toBeInTheDocument();
        expect(TileLayout).toHaveBeenCalledWith(
            expect.objectContaining({
                label: "Test KPI",
                insight: "Test Insight",
                loading: false,
                onRefine: mockProps.onRefine,
                onAnalyze: mockProps.onAnalyze
            }),
            {}
        );
    });

    test("renders the KPI value with currency formatting", () => {
        render(<KpiCard {...mockProps} />);
        const kpiValue = screen.getByText("$1,000");
        expect(kpiValue).toBeInTheDocument();
    });

    test("renders the trend with positive percentage", () => {
        render(<KpiCard {...mockProps} />);
        const trend = screen.getByText("+5%");
        expect(trend).toBeInTheDocument();
        expect(trend).toHaveStyle("color: green");
    });

    test("renders the trend with negative percentage", () => {
        render(<KpiCard {...mockProps} trend={-10} />);
        const trend = screen.getByText("-10%");
        expect(trend).toBeInTheDocument();
        expect(trend).toHaveStyle("color: red");
    });

    test("renders 'loading' state when data is undefined", () => {
        render(<KpiCard {...mockProps} data={undefined} />);
        expect(TileLayout).toHaveBeenCalledWith(
            expect.objectContaining({
                loading: true
            }),
            {}
        );
    });

    test("renders the KPI value without currency formatting", () => {
        render(<KpiCard {...mockProps} currency={false} />);
        const kpiValue = screen.getByText("1000");
        expect(kpiValue).toBeInTheDocument();
    });

    test("does not render trend when trend is undefined", () => {
        render(<KpiCard {...mockProps} trend={undefined} />);
        const trend = screen.queryByText(/%/);
        expect(trend).not.toBeInTheDocument();
    });

    test("does not render trend when trend is 0", () => {
        render(<KpiCard {...mockProps} trend={0} />);
        const trend = screen.queryByText(/%/);
        expect(trend).not.toBeInTheDocument();
    });
});
