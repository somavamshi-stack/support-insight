import { UserInformationCard } from "./UserInformationCard";
import { render, screen } from "@testing-library/react";
import { useAppSelector } from "@redux/hooks";

// Mock the Redux hooks
jest.mock("@redux/hooks", () => ({
    useAppSelector: jest.fn(),
    useAppDispatch: jest.fn().mockReturnValue(jest.fn())
}));

describe("UserInformationCard Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("does not render the email container when no emails are available", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            user: {
                emails: []
            }
        });

        render(<UserInformationCard />);

        const emailElement = screen.queryByText("test@example.com");
        expect(emailElement).not.toBeInTheDocument();

        const iconElement = screen.queryByTestId("email-icon");
        expect(iconElement).not.toBeInTheDocument();
    });

    it("renders an empty container when user is null", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            user: null
        });

        const { container } = render(<UserInformationCard />);
        expect(container.firstChild).toBeInTheDocument();
        expect(container.firstChild).toBeEmptyDOMElement();
    });
});
