// import { useEffect, useState } from "react";
// import { Pagination } from "../Paginator";

// import { FcCollapse, FcDown, FcExpand, FcUp } from "react-icons/fc";
// import { lightTheme } from "@uiw/react-json-view/light";
// import { barlow } from "../../../assets/fonts/barlow";
// import { EmptyIconRenderer } from "@molecules";
// import JsonView from "@uiw/react-json-view";
// import { Centered } from "@atoms";

// export const TableRenderer = ({
//     columns = [],
//     data = [],
//     clientSide = true,
//     pageNo = 1,
//     pageSizes = [
//         { value: 10, label: "10" },
//         { value: 15, label: "15", default: true },
//         { value: 20, label: "20" },
//         { value: 50, label: "50" },
//         { value: 100, label: "100" }
//     ],
//     defaultSort,
//     defaultSortDirection = "asc",
//     actionHandler,
//     showSelect,
//     fieldIndentifier = "id",
//     getData,
//     noDataIndication,
//     onPageNumberChange,
//     onPageSizeChange,
//     selectedRecords,
//     size = 10,
//     total = 0
// }: any) => {
//     const [pageSize, setPageSize] = useState(pageSizes?.find((p) => p.default)?.value || 10);
//     const [pageNumber, setPageNumber] = useState(pageNo);
//     const [sortProperty, setSortProperty] = useState(defaultSort);
//     const [sortDirection, setSortDirection] = useState(defaultSortDirection);
//     const [isCheckAll, setIsCheckAll] = useState(false);
//     const [list, setList] = useState([]);
//     const [checkedRecords, setCheckedRecords] = useState<any[]>([]);

//     useEffect(() => {
//         if (!Number.isNaN(pageNo)) setPageNumber(pageNo);
//     }, [pageNo]);

//     useEffect(() => {
//         if (selectedRecords) selectedRecords(checkedRecords);
//     }, [checkedRecords, selectedRecords]);

//     useEffect(() => {
//         if (!Number.isNaN(size)) setPageSize(size);
//     }, [size]);

//     const sortedItems = Array.isArray(list)
//         ? [...list].sort((a, b) => {
//               if (sortProperty) {
//                   const colProperties = columns.find((c) => c.dataField === sortProperty);
//                   const sortByDate = colProperties?.sortType === "date";
//                   const objA = sortByDate ? new Date(a[sortProperty]) : a[sortProperty];
//                   const objB = sortByDate ? new Date(b[sortProperty]) : b[sortProperty];
//                   if (objA < objB) {
//                       return sortDirection === "asc" ? -1 : 1;
//                   }
//                   if (objA > objB) {
//                       return sortDirection === "asc" ? 1 : -1;
//                   }
//               }
//               return 0;
//           })
//         : [];

//     useEffect(() => {
//         if (data?.length > 0) setList(data);
//         else setList([]);
//         if (getData) {
//             getData(checkedRecords, isCheckAll);
//         }
//     }, [data, getData, checkedRecords, isCheckAll]);

//     const handleSelectAll = () => {
//         if (!isCheckAll) {
//             setIsCheckAll(true);
//             setCheckedRecords(list);
//         } else {
//             setIsCheckAll(false);
//             setCheckedRecords([]);
//         }
//     };

//     const handleSelect = (record) => {
//         if (isChecked(record)) {
//             setCheckedRecords((prev) => prev.filter((item) => item[fieldIndentifier] !== record[fieldIndentifier]));
//         } else {
//             setCheckedRecords((prev) => [...prev, record]);
//         }
//     };

//     const isChecked = (record) => {
//         return checkedRecords?.some((r) => r[fieldIndentifier] === record[fieldIndentifier]);
//     };

//     const handlePageNumberChange = (n) => {
//         setPageNumber(n);
//         if (onPageNumberChange) {
//             onPageNumberChange(n);
//         }
//     };
//     const handlePageSizeChange = (n) => {
//         setPageNumber(1);
//         setPageSize(n);
//         if (onPageNumberChange) onPageNumberChange(1);
//         if (onPageSizeChange) onPageSizeChange(n);
//     };
//     const totalRecords = total || list?.length;

//     return (
//         <>
//             <div className={`pb-2} mb-1 max-h-[70vh] w-full`}>
//                 <table className={`${barlow.className} w-full border-separate border-spacing-0 bg-white text-sm text-[#]`}>
//                     <TableHeader
//                         columns={columns}
//                         sortDirection={sortDirection}
//                         sortProperty={sortProperty}
//                         setSortProperty={setSortProperty}
//                         setSortDirection={setSortDirection}
//                         actionHandler={actionHandler}
//                         showSelect={showSelect}
//                         handleSelectAll={handleSelectAll}
//                         isCheckAll={isCheckAll || checkedRecords.length === data?.length}
//                     />
//                     <tbody className="divide-y">
//                         {totalRecords === 0 ? (
//                             <tr className={`${barlow.className} cursor-pointer border-b border-[#E4E4E7]`}>
//                                 <td
//                                     colSpan={showSelect || actionHandler != null ? columns.length + 1 : columns.length}
//                                     className="border border-[#E4E4E7] px-1 py-0.5"
//                                 >
//                                     <Centered>
//                                         <EmptyIconRenderer title={noDataIndication} />
//                                     </Centered>
//                                 </td>
//                             </tr>
//                         ) : (
//                             paginate(clientSide, sortedItems, pageSize, pageNumber)?.map((record, index, records) => (
//                                 <RenderRow
//                                     key={index}
//                                     actualRowIndex={index}
//                                     rowIndex={clientSide ? index + (pageNumber - 1) * pageSize : index}
//                                     record={record}
//                                     columns={columns}
//                                     actionHandler={actionHandler}
//                                     showSelect={showSelect}
//                                     data={data}
//                                     handleSelect={handleSelect}
//                                     isChecked={isChecked}
//                                     isCheckAll={isCheckAll}
//                                     checkedRecords={checkedRecords}
//                                     total={records.length}
//                                     fieldIndentifier={fieldIndentifier}
//                                 />
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//             {totalRecords > 0 && pageSizes && (
//                 <Pagination
//                     totalRecords={totalRecords}
//                     page={pageNumber}
//                     size={pageSize}
//                     count={Math.ceil(totalRecords / pageSize)}
//                     recordsCount={pageSize}
//                     handlePageItems={(ps) => {
//                         handlePageSizeChange(ps);
//                     }}
//                     showRecordsDropdown={true}
//                     onChange={(_, va) => {
//                         handlePageNumberChange(va);
//                     }}
//                     pageSizes={pageSizes}
//                 />
//             )}
//         </>
//     );
// };

// function TableHeader({
//     columns,
//     sortDirection,
//     sortProperty,
//     setSortProperty,
//     setSortDirection,
//     actionHandler,
//     showSelect,
//     handleSelectAll,
//     isCheckAll
// }) {
//     const [isHovering, setIsHovering] = useState(false);
//     const handleSortClick = (property) => {
//         if (sortProperty === property) {
//             setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
//         } else {
//             setSortProperty(property);
//             setSortDirection("asc");
//         }
//     };

//     return (
//         <thead className={`${barlow.className} sticky top-0 bg-[#343434] text-base font-normal text-white`}>
//             <tr>
//                 {showSelect && (
//                     <th className="w-10 border border-[#fff]">
//                         <input
//                             type="checkbox"
//                             id="selectAll"
//                             className="{`${barlow.className} text-[#343434]`} mx-2 rounded p-4 font-normal"
//                             checked={isCheckAll}
//                             onChange={handleSelectAll}
//                         />
//                     </th>
//                 )}
//                 {columns?.map(({ text, dataField, sort, width, style = "text-left", sorter, center }, index, arr) => (
//                     <th
//                         key={index}
//                         className={`p-1.5 ${style || ""} ${sort ? "cursor-pointer" : ""} font-semibold tracking-wider select-none ${!showSelect && index === 0 ? "" : ""} ${!actionHandler && index === arr?.length - 1 ? "rounded-tr-md" : ""} ${index < arr?.length - 1 ? "border border-[#fff]" : ""} `}
//                         style={{ width: width + "px" }}
//                         onClick={sort && !sorter ? () => handleSortClick(dataField) : sorter ? sorter : () => {}}
//                         onMouseOver={() => setIsHovering(true)}
//                         onMouseOut={() => setIsHovering(false)}
//                     >
//                         <div
//                             className={`${center ? "text-center" : "ps-2"} flex flex-row ${center && !sort ? "justify-center" : "justify-between"} items-center`}
//                         >
//                             {center && sort && <div />}
//                             <label>{text}</label>
//                             {sort && (
//                                 <div style={{ opacity: dataField == sortProperty || isHovering ? 1 : 0 }}>
//                                     {sortDirection === "asc" ? <FcUp /> : <FcDown />}
//                                 </div>
//                             )}
//                         </div>
//                     </th>
//                 ))}
//                 {actionHandler && (
//                     <th
//                         className={`${barlow.className}border-[#E4E4E7] sticky top-0 flex w-full justify-center border p-2 font-semibold select-none`}
//                     >
//                         Actions
//                     </th>
//                 )}
//             </tr>
//         </thead>
//     );
// }

// function paginate(clientSide, array, page_size, page_number) {
//     return !clientSide ? array : array.slice((page_number - 1) * page_size, page_number * page_size);
// }

// function RenderRow({
//     record,
//     rowIndex,
//     actualRowIndex,
//     columns,
//     actionHandler,
//     showSelect,
//     handleSelect,
//     isChecked,
//     checkedRecords,
//     total,
//     fieldIndentifier
// }: any) {
//     const checkedRecord = checkedRecords?.map((r) => r[fieldIndentifier]).includes(record[fieldIndentifier]);
//     return (
//         <tr
//             key={`row-${rowIndex}`}
//             className={`${checkedRecord && "bg-blue-100 text-[#343434]"} hover:bg-color-050 cursor-pointer border-b border-[#343434]`}
//         >
//             {showSelect && (
//                 <td
//                     id={`row-${fieldIndentifier}-${rowIndex}-${actualRowIndex}`}
//                     className={`border-[#E4E4E7]w-10 border hover:shadow-md ${actualRowIndex === total - 1 ? "rounded-bl-md" : ""}`}
//                 >
//                     <input
//                         key={record[fieldIndentifier]}
//                         type="checkbox"
//                         id={"check-" + record[fieldIndentifier]}
//                         onChange={() => handleSelect(record)}
//                         checked={isChecked(record)}
//                         className="mx-2 text-[#343434]"
//                     />
//                 </td>
//             )}
//             {columns.map((column, colIndex) => {
//                 return (
//                     <td
//                         id={`row-${fieldIndentifier}-${rowIndex}-${colIndex}`}
//                         key={`row-${rowIndex}-${colIndex}`}
//                         className={`tw-flex tw-flex-row border border-[#E4E4E7] px-3 py-2 text-[#000] hover:shadow-md`}
//                         style={{ width: column.width }}
//                     >
//                         {CellRenderer(column, record, rowIndex, colIndex)}
//                     </td>
//                 );
//             })}
//             {actionHandler && (
//                 <td
//                     className={`hover:border-color-300 border border-[#E4E4E7] text-center hover:shadow-md ${actualRowIndex === total - 1 ? "rounded-br-md" : ""}`}
//                 >
//                     {actionHandler(record, rowIndex)}
//                 </td>
//             )}
//         </tr>
//     );
// }

// function CellRenderer(col, record, rowIndex, colIndex) {
//     const field = record[col.dataField];
//     if (typeof col.formatter == "function") {
//         return col.formatter(field, record, rowIndex, colIndex);
//     }
//     const colProperties = col.enum?.find((c) => c.const === field);
//     switch (col.format) {
//         case "chip":
//             return <ChipComponent value={field} />;
//         case "link":
//             return <LinkComponent value={field} />;
//         case "json":
//             return <JsonComponent value={field} />;
//         case "json-viewer":
//             return <JsonViewerComponent value={field} />;
//         case "accordion":
//             return <AccordionComponent record={record} col={col} />;
//         default:
//             return (
//                 <div
//                     className={`ps-4 select-all ${col.style ? col.style : ""} ${
//                         colProperties?.class ? colProperties.class + "px-1 py-0.5 hover:shadow" : ""
//                     } ${col.center ? "text-center" : ""}`}
//                 >
//                     {colProperties != null ? colProperties.title : field}
//                 </div>
//             );
//     }
// }

// const ChipComponent = ({ value }) => {
//     return (
//         <a
//             href="#"
//             className="mr-2 inline-flex w-full items-center justify-center border border-[#e4e4e4] bg-[#e4e4e4] px-2.5 py-0.5 text-[10px] font-medium text-blue-100 hover:bg-blue-200"
//         >
//             {value}%
//         </a>
//     );
// };

// const LinkComponent = ({ value }) => {
//     const openInNewTab = (url) => {
//         window.open(url, "_blank", "noreferrer");
//     };
//     return (
//         <button role="link" onClick={() => openInNewTab(value)} className="text-blue-500">
//             {value}
//         </button>
//     );
// };

// const JsonComponent = ({ value }) => {
//     return (
//         <textarea
//             className="m-1 w-full rounded-md border border-gray-300 bg-[#fff] text-[10px] text-[#000] select-all"
//             disabled={true}
//             value={JSON.stringify(value, null, 2)}
//         />
//     );
// };

// const JsonViewerComponent = ({ value }) => {
//     return <JsonView value={typeof value === "string" ? JSON.parse(value) : value} style={lightTheme} displayDataTypes={false} collapsed={true} />;
// };

// const AccordionComponent = ({ record, col }) => {
//     const recordData = record[col.field];
//     const [open, setOpen] = useState(false);
//     return (
//         <div className="rounded border bg-white">
//             <button
//                 onClick={() => setOpen(!open)}
//                 className="flex w-full items-center justify-between px-4 py-1 text-neutral-800 transition-transform duration-200 ease-in-out focus:outline-none"
//             >
//                 <span>Accordion Item</span>
//                 {open ? <FcCollapse /> : <FcExpand />}
//             </button>
//             {open && (
//                 <div className="transition-max-h border p-1">
//                     <div className="p-1">
//                         <table className="border">
//                             <thead>
//                                 <tr>
//                                     {Object.keys(recordData).map((item, index) => (
//                                         <th
//                                             key={index}
//                                             className="bg-color-300 text-[#000]-label border-b-2 border-[#E4E4E7] p-1 px-2 text-left text-[10px] font-semibold tracking-wider select-none"
//                                         >
//                                             {item}
//                                         </th>
//                                     ))}
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 <tr>
//                                     {Object.keys(recordData).map((key, index) => (
//                                         <td
//                                             key={index}
//                                             className="border-b border-[#E4E4E7] bg-white px-4 py-2 text-center text-[14px] text-black select-all"
//                                         >
//                                             {recordData[key]}
//                                         </td>
//                                     ))}
//                                 </tr>
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };
