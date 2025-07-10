import { fireEvent, render, screen } from "@testing-library/react";
import RecentQuestions from "./RecentQuestions";

describe("RecentQuestions", () => {
    const mockQuestions = [
        { topic_id: "topic-1", topic_description: "What is machine learning?" },
        { topic_id: "topic-2", topic_description: "How does AI work?" },
        { topic_id: "topic-3", topic_description: "What is the best programming language?" },
        { topic_id: "topic-4", topic_description: "What is quantum computing?" } // This one shouldn't appear as we only show 3
    ];

    const mockOnClickQuestion = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders the component with correct title", () => {
        render(<RecentQuestions questions={mockQuestions} onClickQuestion={mockOnClickQuestion} />);

        const heading = screen.getByText("Recently asked");
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveClass("text-2xl");
    });

    test("displays only the first three questions", () => {
        render(<RecentQuestions questions={mockQuestions} onClickQuestion={mockOnClickQuestion} />);

        // These three should be found
        expect(screen.getByText("What is machine learning?")).toBeInTheDocument();
        expect(screen.getByText("How does AI work?")).toBeInTheDocument();
        expect(screen.getByText("What is the best programming language?")).toBeInTheDocument();

        // This one should not be found as we only show 3
        expect(screen.queryByText("What is quantum computing?")).not.toBeInTheDocument();
    });

    test("calls onClickQuestion with correct topic_id when question is clicked", () => {
        render(<RecentQuestions questions={mockQuestions} onClickQuestion={mockOnClickQuestion} />);

        const secondQuestion = screen.getByText("How does AI work?");
        fireEvent.click(secondQuestion);

        expect(mockOnClickQuestion).toHaveBeenCalledTimes(1);
        expect(mockOnClickQuestion).toHaveBeenCalledWith("topic-2");
    });

    test("doesn't break when onClickQuestion is not provided", () => {
        render(<RecentQuestions questions={mockQuestions} />);

        const question = screen.getByText("What is machine learning?");

        // This should not throw an error
        expect(() => fireEvent.click(question)).not.toThrow();
    });

    test("renders empty state gracefully when no questions are provided", () => {
        render(<RecentQuestions questions={[]} onClickQuestion={mockOnClickQuestion} />);

        const heading = screen.getByText("Recently asked");
        expect(heading).toBeInTheDocument();

        // No question buttons should be rendered
        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    test("applies correct styling to question buttons", () => {
        render(<RecentQuestions questions={mockQuestions} onClickQuestion={mockOnClickQuestion} />);

        const buttons = screen.getAllByRole("button");
        expect(buttons).toHaveLength(3);

        buttons.forEach((button) => {
            expect(button).toHaveClass("cursor-pointer");
            expect(button).toHaveClass("rounded-md");
            expect(button).toHaveClass("border");
            expect(button).toHaveClass("bg-white");
            expect(button).toHaveClass("shadow");
        });
    });

    test("renders with questions that have missing topic_description", () => {
        const incompleteQuestions = [
            { topic_id: "topic-1" }, // Missing topic_description
            { topic_id: "topic-2", topic_description: "How does AI work?" }
        ];

        render(<RecentQuestions questions={incompleteQuestions} onClickQuestion={mockOnClickQuestion} />);

        // Should render an empty button for the first question
        const buttons = screen.getAllByRole("button");
        expect(buttons).toHaveLength(2);
        expect(buttons[0].textContent).toBe("");
    });
});
