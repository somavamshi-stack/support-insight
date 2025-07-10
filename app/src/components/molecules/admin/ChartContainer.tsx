"use client";

import { adminState, setSelectedDashboardGraph } from "@redux/slices";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { ChartGallery } from "@molecules";
import { ChartSpec } from "@types";

export function ChartContainer({ charts }: { charts: ChartSpec[] }) {
    const dispatch = useAppDispatch();
    const { selectedDashboardGraphs } = useAppSelector(adminState);

    const handleChartClick = (spec: ChartSpec) => {
        const isSelected = selectedDashboardGraphs.some((chart) => chart.chart_id === spec.chart_id);

        const updatedGraphs = isSelected
            ? selectedDashboardGraphs.filter((chart) => chart.chart_id !== spec.chart_id)
            : [...selectedDashboardGraphs, spec];

        dispatch(setSelectedDashboardGraph(updatedGraphs));
    };

    return (
        <div className={`relative inset-0 z-50 h-full w-full overflow-auto rounded-lg border bg-white p-4 transition-all`}>
            <ChartGallery charts={charts} handleChartClick={handleChartClick} />
        </div>
    );
}
