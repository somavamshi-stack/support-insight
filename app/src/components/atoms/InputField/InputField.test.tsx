// import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import { InputField } from "./InputField";

// describe("InputField Component", () => {
//     const defaultProps = {
//         label: "Test Label",
//         description: "Test Description",
//         enabled: true,
//         isError: false
//     };

//     it("renders correctly with default props", () => {
//         render(<InputField {...defaultProps} />);

//         const input = screen.getByRole("textbox");
//         expect(input).toBeEnabled();
//         expect(input).toHaveAttribute("placeholder", "Test Description");
//         // Check for concatenated class name without space
//         expect(input).toHaveClass(/bg-white/); // Regex match for partial class
//     });

//     it("applies disabled state correctly", () => {
//         render(<InputField {...defaultProps} enabled={false} />);

//         const input = screen.getByRole("textbox");
//         expect(input).toBeDisabled();
//         // Check for concatenated class name without space
//         expect(input).toHaveClass(/bg-slate-100/); // Regex match for partial class
//     });

//     // Rest of the tests remain the same
//     it("renders without label when not provided", () => {
//         render(<InputField {...defaultProps} label={undefined} />);
//         expect(screen.queryByText("Test Label")).not.toBeInTheDocument();
//     });

//     it("applies error state styling", () => {
//         render(<InputField {...defaultProps} isError={true} />);

//         const input = screen.getByRole("textbox");
//         expect(input).toHaveClass("focus:ring-red-500");
//         expect(input).not.toHaveClass("hover:ring-color-500");
//     });

//     it("accepts and displays additional input attributes", () => {
//         render(<InputField {...defaultProps} type="email" data-testid="custom-input" aria-label="Additional aria label" />);

//         const input = screen.getByRole("textbox");
//         expect(input).toHaveAttribute("type", "email");
//         expect(input).toHaveAttribute("aria-label", "Additional aria label");
//         expect(input).toHaveAttribute("data-testid", "custom-input");
//     });

//     it("updates value correctly when typed in", async () => {
//         render(<InputField {...defaultProps} />);
//         const input = screen.getByRole("textbox");

//         await userEvent.type(input, "Test Input");
//         expect(input).toHaveValue("Test Input");
//     });

//     it("applies correct classes for error state focus", () => {
//         const { container } = render(<InputField {...defaultProps} isError={true} />);
//         const input = container.querySelector("input");

//         input?.focus();
//         expect(input).toHaveClass("focus:ring-red-500");
//     });

//     it("matches snapshot", () => {
//         const { container } = render(<InputField {...defaultProps} />);
//         expect(container).toMatchSnapshot();
//     });
// });
