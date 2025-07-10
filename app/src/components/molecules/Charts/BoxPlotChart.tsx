"use client";

import { BarController, BarElement, CategoryScale, Chart, LinearScale, Tooltip } from "chart.js";
import { generateRandomColors } from "@utils";
import { useEffect, useRef } from "react";

Chart.register(LinearScale, CategoryScale, BarController, BarElement, Tooltip);

const BoxPlotChart = ({ datasets, boxPlotData }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const color = generateRandomColors(1)[0];

    useEffect(() => {
        if (!chartRef.current) return;
        const ctx = chartRef.current.getContext("2d");
        if (!ctx) return;

        const data = {
            labels: boxPlotData?.labels || [],
            datasets: datasets?.map((dataset: { data: number[][]; label: string }, index: number) => ({
                label: dataset.label || `Box Plot ${index + 1}`,
                data: dataset.data,
                backgroundColor: "rgba(0,0,0,0)", // Make bars invisible
                borderWidth: 0, // Remove borders
                borderColor: "rgba(0,0,0,0)"
            }))
        };

        const allValues = datasets.flatMap((d: any) => d.data.flat());
        const maxY = Math.max(...allValues);

        const boxPlotChart = new Chart(ctx, {
            type: "bar",
            data,
            options: {
                responsive: true,
                indexAxis: "x",
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: boxPlotData?.xLabel || "X-Axis",
                            font: { size: 12, weight: "bold" }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: boxPlotData?.yLabel || "Y-Axis",
                            font: { size: 12, weight: "bold" }
                        },
                        beginAtZero: true,
                        suggestedMax: maxY + maxY * 0.1,
                        ticks: {
                            callback: function (value) {
                                if (Number(value) % 1 === 0) {
                                    return value;
                                }
                                return "";
                            } // Show only integer values
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem: any) {
                                const label = tooltipItem.label;
                                const value = tooltipItem.raw;
                                return `${label}\nMin: ${value[0]}\nQ1: ${value[1]}\nMedian: ${value[2]}\nQ3: ${value[3]}\nMax: ${value[4]}`;
                            }
                        }
                    },
                    legend: {
                        display: false,
                        position: "bottom" as const
                    }
                },
                elements: {
                    bar: {
                        borderWidth: 0
                    }
                }
            },
            plugins: [
                {
                    id: "customBoxPlot",
                    beforeDraw: (chart) => {
                        const ctx = chart.ctx;
                        chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
                            chart.getDatasetMeta(datasetIndex).data.forEach((bar: any, index: number) => {
                                const dataPoint = dataset.data[index];
                                if (!dataPoint || dataPoint.length !== 5) return;

                                const x = bar.x;
                                const boxWidth = Math.min(20, chart.width / boxPlotData?.labels.length / 2);

                                const minY = chart.scales.y.getPixelForValue(dataPoint[0]);
                                const q1Y = chart.scales.y.getPixelForValue(dataPoint[1]);
                                const medianY = chart.scales.y.getPixelForValue(dataPoint[2]);
                                const q3Y = chart.scales.y.getPixelForValue(dataPoint[3]);
                                const maxY = chart.scales.y.getPixelForValue(dataPoint[4]);

                                ctx.save();
                                ctx.strokeStyle = color;
                                ctx.fillStyle = color;
                                ctx.lineWidth = 2;

                                // Draw vertical whiskers
                                ctx.beginPath();
                                ctx.moveTo(x, maxY);
                                ctx.lineTo(x, q3Y);
                                ctx.moveTo(x, minY);
                                ctx.lineTo(x, q1Y);
                                ctx.stroke();

                                // Draw horizontal whiskers
                                ctx.beginPath();
                                ctx.moveTo(x - boxWidth / 2, maxY);
                                ctx.lineTo(x + boxWidth / 2, maxY);
                                ctx.moveTo(x - boxWidth / 2, minY);
                                ctx.lineTo(x + boxWidth / 2, minY);
                                ctx.stroke();

                                // Draw the box (Q1 to Q3)
                                const boxTop = Math.min(q1Y, q3Y);
                                const boxHeight = Math.abs(q1Y - q3Y);
                                ctx.fillRect(x - boxWidth / 2, boxTop, boxWidth, boxHeight);

                                // Draw median line
                                ctx.beginPath();
                                ctx.moveTo(x - boxWidth / 2, medianY);
                                ctx.lineTo(x + boxWidth / 2, medianY);
                                ctx.stroke();

                                ctx.restore();
                            });
                        });
                    }
                }
            ]
        });

        return () => {
            boxPlotChart.destroy();
        };
    }, []);

    return <canvas ref={chartRef} data-testid="boxplot-canvas"></canvas>;
};

export default BoxPlotChart;
