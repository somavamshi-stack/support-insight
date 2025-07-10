import { render, screen } from "@testing-library/react";
import ChordWrapper from "./ChordWrapper";
import { ChordChart } from "@atoms";

// Mock dependencies
jest.mock("@atoms", () => ({
    ChordChart: jest.fn(() => <div data-testid="chord-chart">ChordChart</div>)
}));

describe("ChordWrapper", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders the ChordWrapper component", () => {
        render(<ChordWrapper />);
        const wrapper = screen.getByRole("region");
        expect(wrapper).toBeInTheDocument();
    });

    test("renders the ChordChart component with correct props", () => {
        render(<ChordWrapper />);
        const chordChart = screen.getByTestId("chord-chart");
        expect(chordChart).toBeInTheDocument();

        // Verify that ChordChart is called with the correct props
        expect(ChordChart).toHaveBeenCalledWith(
            {
                matrix: [
                    [0, 5, 2],
                    [5, 0, 3],
                    [2, 3, 0]
                ],
                labels: ["Dept A", "Dept B", "Dept C"]
            },
            {}
        );
    });

    test("applies the correct wrapper styles", () => {
        render(<ChordWrapper />);
        const wrapper = screen.getByRole("region");
        expect(wrapper).toHaveClass("mx-auto bg-transparent");
    });
});
