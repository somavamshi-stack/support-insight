import { SelectRenderer } from "@molecules";
import { usePagination } from "@hooks";

function renderItem(item) {
    switch (item.type) {
        case "previous":
            return (
                <div
                    className={`inline-flex cursor-pointer items-center rounded-l-md border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-gray-500 select-none hover:bg-gray-50 ${
                        item.disabled && "bg-gray-200 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                        if (!item.disabled) item.onClick();
                    }}
                >
                    <span className="sr-only">Previous</span>
                    <svg className="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            fillRule="evenodd"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            );
        case "next":
            return (
                <div
                    className={`inline-flex cursor-pointer items-center rounded-r-md border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-gray-500 select-none hover:bg-gray-50 ${
                        item.disabled && "bg-gray-200 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                        if (!item.disabled) item.onClick();
                    }}
                >
                    <span className="sr-only">Next</span>
                    <svg className="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            fillRule="evenodd"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            );
        case "first":
        case "last":
        case "page":
            return (
                <div
                    className={`flex cursor-pointer border px-3 py-2 text-center text-xs font-medium select-none ${
                        item.selected ? "bg-color-0200 border-color-0700 text-color-0800" : "text-color-label border-slate-200 hover:bg-slate-50"
                    }`}
                    onClick={item.onClick}
                >
                    {item.page}
                </div>
            );
        case "end-ellipsis":
            return (
                <span className="inline-flex cursor-pointer items-center border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 select-none">
                    ...
                </span>
            );
        default:
    }
}

const getPagination = (page, size, count) => {
    const limit = size ? +size : 10;
    const offset = Number(page) * limit;
    return { limit, offset, start: offset - limit + 1, end: count < offset ? count : offset };
};

export const Pagination = (props) => {
    const { page, size, totalRecords, count, handlePageItems, recordsCount, showRecordsDropdown = false, pageSizes = [] } = props;
    const { start, end } = getPagination(page, size, totalRecords);
    const { items } = usePagination(props);
    return (
        <div className="flex items-center justify-between rounded-md bg-white p-2 sm:px-2">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div className="select-none">
                    {count > 0 && (
                        <p className="text-xs text-gray-700">
                            Showing
                            <span className="px-1 font-medium">{start}</span>
                            to
                            <span className="px-1 font-medium">{end}</span>
                            of
                            <span className="px-1 font-medium">{totalRecords}</span>
                            results
                        </p>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <nav className="mr-2 inline-flex items-center justify-center space-x-px rounded-md" aria-label="Pagination">
                        {items.map((item, index) => (
                            <div key={index}>
                                {renderItem({
                                    ...item,
                                    count: count
                                })}
                            </div>
                        ))}
                    </nav>
                    {showRecordsDropdown && (
                        <SelectRenderer
                            showLabel={false}
                            options={pageSizes}
                            enableFilter={false}
                            data={recordsCount}
                            handleChange={(_, ev) => handlePageItems(ev)}
                            className="h-7 text-center"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
