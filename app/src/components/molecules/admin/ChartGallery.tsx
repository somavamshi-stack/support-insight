"use client";

import { Chart as ChartJS, ChartTypeRegistry } from "chart.js";
import { Bar, Line, Scatter } from "react-chartjs-2";
import { useAppSelector } from "@redux/hooks";
import { adminState } from "@redux/slices";
import { useEffect, useRef } from "react";
import "@sgratzl/chartjs-chart-boxplot";
import { ChartSpec } from "@types";

type ChartJSOrUndefined<TType extends keyof ChartTypeRegistry = keyof ChartTypeRegistry> = ChartJS<TType> | undefined;

function normalise(spec: ChartSpec) {
    const { labels = [], datasets, series, data, backgroundColor, borderColor } = spec;

    // Case 1: Already in valid Chart.js format
    if (Array.isArray(datasets)) {
        return {
            labels,
            datasets
        };
    }

    // Case 2: Convert simplified { series: [{ label, values }] } → Chart.js shape
    if (Array.isArray(series)) {
        return {
            labels,
            datasets: series.map((s) => ({
                label: s.label ?? "series",
                data: s.values ?? s.data ?? [],
                backgroundColor: s.backgroundColor ?? "rgba(0,0,0,0.1)",
                borderColor: s.borderColor ?? "rgba(0,0,0,1)"
            }))
        };
    }

    // Case 3: fallback for single series { data: [...] }
    if (Array.isArray(data)) {
        return {
            labels,
            datasets: [
                {
                    label: spec.chart_id,
                    data,
                    backgroundColor,
                    borderColor
                }
            ]
        };
    }

    console.warn("ChartGallery: unknown dataset shape", spec);
    return { labels: [], datasets: [] };
}

function renderChart(spec: ChartSpec, openChat: boolean) {
    const data = normalise(spec);
    const options = spec.options ? { ...spec.options, responsive: true, maintainAspectRatio: true } : {};

    return <ChartRenderer data={data} options={options} chart_type={spec.chart_type} openChat={openChat} />;
}

const ChartRenderer = ({ data, options, chart_type, openChat }: { data: any; options: any; chart_type: string; openChat: boolean }) => {
    const lineChartRef = useRef<ChartJSOrUndefined<"line">>(null);
    const barChartRef = useRef<ChartJSOrUndefined<"bar">>(null);
    const scatterChartRef = useRef<ChartJSOrUndefined<"scatter">>(null);

    useEffect(() => {
        const resizeChart = () => {
            if (
                (chart_type === "line" && lineChartRef.current) ||
                (chart_type === "bar" && barChartRef.current) ||
                (chart_type === "scatter" && scatterChartRef.current)
            ) {
                const chartInstance =
                    chart_type === "line" ? lineChartRef.current : chart_type === "bar" ? barChartRef.current : scatterChartRef.current;

                chartInstance?.resize();
            }
        };
        resizeChart();
    }, [chart_type, openChat]);

    switch (chart_type) {
        case "line":
            return <Line ref={lineChartRef} data={data} options={options} />;
        case "bar":
            return <Bar ref={barChartRef} data={data} options={options} />;
        case "scatter":
            return <Scatter ref={scatterChartRef} data={data} options={options} />;
        default:
            return <p className="text-xs text-red-500">Unknown chart type: {chart_type}</p>;
    }
};

export function ChartGallery({ charts, handleChartClick }: { charts: ChartSpec[]; handleChartClick: (spec: ChartSpec) => void }) {
    const { isChatOpen } = useAppSelector(adminState);
    const { selectedDashboardGraphs } = useAppSelector(adminState);

    if (!charts?.length) return null;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-stretch justify-start gap-5 text-sm">
                {charts.map((spec) => (
                    <div
                        key={spec.chart_id}
                        className={`max-w-[600px] min-w-[400px] flex-1 basis-[300px] cursor-pointer rounded-lg border bg-white p-3 hover:shadow-md ${selectedDashboardGraphs.some((graph) => graph.chart_id === spec.chart_id) ? "border-2 border-[#000000]" : "border border-[#e4e4e4]"}`}
                        onClick={() => handleChartClick(spec)}
                    >
                        <h4 className="mb-1 text-sm font-semibold">{spec.options?.plugins?.title?.text ?? spec.chart_id}</h4>
                        <div className="relative max-h-[400px] w-full">{renderChart(spec, isChatOpen)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
