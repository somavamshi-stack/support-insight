import { render, screen } from "@testing-library/react";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
    test("renders the spinner component", () => {
        const { container } = render(<Spinner />);
        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute("viewBox", "0 0 100 100");
    });

    test("renders default loading text", () => {
        render(<Spinner />);
        expect(screen.getByText("Loading")).toBeInTheDocument();
    });

    test("renders custom loading text", () => {
        const customText = "Please wait...";
        render(<Spinner>{customText}</Spinner>);
        expect(screen.getByText(customText)).toBeInTheDocument();
    });

    test("renders all path elements with animations", () => {
        const { container } = render(<Spinner />);
        const paths = container.querySelectorAll("path");
        expect(paths).toHaveLength(3);

        paths.forEach((path) => {
            const animateTransform = path.querySelector("animateTransform");
            expect(animateTransform).toBeInTheDocument();
            expect(animateTransform).toHaveAttribute("attributeName", "transform");
            expect(animateTransform).toHaveAttribute("type", "rotate");
            expect(animateTransform).toHaveAttribute("repeatCount", "indefinite");
        });
    });

    test("applies correct classes to the container", () => {
        const { container } = render(<Spinner />);
        const div = container.querySelector("div");
        expect(div).toHaveClass("flex");
        expect(div).toHaveClass("h-full");
        expect(div).toHaveClass("grow");
        expect(div).toHaveClass("flex-col");
        expect(div).toHaveClass("items-center");
        expect(div).toHaveClass("justify-center");
        expect(div).toHaveClass("select-none");
    });

    test("applies correct classes to the text element", () => {
        const { container } = render(<Spinner />);
        const textDiv = container.querySelector("div.text-color-label");
        expect(textDiv).toHaveClass("mt-2");
        expect(textDiv).toHaveClass("text-lg");
        expect(textDiv).toHaveClass("font-semibold");
        expect(textDiv).toHaveClass("opacity-50");
    });
});
