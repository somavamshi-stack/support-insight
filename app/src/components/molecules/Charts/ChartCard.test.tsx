import { render, screen } from "@testing-library/react";
import { ChartCard } from "./ChartCard";

// Mock dependencies
jest.mock("@templates", () => ({
    TileLayout: jest.fn(({ children, loading }) => (
        <div data-testid="tile-layout" data-loading={loading}>
            {children}
        </div>
    ))
}));

jest.mock("./ChartClient", () => jest.fn(() => <div data-testid="chart-client">ChartClient</div>));

describe("ChartCard", () => {
    const mockProps = {
        label: "Test Label",
        loading: false,
        onRefine: jest.fn(),
        onAnalyze: jest.fn(),
        insight: "Test Insight"
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders the ChartClient component when valid data is provided", () => {
        render(<ChartCard {...mockProps} data={[1, 2, 3]} />);
        const chartClient = screen.getByTestId("chart-client");
        expect(chartClient).toBeInTheDocument();
    });

    test("renders 'No data available' when no valid data is provided", () => {
        render(<ChartCard {...mockProps} />);
        const noDataMessage = screen.getByText("No data available");
        expect(noDataMessage).toBeInTheDocument();
    });

    test("renders loading state when loading is true", () => {
        render(<ChartCard {...mockProps} loading={true} />);
        const tileLayout = screen.getByTestId("tile-layout");
        expect(tileLayout).toHaveAttribute("data-loading", "true");
    });
});
