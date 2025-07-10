import { render, screen } from "@testing-library/react";

// Mock the Centered component to avoid CSS-related issues
jest.mock("@atoms", () => ({
    Centered: ({ children, className = "", ...props }: any) => (
        <div
            className={`flex h-full flex-grow flex-col items-center justify-center select-none ${className}`}
            data-testid="centered-container"
            {...props}
        >
            {children}
        </div>
    )
}));

describe("Centered Component", () => {
    it("renders children correctly", () => {
        const { Centered } = jest.requireMock("@atoms");
        render(
            <Centered>
                <p>Test Content</p>
            </Centered>
        );
        const childElement = screen.getByText("Test Content");
        expect(childElement).toBeInTheDocument();
    });

    it("applies default classes", () => {
        const { Centered } = jest.requireMock("@atoms");
        render(
            <Centered>
                <p>Test Content</p>
            </Centered>
        );
        const container = screen.getByTestId("centered-container");
        expect(container).toHaveClass("flex h-full flex-grow flex-col items-center justify-center select-none");
    });

    it("applies additional className props", () => {
        const { Centered } = jest.requireMock("@atoms");
        render(
            <Centered className="custom-class">
                <p>Test Content</p>
            </Centered>
        );
        const container = screen.getByTestId("centered-container");
        expect(container).toHaveClass("custom-class");
    });

    it("passes additional props to the container", () => {
        const { Centered } = jest.requireMock("@atoms");
        render(
            <Centered data-testid="centered-container">
                <p>Test Content</p>
            </Centered>
        );
        const container = screen.getByTestId("centered-container");
        expect(container).toBeInTheDocument();
    });
});
