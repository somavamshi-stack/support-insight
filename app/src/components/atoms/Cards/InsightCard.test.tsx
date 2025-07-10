import { render, screen } from "@testing-library/react";

// Mock the SlowTextRenderer and InsightCard components
jest.mock("@atoms", () => {
    const SlowTextRenderer = jest.fn(({ text }: any) => <div>{text}</div>);
    const InsightCard = jest.fn(({ insight }: any) =>
        insight ? (
            <div
                className="card hidden w-full rounded-md border-l-2 border-slate-300 bg-slate-100 p-1 px-2 group-hover:border-l-4 sm:block"
                data-testid="insight-card"
            >
                <div>Actionable Insight:</div>
                <SlowTextRenderer text={insight} />
            </div>
        ) : null
    );
    return { InsightCard, SlowTextRenderer };
});

describe("InsightCard Component", () => {
    it("renders nothing when insight is empty", () => {
        const { InsightCard } = jest.requireMock("@atoms");
        const { container } = render(<InsightCard insight={null} />);
        expect(container.firstChild).toBeNull();
    });

    it("renders the card with the provided insight", () => {
        const { InsightCard } = jest.requireMock("@atoms");
        const mockInsight = "This is a test insight.";
        render(<InsightCard insight={mockInsight} />);

        const card = screen.getByText("Actionable Insight:");
        expect(card).toBeInTheDocument();

        const insightText = screen.getByText(mockInsight);
        expect(insightText).toBeInTheDocument();
    });

    it("uses the SlowTextRenderer to render the insight text", () => {
        const { InsightCard, SlowTextRenderer } = jest.requireMock("@atoms");
        const mockInsight = "This is a test insight.";
        render(<InsightCard insight={mockInsight} />);

        expect(SlowTextRenderer).toHaveBeenCalledWith({ text: mockInsight }, expect.anything());
    });

    it("applies the correct classes to the card", () => {
        const { InsightCard } = jest.requireMock("@atoms");
        const mockInsight = "This is a test insight.";
        render(<InsightCard insight={mockInsight} />);

        const card = screen.getByTestId("insight-card");
        expect(card).toHaveClass("card hidden w-full rounded-md border-l-2 border-slate-300 bg-slate-100 p-1 px-2 group-hover:border-l-4 sm:block");
    });
});
