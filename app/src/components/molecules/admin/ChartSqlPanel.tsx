"use client";

import { MessageRole, TextMessage } from "@copilotkit/runtime-client-gql";
import { AdminFlowAgentState, ChartSpec } from "@types";
import { sql as sqlLang } from "@codemirror/lang-sql";
import { useCoAgent } from "@copilotkit/react-core";
import { ADMIN_AGENT_NAME } from "@constants";
import { useEffect, useState } from "react";
import { useFigAgent } from "@hooks";
import dynamic from "next/dynamic";

/* CodeMirror client-only */
const CodeMirror = dynamic(() => import("@uiw/react-codemirror").then((m) => m.default), { ssr: false });

export function ChartSqlPanel({ charts = [] }: { charts: ChartSpec[] }) {
    const [chartId, setChartId] = useState<string>(charts.length ? charts[0].chart_id : "__new__");
    const current = charts.find((c) => c.chart_id === chartId);
    const [sqlText, setSqlText] = useState<string>(current?.sql ?? "");

    /* refresh when selection changes */
    useEffect(() => {
        const c = charts.find((x) => x.chart_id === chartId);
        setSqlText(c?.sql ?? "");
    }, [chartId, charts]);

    const [expanded, setExpanded] = useState(false);

    /* runner – keyed by thread */
    const { threadId } = useFigAgent();
    const { run } = useCoAgent<AdminFlowAgentState>({
        name: ADMIN_AGENT_NAME,
        initialState: {
            kg: { nodes: [], edges: [] },
            topics: [],
            charts: [],
            logs: [],
            messages: [],
            executionId: 0,
            threadId
        }
    });

    const handleRun = () =>
        run(
            () =>
                new TextMessage({
                    role: MessageRole.User,
                    content: `Please execute the following SQL and update the chart ` + `with id "${chartId}".\n\n${sqlText}`
                })
        );

    return (
        <div
            className={`relative rounded border bg-white p-4 transition-all ${expanded ? "fixed inset-0 z-50 h-full w-full overflow-auto" : "w-2/3"}`}
        >
            <button
                className="absolute top-2 right-2 rounded border bg-gray-200 px-2 py-1 text-sm shadow hover:bg-gray-300"
                onClick={() => setExpanded(!expanded)}
            >
                {expanded ? "Close" : "Expand"}
            </button>

            {charts.length ? (
                <select value={chartId} onChange={(e) => setChartId(e.target.value)} className="mb-2 rounded border bg-white px-2 py-1 text-sm">
                    {charts.map((c) => (
                        <option key={c.chart_id} value={c.chart_id}>
                            {c.chart_id}
                        </option>
                    ))}
                </select>
            ) : (
                <p className="mb-2 text-sm text-gray-500">No charts yet – create one from chat or run SQL below.</p>
            )}

            <CodeMirror
                value={sqlText}
                onChange={setSqlText}
                extensions={[sqlLang()]}
                basicSetup={{ lineNumbers: true }}
                theme="dark"
                style={{ fontSize: "13px", lineHeight: "1.4" }}
                height="200px"
            />

            <button onClick={handleRun} className="mt-2 rounded bg-blue-600 px-3 py-1 text-xs text-white" disabled={!sqlText.trim()}>
                Run SQL → Chart
            </button>
        </div>
    );
}
