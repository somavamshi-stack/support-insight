import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { addDataSourceConnection } from "@redux/actions/adminActions";
import { DataSourceConnectionForm } from "./DataSourceConnectionForm";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { IDLE, SUCCESS } from "@constants";
import Swal from "sweetalert2";

// Mock dependencies
jest.mock("@redux/hooks", () => ({
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn()
}));

jest.mock("@redux/actions/adminActions", () => ({
    addDataSourceConnection: jest.fn()
}));

jest.mock("sweetalert2", () => ({
    fire: jest.fn()
}));

jest.mock("@monaco-editor/react", () => ({
    Editor: jest.fn(({ value, onChange }) => <textarea data-testid="yaml-editor" value={value} onChange={(e) => onChange(e.target.value)} />)
}));

describe("DataSourceConnectionForm", () => {
    const mockDispatch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
        (useAppSelector as unknown as jest.Mock).mockReturnValue({ topic_create_status: IDLE });
    });

    test("renders Snowflake form by default", () => {
        render(<DataSourceConnectionForm />);
        expect(screen.getByLabelText("Host:")).toBeInTheDocument();
        expect(screen.getByLabelText("User:")).toBeInTheDocument();
        expect(screen.getByLabelText("Password:")).toBeInTheDocument();
        expect(screen.getByLabelText("Warehouse:")).toBeInTheDocument();
        expect(screen.getByLabelText("Timeout (s):")).toBeInTheDocument();
    });

    test("switches to YAML form when YAML radio button is selected", () => {
        render(<DataSourceConnectionForm />);
        const yamlRadio = screen.getByLabelText("YAML");
        fireEvent.click(yamlRadio);
        expect(screen.getByTestId("yaml-editor")).toBeInTheDocument();
    });

    test("displays error for invalid YAML syntax", async () => {
        render(<DataSourceConnectionForm />);
        const yamlRadio = screen.getByLabelText("YAML");
        fireEvent.click(yamlRadio);

        const yamlEditor = screen.getByTestId("yaml-editor");
        fireEvent.change(yamlEditor, { target: { value: "invalid: yaml: syntax" } });

        const submitButton = screen.getByText("Connect");
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("Invalid YAML syntax")).toBeInTheDocument();
        });
    });

    test("dispatches addDataSourceConnection for valid Snowflake form submission", async () => {
        // Setup the component
        render(<DataSourceConnectionForm />);

        // Fill out the form with valid values
        fireEvent.change(screen.getByLabelText(/Host:/i), { target: { value: "test.snowflakecomputing.com" } });
        fireEvent.change(screen.getByLabelText(/User:/i), { target: { value: "testuser" } });
        fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: "password12345" } }); // Ensure password meets the 8 character minimum
        fireEvent.change(screen.getByLabelText(/Warehouse:/i), { target: { value: "TEST_WAREHOUSE" } });
        fireEvent.change(screen.getByLabelText(/Timeout \(s\):/i), { target: { value: "120" } });

        // Get and click the submit button
        const submitButton = screen.getByRole("button", { name: /Connect/i });
        await waitFor(() => {
            expect(submitButton).not.toBeDisabled();
        });

        fireEvent.click(submitButton);

        // Verify the action was dispatched with correct data
        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(
                addDataSourceConnection(
                    expect.objectContaining({
                        account: "test.snowflakecomputing.com",
                        username: "testuser",
                        password: "password12345",
                        warehouse: "TEST_WAREHOUSE",
                        timeout: 120
                    })
                )
            );
        });
    });

    test("shows success message when topic_create_status is SUCCESS", async () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({ topic_create_status: SUCCESS });

        render(<DataSourceConnectionForm />);

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(
                expect.objectContaining({
                    icon: "success",
                    title: "Data source connection created successfully"
                })
            );
        });
    });

    test("displays server error message on submission failure", async () => {
        // Mock dispatch to reject with an error
        (mockDispatch as jest.Mock).mockRejectedValueOnce(new Error("Submission failed"));

        // Setup the component
        render(<DataSourceConnectionForm />);

        // Fill out the form with valid values
        fireEvent.change(screen.getByLabelText(/Host:/i), { target: { value: "test.snowflakecomputing.com" } });
        fireEvent.change(screen.getByLabelText(/User:/i), { target: { value: "testuser" } });
        fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: "password12345" } }); // Ensure password meets the 8 character minimum
        fireEvent.change(screen.getByLabelText(/Warehouse:/i), { target: { value: "TEST_WAREHOUSE" } });
        fireEvent.change(screen.getByLabelText(/Timeout \(s\):/i), { target: { value: "120" } });

        // Get and click the submit button
        const submitButton = screen.getByRole("button", { name: /Connect/i });
        await waitFor(() => {
            expect(submitButton).not.toBeDisabled();
        });

        fireEvent.click(submitButton);

        // Verify error message is displayed
        await waitFor(() => {
            expect(screen.getByText("Submission failed. Please try again.")).toBeInTheDocument();
        });
    });
});
