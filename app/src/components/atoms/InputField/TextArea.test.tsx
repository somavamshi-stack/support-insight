import { render, screen } from "@testing-library/react";
import styles from "./TextArea.module.css";
import { TextArea } from "./TextArea";

describe("TextArea", () => {
    it("renders textarea element without label when label prop is not provided", () => {
        const { container } = render(<TextArea />);
        const textarea = screen.getByRole("textbox");
        expect(textarea).toBeInTheDocument();
        expect(container.querySelector("label")).not.toBeInTheDocument();
    });

    it("displays label when provided", () => {
        const labelText = "Test Label";
        render(<TextArea label={labelText} />);
        expect(screen.getByText(labelText)).toBeInTheDocument();
    });

    it("applies passed props to the textarea", () => {
        const placeholderText = "Enter your message";
        const rows = 4;
        const defaultValue = "Hello";
        render(<TextArea placeholder={placeholderText} rows={rows} defaultValue={defaultValue} disabled />);
        const textarea = screen.getByRole("textbox");
        expect(textarea).toHaveAttribute("placeholder", placeholderText);
        expect(textarea).toHaveAttribute("rows", rows.toString());
        expect(textarea).toHaveValue(defaultValue);
        expect(textarea).toBeDisabled();
    });

    it("has correct CSS classes applied", () => {
        const { container } = render(<TextArea label="Test Label" />);
        expect(container.firstChild).toHaveClass(styles.wrapper);
        expect(screen.getByText("Test Label")).toHaveClass(styles.label);
        expect(screen.getByRole("textbox")).toHaveClass(styles.textArea);
    });

    it("does not render label when label prop is empty string", () => {
        const { container } = render(<TextArea label="" />);
        expect(container.querySelector("label")).not.toBeInTheDocument();
    });
});
