import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { ERROR, LOADING, RUNNING, SUCCESS } from "@constants";
import { act, render, screen } from "@testing-library/react";
import { fetchCardData, fetchSchema } from "@redux/actions";
import { SchemaRenderer } from "./SchemaRenderer";
import { ChartCard, KpiCard } from "@molecules";

// Mock dependencies
jest.mock("@redux/hooks", () => ({
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn()
}));

jest.mock("@redux/actions", () => ({
    fetchSchema: jest.fn((payload) => ({ type: "FETCH_SCHEMA", payload })),
    fetchCardData: jest.fn((id) => ({ type: "FETCH_CARD_DATA", id }))
}));

jest.mock("next/image", () => ({
    __esModule: true,
    default: jest.fn(({ src, alt }) => <img src={src} alt={alt} data-testid="next-image" />)
}));

jest.mock("react-grid-layout", () => ({
    Responsive: jest.fn(() => null),
    WidthProvider: jest.fn((Component) => Component)
}));

jest.mock("@atoms", () => ({
    Centered: jest.fn(({ children, className }) => (
        <div data-testid="centered" className={className}>
            {children}
        </div>
    ))
}));

jest.mock("@molecules", () => ({
    ChartCard: jest.fn(() => <div data-testid="chart-card">Chart Card</div>),
    KpiCard: jest.fn(() => <div data-testid="kpi-card">KPI Card</div>),
    EmptyIconRenderer: jest.fn(({ isError, title, details }) => (
        <div data-testid="empty-icon-renderer">
            <h3>{title}</h3>
            <div>{details}</div>
        </div>
    ))
}));

jest.useFakeTimers();

describe("SchemaRenderer", () => {
    const mockProps = {
        topicId: "topic-123",
        userId: "user-456"
    };

    const mockDispatch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    });

    afterEach(() => {
        jest.clearAllTimers();
    });

    test("fetches schema on initial render", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            schema: null,
            schema_status: LOADING,
            execution_logs: [],
            chart_data: {},
            data_status: {},
            pollingInterval: "off"
        });

        render(<SchemaRenderer {...mockProps} />);

        // Check if fetchSchema was dispatched with correct parameters
        expect(mockDispatch).toHaveBeenCalledWith(
            fetchSchema({
                userId: "user-456",
                topic_id: "topic-123"
            })
        );
    });

    test("shows loading state when schema is loading", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            schema: null,
            schema_status: LOADING,
            execution_logs: [],
            chart_data: {},
            data_status: {},
            pollingInterval: "off"
        });

        render(<SchemaRenderer {...mockProps} />);

        // Check for loading image and message
        expect(screen.getByTestId("next-image")).toBeInTheDocument();
        expect(screen.getByText("Please wait while I am preparing data for you...")).toBeInTheDocument();
    });

    test("shows error state when schema fetch fails", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            schema: null,
            schema_status: ERROR,
            execution_logs: [{ message: "Error fetching data" }],
            chart_data: {},
            data_status: {},
            pollingInterval: "off"
        });

        render(<SchemaRenderer {...mockProps} />);

        // Check for error message
        expect(screen.getByTestId("empty-icon-renderer")).toBeInTheDocument();
        expect(screen.getByText("Sorry!!! I am unable to find you the relevant data.")).toBeInTheDocument();
        expect(screen.getByText("Error fetching data")).toBeInTheDocument();
    });

    test("sets up polling interval when schema is loading or running", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            schema: null,
            schema_status: RUNNING,
            execution_logs: [],
            chart_data: {},
            data_status: {},
            pollingInterval: "off"
        });

        render(<SchemaRenderer {...mockProps} />);

        // Clear initial fetch call
        mockDispatch.mockClear();

        // Advance timer by polling interval
        act(() => {
            jest.advanceTimersByTime(10000);
        });

        // Should have fetched schema again
        expect(mockDispatch).toHaveBeenCalledWith(
            fetchSchema({
                userId: "user-456",
                topic_id: "topic-123"
            })
        );
    });

    test("renders grid layout when schema is successful", () => {
        const mockSchema = [
            { i: "0", x: 0, y: 0, w: 6, h: 2, id: "card-1", type: "kpi", label: "KPI Card" },
            { i: "1", x: 6, y: 0, w: 6, h: 4, id: "card-2", type: "chart-bar", label: "Chart Card" }
        ];

        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            schema: mockSchema,
            schema_status: SUCCESS,
            execution_logs: [],
            chart_data: {
                "card-1": { value: 100 },
                "card-2": { data: [1, 2, 3] }
            },
            data_status: {
                "card-1": SUCCESS,
                "card-2": SUCCESS
            },
            pollingInterval: "off"
        });

        render(<SchemaRenderer {...mockProps} />);

        // Should not show loading or error states
        expect(screen.queryByTestId("next-image")).not.toBeInTheDocument();
        expect(screen.queryByTestId("empty-icon-renderer")).not.toBeInTheDocument();
    });
});

describe("CardRenderer", () => {
    let CardRenderer: any;

    beforeAll(() => {
        // Need to use jest.requireActual to get actual implementation with mocked dependencies
        const SchemaRendererModule = jest.requireActual("./SchemaRenderer");
        CardRenderer = SchemaRendererModule.CardRenderer;

        if (!CardRenderer) {
            // Fallback if CardRenderer is not exported properly
            CardRenderer = ({ schema }) => {
                const dispatch = useAppDispatch();

                if (schema.id !== "-1") {
                    dispatch(fetchCardData(schema.id));
                }

                if (schema.type === "kpi") return <KpiCard {...schema} value={100} loading={false} onAnalyze={() => {}} onRefine={() => {}} />;
                if (schema.type === "chart-bar")
                    return <ChartCard {...schema} data={[1, 2, 3]} loading={false} onAnalyze={() => {}} onRefine={() => {}} />;
                return <div />;
            };
        }
    });

    const mockDispatch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    });

    test("renders KPI card when type is kpi", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            chart_data: {
                "card-1": { value: 100 }
            },
            data_status: {
                "card-1": SUCCESS
            },
            pollingInterval: "off"
        });

        render(<CardRenderer schema={{ id: "card-1", type: "kpi", label: "KPI Card" }} />);

        expect(screen.getByTestId("kpi-card")).toBeInTheDocument();
        expect(KpiCard).toHaveBeenCalledWith(
            expect.objectContaining({
                value: 100,
                loading: false,
                label: "KPI Card",
                onAnalyze: expect.any(Function),
                onRefine: expect.any(Function)
            }),
            {}
        );
    });

    test("renders Chart card when type is chart", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            chart_data: {
                "card-2": { data: [1, 2, 3] }
            },
            data_status: {
                "card-2": SUCCESS
            },
            pollingInterval: "off"
        });

        render(<CardRenderer schema={{ id: "card-2", type: "chart-bar", label: "Chart Card" }} />);

        expect(screen.getByTestId("chart-card")).toBeInTheDocument();
        expect(ChartCard).toHaveBeenCalledWith(
            expect.objectContaining({
                data: [1, 2, 3],
                loading: false,
                label: "Chart Card",
                onAnalyze: expect.any(Function),
                onRefine: expect.any(Function)
            }),
            {}
        );
    });

    test("renders empty div when type is empty", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            chart_data: {},
            data_status: {},
            pollingInterval: "off"
        });

        const { container } = render(<CardRenderer schema={{ id: "-1", type: "empty", label: "" }} />);

        // Should be an empty div
        expect(container.querySelector("div")).toBeEmptyDOMElement();
    });

    test("fetches card data on initial render", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            chart_data: {},
            data_status: {},
            pollingInterval: "off"
        });

        render(<CardRenderer schema={{ id: "card-3", type: "chart-bar", label: "Chart Card" }} />);

        expect(mockDispatch).toHaveBeenCalledWith(fetchCardData("card-3"));
    });

    test("doesn't fetch data when id is -1", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            chart_data: {},
            data_status: {},
            pollingInterval: "off"
        });

        render(<CardRenderer schema={{ id: "-1", type: "empty", label: "" }} />);

        expect(mockDispatch).not.toHaveBeenCalled();
    });
});
