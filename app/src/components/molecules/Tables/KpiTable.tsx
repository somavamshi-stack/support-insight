import { barlow } from "../../../assets/fonts/barlow";
import React from "react";

interface Column {
    key: string;
    label: string;
}

interface KpiTableProps {
    columns: Column[];
    data: Record<string, any>[];
}

const KpiTable: React.FC<KpiTableProps> = ({ columns, data }) => {
    return (
        <div className="w-full overflow-x-auto">
            {data?.length > 0 ? (
                <table className="w-full border-collapse rounded bg-white border-2 border-[#e4e4e4]">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`${barlow.className} text-left px-4 py-2 text-sm bg-[#F7F7F7]font-medium text-gray-700 border-r border-gray-200 last:border-r-0`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        className={`${barlow.className} px-4 py-2 text-sm text-gray-900 border-r border-gray-200 last:border-r-0`}
                                    >
                                        {row[col.key] !== undefined ? row[col.key] : "-"}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="flex items-center justify-center py-8 text-gray-500">
                    No data available
                </div>
            )}
        </div>
    );
};

export default KpiTable;