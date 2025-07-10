import { Button, Centered } from "@atoms";
import { withAuth } from "@utils";

import { CategoryScale, Chart as ChartJS, LinearScale, LineElement, PointElement } from "chart.js";
import { Line } from "react-chartjs-2";
import { useState } from "react";
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

/* ─── mocked runners ───────────────────────────── */
function runSqlMock(sql: string) {
    // pretend we queried a warehouse; return array of points
    return Array.from({ length: 10 }, (_, i) => ({
        x: i,
        y: Math.random() * 100
    }));
}
function runCypherMock(cypher: string) {
    return { ok: true, createdNodes: 7, createdEdges: 12 };
}

/* ─── component ────────────────────────────────── */
export function WorkBenchComponent() {
    const [activeTab, setActiveTab] = useState<"sql" | "cypher" | "chart">("cypher");
    const [sql, setSql] = useState("-- generated SQL will appear here");
    const [cypher, setCypher] = useState("// generated Cypher will appear here");
    const [chartData, setChartData] = useState<{ x: number; y: number }[]>([]);

    /* convert to chart.js dataset */
    const lineData = {
        labels: chartData.map((p) => p.x),
        datasets: [
            {
                label: "mock‑metric",
                data: chartData.map((p) => p.y)
            }
        ]
    };

    return (
        <div className="custom-scrollbar flex h-full w-full flex-col overflow-y-auto p-2">
            <Centered className="h-full items-start justify-start p-2">
                {/* tab bar */}
                <div className="mb-2 inline-flex overflow-hidden rounded text-xs">
                    {["sql", "cypher", "chart"].map((k, i) => (
                        <Button
                            label={k.toUpperCase()}
                            key={k + i}
                            onClick={() => {
                                setActiveTab(k as any);
                            }}
                            className={`${activeTab === k ? "bg-color-600 hover:bg-color-700 text-white" : "bg-black text-gray-200 hover:bg-gray-700"} rounded-none text-xs`}
                        />
                    ))}
                </div>

                {/* SQL pane */}
                {activeTab === "sql" && (
                    <div className="w-full">
                        <textarea
                            value={sql}
                            onChange={(e) => setSql(e.target.value)}
                            className="h-40 w-full rounded bg-black p-2 font-mono text-sm text-gray-100"
                        />
                        <Button
                            label="Run SQL → Chart"
                            onClick={() => {
                                const res = runSqlMock(sql);
                                setChartData(res);
                                setActiveTab("chart");
                            }}
                            className="bg-color-600 hover:bg-color-700 mt-2 rounded text-xs text-white"
                        />
                    </div>
                )}

                {/* Cypher pane */}
                {activeTab === "cypher" && (
                    <div className="w-full">
                        <textarea
                            value={cypher}
                            onChange={(e) => setCypher(e.target.value)}
                            className="h-40 w-full rounded bg-black p-2 font-mono text-sm text-gray-100"
                        />
                        <Button
                            label="Run Cypher (Mock)"
                            onClick={() => alert(JSON.stringify(runCypherMock(cypher), null, 2))}
                            className="bg-color-600 hover:bg-color-700 mt-2 rounded px-3 py-1 text-xs text-white"
                        />
                    </div>
                )}

                {/* Chart pane */}
                {activeTab === "chart" &&
                    (chartData.length === 0 ? (
                        <p className="text-xs text-gray-400">Run a SQL query first to see the chart preview.</p>
                    ) : (
                        <div>
                            <Line data={lineData} />
                        </div>
                    ))}
            </Centered>
        </div>
    );
}

export const WorkBenchConfigPanel = withAuth(WorkBenchComponent);
