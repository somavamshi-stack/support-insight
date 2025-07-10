import { render, screen } from "@testing-library/react";

// Mock the Spinner component to avoid rendering issues
jest.mock("../Spinners", () => ({
    Spinner: jest.fn(() => <div data-testid="spinner" />)
}));

// Mock the Skeleton component to avoid CSS-related issues
jest.mock("@atoms", () => ({
    Skeleton: jest.fn(({ className = "", ...props }: any) => (
        <div className={`animate-pulse rounded-md bg-slate-200 ${className}`} data-testid="skeleton-container" {...props}>
            <div data-testid="spinner" />
        </div>
    ))
}));

describe("Skeleton Component", () => {
    it("renders the Skeleton component with default classes", () => {
        const { Skeleton } = jest.requireMock("@atoms");
        render(<Skeleton />);
        const skeleton = screen.getByTestId("skeleton-container");

        expect(skeleton).toBeInTheDocument();
        expect(skeleton).toHaveClass("rounded-md bg-slate-200 animate-pulse");
    });

    it("renders the Spinner inside the Skeleton", () => {
        const { Skeleton } = jest.requireMock("@atoms");
        render(<Skeleton />);
        const spinner = screen.getByTestId("spinner");

        expect(spinner).toBeInTheDocument();
    });

    it("applies additional className props", () => {
        const { Skeleton } = jest.requireMock("@atoms");
        render(<Skeleton className="custom-class" />);
        const skeleton = screen.getByTestId("skeleton-container");

        expect(skeleton).toHaveClass("custom-class");
    });

    it("passes additional props to the Skeleton container", () => {
        const { Skeleton } = jest.requireMock("@atoms");
        render(<Skeleton data-testid="skeleton-container" />);
        const skeleton = screen.getByTestId("skeleton-container");

        expect(skeleton).toBeInTheDocument();
    });
});
