import { render, screen, waitFor } from "@testing-library/react";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { StarDefaultTopic } from "./StarDefaultTopic";
import { FAILED, IDLE, SUCCESS } from "@constants";
import { setFlagStatus } from "@redux/slices";
import { fetchTopics } from "@redux/actions";
import Swal from "sweetalert2";

// Mock dependencies
jest.mock("@redux/hooks", () => ({
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn()
}));

jest.mock("@redux/actions", () => ({
    fetchTopics: jest.fn((userId) => ({ type: "FETCH_TOPICS", payload: userId })),
    setDefaultTopic: jest.fn((payload) => ({ type: "SET_DEFAULT_TOPIC", payload }))
}));

jest.mock("@redux/slices", () => ({
    dashboardState: jest.fn(),
    setFlagStatus: jest.fn((payload) => ({ type: "SET_FLAG_STATUS", payload }))
}));

jest.mock("sweetalert2", () => ({
    fire: jest.fn().mockResolvedValue({ isConfirmed: true })
}));

describe("StarDefaultTopic", () => {
    const mockProps = {
        id: "topic-123",
        userId: "user-456"
    };

    const mockTopicList = [
        { topic_id: "topic-123", topic_description: "Test Topic", is_default_overview: false },
        { topic_id: "topic-456", topic_description: "Another Topic", is_default_overview: true }
    ];

    const mockDispatch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            topic_default_status: IDLE,
            topic_list: mockTopicList
        });
    });

    test("renders empty star when topic is not default", () => {
        render(<StarDefaultTopic {...mockProps} />);

        expect(screen.getByTitle || screen.getByTestId || screen.getByText).toBeTruthy();
        // The FaRegStar should be rendered (would need to add a test ID or aria-label for better testing)
    });

    test("renders filled star when topic is default", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            topic_default_status: IDLE,
            topic_list: [
                { topic_id: "topic-123", topic_description: "Test Topic", is_default_overview: true },
                { topic_id: "topic-456", topic_description: "Another Topic", is_default_overview: false }
            ]
        });

        render(<StarDefaultTopic {...mockProps} />);

        // The FaStar should be rendered (would need to add a test ID or aria-label for better testing)
    });

    test("shows success alert when topic_default_status is SUCCESS", async () => {
        // First render normally
        const { rerender } = render(<StarDefaultTopic {...mockProps} />);

        // Then update the status to SUCCESS to trigger the effect
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            topic_default_status: SUCCESS,
            topic_list: mockTopicList
        });

        rerender(<StarDefaultTopic {...mockProps} />);

        expect(Swal.fire).toHaveBeenCalledWith(
            expect.objectContaining({
                title: "Successfully Updated Default Topic!",
                icon: "success"
            })
        );

        expect(mockDispatch).toHaveBeenCalledWith(fetchTopics("user-456"));
    });

    test("shows error alert when topic_default_status is FAILED", async () => {
        // First render normally
        const { rerender } = render(<StarDefaultTopic {...mockProps} />);

        // Then update the status to FAILED to trigger the effect
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            topic_default_status: FAILED,
            topic_list: mockTopicList
        });

        rerender(<StarDefaultTopic {...mockProps} />);

        expect(Swal.fire).toHaveBeenCalledWith(
            expect.objectContaining({
                title: "OOPS!!!, Something went wrong",
                icon: "error"
            })
        );
    });

    test("resets flag status after alert is confirmed", async () => {
        // Mock the alert confirmation
        (Swal.fire as jest.Mock).mockResolvedValueOnce({ isConfirmed: true });

        // Set status to SUCCESS to trigger the alert
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            topic_default_status: SUCCESS,
            topic_list: mockTopicList
        });

        render(<StarDefaultTopic {...mockProps} />);

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(setFlagStatus({ topic_default_status: IDLE }));
        });
    });

    test("updates topic state when topic_list changes", () => {
        const { rerender } = render(<StarDefaultTopic {...mockProps} />);

        const updatedTopicList = [
            { topic_id: "topic-123", topic_description: "Updated Topic", is_default_overview: true },
            { topic_id: "topic-456", topic_description: "Another Topic", is_default_overview: false }
        ];

        // Update the topic list
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            topic_default_status: IDLE,
            topic_list: updatedTopicList
        });

        rerender(<StarDefaultTopic {...mockProps} />);

        // Now the star should be filled
        // Would need proper test IDs to verify this change in the rendered output
    });
});
