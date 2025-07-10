import { render } from "@testing-library/react";
import { InlineSpinner } from "./InlineSpinner";

describe("InlineSpinner", () => {
    test("renders SVG spinner with correct attributes", () => {
        const { container } = render(<InlineSpinner />);

        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute("viewBox", "0 0 100 101");
        expect(svg).toHaveAttribute("aria-hidden", "true");
        expect(svg).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");
    });

    test("applies default classes", () => {
        const { container } = render(<InlineSpinner />);
        const svg = container.querySelector("svg");

        expect(svg).toHaveClass("fill-color-600");
        expect(svg).toHaveClass("inline");
        expect(svg).toHaveClass("size-4");
        expect(svg).toHaveClass("animate-spin");
        expect(svg).toHaveClass("text-slate-300");
    });

    test("combines custom className with default classes", () => {
        const { container } = render(<InlineSpinner className="custom-class" />);
        const svg = container.querySelector("svg");

        expect(svg).toHaveClass("fill-color-600");
        expect(svg).toHaveClass("custom-class");
    });

    test("renders both path elements", () => {
        const { container } = render(<InlineSpinner />);
        const paths = container.querySelectorAll("path");

        expect(paths).toHaveLength(2);
        paths.forEach((path) => {
            expect(path).toHaveAttribute("fill");
        });
    });

    test("has accessibility attributes", () => {
        const { container } = render(<InlineSpinner />);
        const svg = container.querySelector("svg");

        expect(svg).toHaveAttribute("aria-hidden", "true");
    });

    test("renders with no additional props", () => {
        const { container } = render(<InlineSpinner />);
        const svg = container.querySelector("svg");

        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute("viewBox", "0 0 100 101");
    });

    test("renders with a custom className only", () => {
        const { container } = render(<InlineSpinner className="custom-class" />);
        const svg = container.querySelector("svg");

        expect(svg).toHaveClass("custom-class");
    });

    test("renders with no paths missing", () => {
        const { container } = render(<InlineSpinner />);
        const paths = container.querySelectorAll("path");

        expect(paths).toHaveLength(2);
        paths.forEach((path) => {
            expect(path).toBeInTheDocument();
        });
    });
});
