// import { useCoAgentStateRender } from "@copilotkit/react-core";
// import { InlineLogTimeLine } from "./InlineLogTimeline";
// import { render } from "@testing-library/react";
// import { AdminFlowAgentState } from "@types";

// // Mock dependencies
// jest.mock("@copilotkit/react-core", () => ({
//     useCoAgentStateRender: jest.fn()
// }));

// jest.mock("framer-motion", () => ({
//     motion: {
//         span: ({ children, ...props }: any) => (
//             <span data-testid="motion-span" {...props}>
//                 {children}
//             </span>
//         )
//     }
// }));

// describe("InlineLogTimeLine", () => {
//     let renderFunction: (arg: { state: Partial<AdminFlowAgentState> }) => JSX.Element | null;
//     const originalRandomUUID = crypto.randomUUID;

//     beforeEach(() => {
//         jest.clearAllMocks();
//         crypto.randomUUID = jest.fn(() => "mock-uuid");

//         // Capture the render function when useCoAgentStateRender is called
//         (useCoAgentStateRender as jest.Mock).mockImplementation(({ render }) => {
//             renderFunction = render;
//             return null;
//         });
//     });

//     afterEach(() => {
//         crypto.randomUUID = originalRandomUUID;
//     });

//     test("renders null initially", () => {
//         const { container } = render(<InlineLogTimeLine />);
//         expect(container.firstChild).toBeNull();
//     });

//     test("calls useCoAgentStateRender with correct parameters", () => {
//         render(<InlineLogTimeLine />);
//         expect(useCoAgentStateRender).toHaveBeenCalledWith(
//             expect.objectContaining({
//                 name: "knowledge_agent"
//             })
//         );
//     });

//     test("initializes refs correctly", () => {
//         render(<InlineLogTimeLine />);
//         expect(crypto.randomUUID).toHaveBeenCalled();
//     });

//     test("render function handles new execution ID", () => {
//         render(<InlineLogTimeLine />);

//         // First render with execution ID 1
//         const result1 = renderFunction({
//             state: {
//                 executionId: 1,
//                 logs: [{ message: "Log 1", done: false }]
//             }
//         });

//         // Reset the UUID mock to return a different value
//         (crypto.randomUUID as jest.Mock).mockReturnValueOnce("new-uuid");

//         // Second render with execution ID 2
//         const result2 = renderFunction({
//             state: {
//                 executionId: 2,
//                 logs: [
//                     { message: "Log 1", done: false },
//                     { message: "Log 2", done: false }
//                 ]
//             }
//         });

//         // Verify UUID was generated for new execution
//         expect(crypto.randomUUID).toHaveBeenCalledTimes(3); // Initial + two renders
//     });

//     test("render function slices logs correctly", () => {
//         render(<InlineLogTimeLine />);

//         // First render with logs
//         renderFunction({
//             state: {
//                 executionId: 1,
//                 logs: [{ message: "Initial log", done: false }]
//             }
//         });

//         // Second render with more logs but same execution ID
//         const result = renderFunction({
//             state: {
//                 executionId: 1,
//                 logs: [
//                     { message: "Initial log", done: true },
//                     { message: "New log", done: false }
//                 ]
//             }
//         });

//         // The rendered div should exist
//         expect(result).not.toBeNull();
//         expect(result?.props.className).toBe("space-y-1");

//         // Note: We're not testing the commented out code inside the div
//     });
// });
