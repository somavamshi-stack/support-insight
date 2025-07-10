import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ErrorMessage, LabelRenderer } from "@atoms";
import { SelectRenderer } from "../SelectRenderer";
import ReactSelect from "react-select";

// Mock dependencies
jest.mock("@atoms", () => ({
    LabelRenderer: jest.fn(() => <div data-testid="label-renderer">Test Label</div>),
    ErrorMessage: jest.fn(() => <div data-testid="error-message">Error Message</div>)
}));

jest.mock("react-select", () => {
    const MockSelect = jest.fn(({ id, placeholder, options, value, onChange, isDisabled, isSearchable }) => (
        <div data-testid="react-select">
            <select
                data-testid="select-element"
                id={id}
                disabled={isDisabled}
                value={value?.value || ""}
                onChange={(e) => {
                    const selected = options.find((opt) => opt.value === e.target.value);
                    onChange(selected);
                }}
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    ));
    return MockSelect;
});

describe("SelectRenderer", () => {
    const defaultProps = {
        id: "test-select",
        path: "test.path",
        label: "Test Select",
        handleChange: jest.fn(),
        options: [
            { label: "Option 1", value: "option1" },
            { label: "Option 2", value: "option2" },
            { label: "Option 3", value: "option3" }
        ],
        data: "option1",
        errors: {},
        visible: true,
        enabled: true,
        schema: {},
        uischema: {},
        config: {}
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders with label when showLabel is true", () => {
        render(<SelectRenderer {...defaultProps} />);

        expect(screen.getByTestId("label-renderer")).toBeInTheDocument();
        expect(LabelRenderer).toHaveBeenCalledWith(
            expect.objectContaining({
                path: "test.path",
                label: "Test Select"
            }),
            {}
        );
    });

    test("does not render label when showLabel is false", () => {
        render(<SelectRenderer {...defaultProps} showLabel={false} />);

        expect(screen.queryByTestId("label-renderer")).not.toBeInTheDocument();
    });

    test("renders ReactSelect with correct props", () => {
        render(<SelectRenderer {...defaultProps} />);

        expect(screen.getByTestId("react-select")).toBeInTheDocument();
        expect(ReactSelect).toHaveBeenCalledWith(
            expect.objectContaining({
                id: "select-test-select",
                placeholder: "Test Select",
                options: defaultProps.options,
                value: { label: "Option 1", value: "option1" },
                isSearchable: true,
                isDisabled: false
            }),
            {}
        );
    });

    test("calls handleChange with correct values when option is selected", async () => {
        render(<SelectRenderer {...defaultProps} />);

        const select = screen.getByTestId("select-element");
        fireEvent.change(select, { target: { value: "option2" } });

        expect(defaultProps.handleChange).toHaveBeenCalledWith("test.path", "option2");
    });

    test("calls handleChange with index when returnIndex is true", async () => {
        render(<SelectRenderer {...defaultProps} config={{ returnIndex: true }} />);

        const select = screen.getByTestId("select-element");
        fireEvent.change(select, { target: { value: "option2" } });

        expect(defaultProps.handleChange).toHaveBeenCalledWith("test.path", 1);
    });

    test("shows error message when returnIndex is provided", () => {
        render(<SelectRenderer {...defaultProps} config={{ returnIndex: true }} errors={{ "test.path": "This field is required" }} />);

        expect(screen.getByTestId("error-message")).toBeInTheDocument();
        expect(ErrorMessage).toHaveBeenCalledWith(
            expect.objectContaining({
                id: "test-select",
                path: "test.path",
                errors: { "test.path": "This field is required" }
            }),
            {}
        );
    });

    test("does not render when visible is false", () => {
        const { container } = render(<SelectRenderer {...defaultProps} visible={false} />);
        expect(container).toBeEmptyDOMElement();
    });

    test("renders disabled select when enabled is false", () => {
        render(<SelectRenderer {...defaultProps} enabled={false} />);

        expect(ReactSelect).toHaveBeenCalledWith(
            expect.objectContaining({
                isDisabled: true
            }),
            {}
        );
    });

    test("sets default value when data is undefined but schema.default exists", async () => {
        const schema = {
            default: "option3"
        };

        render(<SelectRenderer {...defaultProps} data={undefined} schema={schema} />);

        await waitFor(() => {
            expect(defaultProps.handleChange).toHaveBeenCalledWith("test.path", "option3");
        });
    });

    test("sets searchable off when enableFilter is false", () => {
        render(<SelectRenderer {...defaultProps} enableFilter={false} />);

        expect(ReactSelect).toHaveBeenCalledWith(
            expect.objectContaining({
                isSearchable: false
            }),
            {}
        );
    });

    test("uses schema.values as options when available", () => {
        const schemaValues = [
            { label: "Schema Option 1", value: "schema1" },
            { label: "Schema Option 2", value: "schema2" }
        ];

        render(<SelectRenderer {...defaultProps} schema={{ values: schemaValues }} />);

        expect(ReactSelect).toHaveBeenCalledWith(
            expect.objectContaining({
                options: schemaValues
            }),
            {}
        );
    });

    test("applies className to the container", () => {
        const { container } = render(<SelectRenderer {...defaultProps} className="custom-class" />);

        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveClass("custom-class");
        expect(wrapper).toHaveClass("mx-1");
    });

    test("uses correct selected value when returnIndex is true", () => {
        render(<SelectRenderer {...defaultProps} config={{ returnIndex: true }} data={1} />);

        expect(ReactSelect).toHaveBeenCalledWith(
            expect.objectContaining({
                value: { label: "Option 2", value: "option2" }
            }),
            {}
        );
    });
});
