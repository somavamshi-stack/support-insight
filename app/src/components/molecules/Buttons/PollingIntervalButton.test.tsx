import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { PollingIntervalButton } from "./PollingIntervalButton";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { setPollingInterval } from "@redux/slices";

// Mock dependencies
jest.mock("@redux/hooks", () => ({
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn()
}));

jest.mock("@atoms", () => ({
    CustomSelect: ({ id, options, value, onChange }: any) => (
        <select id={id} data-testid={`${id}-select`} value={value} onChange={(e) => onChange({ value: e.target.value })}>
            {options.map((option: any) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    ),
    RefreshButton: ({ id, onClick }: any) => (
        <button id={id} data-testid={`${id}-button`} onClick={onClick}>
            Refresh
        </button>
    )
}));

jest.mock("@hooks", () => ({
    usePrevious: jest.fn()
}));

describe("PollingIntervalButton", () => {
    const mockDispatch = jest.fn();
    const mockUsePrevious = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
        (useAppSelector as unknown as jest.Mock).mockReturnValue({ pollingInterval: "off" });
        (mockUsePrevious as jest.Mock).mockReturnValue("off");
    });

    test("renders the PollingIntervalButton with RefreshButton and CustomSelect", () => {
        render(<PollingIntervalButton />);
        expect(screen.getByTestId("poll-interval-button")).toBeInTheDocument();
        expect(screen.getByTestId("poll-interval-select")).toBeInTheDocument();
        expect(screen.getByText("Refresh")).toBeInTheDocument();
    });

    test("dispatches setPollingInterval when CustomSelect value changes", () => {
        render(<PollingIntervalButton />);
        const select = screen.getByTestId("poll-interval-select");

        fireEvent.change(select, { target: { value: "10000" } });

        expect(mockDispatch).toHaveBeenCalledWith(setPollingInterval("10000"));
    });

    test("toggles polling interval on RefreshButton click", async () => {
        // Mock the initial state - pollingInterval is "off"
        (useAppSelector as unknown as jest.Mock).mockReturnValue({ pollingInterval: "off" });
        (mockUsePrevious as jest.Mock).mockReturnValue("off");

        render(<PollingIntervalButton />);
        const refreshButton = screen.getByTestId("poll-interval-button");

        // First click: Toggle from "off" to 10000
        fireEvent.click(refreshButton);
        expect(mockDispatch).toHaveBeenNthCalledWith(1, setPollingInterval(10000));

        // Clear previous calls to start fresh for the second part of the test
        mockDispatch.mockClear();

        // Mock the state for the second scenario - pollingInterval is now 10000
        (useAppSelector as unknown as jest.Mock).mockReturnValue({ pollingInterval: 10000 });
        (mockUsePrevious as jest.Mock).mockReturnValue("off");

        // Re-render with new mocked state
        render(<PollingIntervalButton />);
        const newRefreshButton = screen.getAllByTestId("poll-interval-button")[1];

        // Second click: Toggle back from 10000 to "off"
        fireEvent.click(newRefreshButton);
        expect(mockDispatch).toHaveBeenNthCalledWith(1, setPollingInterval("off"));
    });

    test("resets polling interval after 50ms on RefreshButton click", async () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({ pollingInterval: 10000 });
        (mockUsePrevious as jest.Mock).mockReturnValue("off");

        render(<PollingIntervalButton />);
        const refreshButton = screen.getByTestId("poll-interval-button");

        fireEvent.click(refreshButton);

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(setPollingInterval("off"));
        });
    });
});
