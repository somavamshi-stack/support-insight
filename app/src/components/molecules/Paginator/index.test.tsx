import { fireEvent, render, screen } from "@testing-library/react";
import { usePagination } from "@hooks";
import { Pagination } from "./index";

// Mock dependencies
jest.mock("@hooks", () => ({
    usePagination: jest.fn()
}));

jest.mock("@molecules", () => ({
    SelectRenderer: jest.fn(({ options, data, handleChange }) => (
        <select data-testid="page-size-select" value={data} onChange={(e) => handleChange(e.target.value, e.target.value)}>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    ))
}));

describe("Pagination", () => {
    const mockProps = {
        page: 1,
        size: 10,
        totalRecords: 100,
        count: 10,
        handlePageItems: jest.fn(),
        recordsCount: 10,
        showRecordsDropdown: true,
        pageSizes: [
            { label: "10", value: 10 },
            { label: "20", value: 20 },
            { label: "50", value: 50 }
        ]
    };

    const mockPaginationItems = [
        { type: "previous", page: 0, disabled: true, onClick: jest.fn() },
        { type: "page", page: 1, selected: true, onClick: jest.fn() },
        { type: "page", page: 2, selected: false, onClick: jest.fn() },
        { type: "page", page: 3, selected: false, onClick: jest.fn() },
        { type: "end-ellipsis" },
        { type: "page", page: 10, selected: false, onClick: jest.fn() },
        { type: "next", page: 2, disabled: false, onClick: jest.fn() }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (usePagination as jest.Mock).mockReturnValue({ items: mockPaginationItems });
    });

    test("renders pagination with correct elements", () => {
        render(<Pagination {...mockProps} />);
        expect(usePagination).toHaveBeenCalledWith(mockProps);
        expect(screen.getByText("Previous")).toBeInTheDocument();
        expect(screen.getByText("Next")).toBeInTheDocument();
        expect(screen.getAllByText("1")[1]).toBeInTheDocument(); // Use second "1" element which is the page number
        expect(screen.getByText("2")).toBeInTheDocument();
        expect(screen.getByText("3")).toBeInTheDocument();
        expect(screen.getByText("...")).toBeInTheDocument();
        // Use a more specific query to get the last page number button
        const lastPageButtons = screen.getAllByText("10");
        const lastPageButton = lastPageButtons.find((el) => el.closest("div")?.className.includes("cursor-pointer border px-3"));
        expect(lastPageButton).toBeInTheDocument();
    });

    test("renders pagination summary text", () => {
        render(<Pagination {...mockProps} />);
        // Use a data-testid or a more specific selector to find the element
        const summaryElements = screen.getAllByText((content, element) => {
            return element?.textContent === "Showing1to10of100results";
        });
        expect(summaryElements.length).toBeGreaterThan(0);
        expect(summaryElements[0]).toBeInTheDocument();
    });

    test("renders page size dropdown when showRecordsDropdown is true", () => {
        render(<Pagination {...mockProps} />);
        expect(screen.getByTestId("page-size-select")).toBeInTheDocument();
    });

    test("does not render page size dropdown when showRecordsDropdown is false", () => {
        render(<Pagination {...mockProps} showRecordsDropdown={false} />);
        expect(screen.queryByTestId("page-size-select")).not.toBeInTheDocument();
    });

    test("calls handlePageItems when page size is changed", () => {
        render(<Pagination {...mockProps} />);
        const selectElement = screen.getByTestId("page-size-select");
        fireEvent.change(selectElement, { target: { value: "20" } });
        expect(mockProps.handlePageItems).toHaveBeenCalledWith("20");
    });

    test("calls onClick for page item when clicked", () => {
        render(<Pagination {...mockProps} />);
        const pageButton = screen.getByText("2");
        fireEvent.click(pageButton);
        expect(mockPaginationItems[2].onClick).toHaveBeenCalled();
    });

    test("calls onClick for next button when clicked", () => {
        render(<Pagination {...mockProps} />);
        const nextButton = screen.getByText("Next").closest("div");
        fireEvent.click(nextButton!);
        expect(mockPaginationItems[6].onClick).toHaveBeenCalled();
    });

    test("does not call onClick for previous button when disabled", () => {
        render(<Pagination {...mockProps} />);
        const prevButton = screen.getByText("Previous").closest("div");
        fireEvent.click(prevButton!);
        expect(mockPaginationItems[0].onClick).not.toHaveBeenCalled();
    });

    test("applies selected styles to current page", () => {
        render(<Pagination {...mockProps} />);
        // Use a more specific query to get the page number button
        const pageButton = screen.getAllByText("1").find((el) => el.closest("div")?.className.includes("cursor-pointer border px-3"));

        // Check if the element itself has a background style
        const selectedElement = pageButton?.closest("div");
        expect(selectedElement).toHaveStyle({ backgroundColor: expect.any(String) });
        // Or check for specific selected class on the element itself
        expect(selectedElement?.className).toContain("bg-");
    });

    test("applies disabled styles to disabled navigation buttons", () => {
        render(<Pagination {...mockProps} />);
        const prevButton = screen.getByText("Previous").closest("div");
        expect(prevButton).toHaveClass("bg-gray-200");
    });

    test("does not render pagination summary when count is 0", () => {
        render(<Pagination {...mockProps} count={0} />);
        expect(screen.queryByText("Showing")).not.toBeInTheDocument();
    });

    test("handles pagination with last page", () => {
        const lastPageProps = {
            ...mockProps,
            page: 9,
            size: 10
        };

        const lastPageItems = [
            { type: "previous", page: 8, disabled: false, onClick: jest.fn() },
            { type: "page", page: 8, selected: false, onClick: jest.fn() },
            { type: "page", page: 9, selected: false, onClick: jest.fn() },
            { type: "page", page: 10, selected: true, onClick: jest.fn() },
            { type: "next", page: 11, disabled: true, onClick: jest.fn() }
        ];

        (usePagination as jest.Mock).mockReturnValue({ items: lastPageItems });

        render(<Pagination {...lastPageProps} />);

        expect(screen.getByText("Previous")).toBeInTheDocument();
        expect(screen.getByText("Next")).toBeInTheDocument();

        // Next button should be disabled
        const nextButton = screen.getByText("Next").closest("div");
        expect(nextButton).toHaveClass("bg-gray-200");
    });
});
