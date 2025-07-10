import { render, screen } from "@testing-library/react";
import { ErrorMessage } from "./ErrorMessage";

describe("ErrorMessage", () => {
    test("renders the error message when errors are provided", () => {
        const errors = "This is an error message.";
        render(<ErrorMessage id="test-id" path="test-path" errors={errors} />);

        const label = screen.getByText(errors);
        expect(label).toBeInTheDocument();
        expect(label).toHaveAttribute("id", "test-id-error-msg");
        expect(label).toHaveAttribute("for", "test-path"); // Fixed: Check for `for` instead of `htmlFor`
        expect(label).toHaveClass("block", "w-full", "text-left", "text-[10px]", "font-medium", "text-red-600", "select-none");
    });

    test("does not render anything when errors are not provided", () => {
        const { container } = render(<ErrorMessage id="test-id" path="test-path" errors={null} />);
        expect(container).toBeEmptyDOMElement();
    });

    test("renders multiple error messages when errors is an array", () => {
        const errors = ["Error 1", "Error 2"];
        render(<ErrorMessage id="test-id" path="test-path" errors={errors} />);

        // Fixed: Use a function matcher to find text split across multiple nodes
        const label = screen.getByText((content, element) => {
            const hasText = (node: Node) => node.textContent === "Error 1Error 2";
            const nodeHasText = element ? hasText(element) : false;
            const childrenDontHaveText = Array.from(element?.children || []).every((child) => !hasText(child));
            return nodeHasText && childrenDontHaveText;
        });

        expect(label).toBeInTheDocument();
        expect(label).toHaveTextContent("Error 1Error 2");
    });

    test("renders nothing when errors is an empty array", () => {
        const { container } = render(<ErrorMessage id="test-id" path="test-path" errors={[]} />);
        expect(container).toBeEmptyDOMElement();
    });
});
