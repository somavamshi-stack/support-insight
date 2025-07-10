"use client";

import { barlow } from "../../../assets/fonts/barlow";
import { MetricSqlButton } from "./MetricSqlButton";
import type { KGState, LogEntry } from "@types";
import { useFigAgent } from "@hooks";
import { Tabs } from "@molecules";
import { useState } from "react";

function NodeTree({
    node,
    allNodes,
    allEdges,
    depth = 0,
    threadId
}: {
    node: any;
    allNodes: any[];
    allEdges: any[];
    depth?: number;
    threadId: string;
}) {
    const children = allEdges
        .filter((e) => e.from_id === node.id)
        .map((e) => allNodes.find((n) => n.id === e.to_id))
        .filter(Boolean) as any[];

    const [open, setOpen] = useState(depth < 1);
    const isMetric = node.labels.includes("Metric");

    return (
        //icon inside theblack sql querry.
        <div className="ml-2">
            <button onClick={() => setOpen(!open)} className={`${barlow.className} text-left text-xs text-gray-200 hover:text-white`}>
                {children.length > 0 && (open ? "▼" : "▶")} <span className={`${barlow.className} font-semibold`}>{node.labels[0]}</span>:{" "}
                {node.properties?.name ?? node.id}
            </button>

            {isMetric && (
                <div className="ml-4 text-xs text-gray-400">
                    SQL:
                    {node.properties.sql ? (
                        <code className="ml-1">{String(node.properties.sql).slice(0, 60)}…</code>
                    ) : (
                        <span className="ml-1 italic">— not generated —</span>
                    )}
                    <MetricSqlButton metricId={node.id} metricName={node.properties.name ?? node.id} />
                </div>
            )}

            {open && <pre className="ml-6 text-[10px] whitespace-pre-wrap text-gray-500">{JSON.stringify(node.properties, null, 2)}</pre>}

            {open &&
                children.map((c) => <NodeTree key={c.id} node={c} allNodes={allNodes} allEdges={allEdges} depth={depth + 1} threadId={threadId} />)}
        </div>
    );
}

export function KGPanel({ state }: { state: any }) {
    const { threadId } = useFigAgent();
    const [tab, setTab] = useState<"tree" | "nodes" | "edges" | "logs">("tree");
    const kg: KGState = state?.kg || { nodes: [], edges: [] };
    const logs: LogEntry[] = state?.logs || [];

    return (
        <div className="mt-6 w-full">
            <h2 className={`${barlow.className} mt-5 mb-4 pl-2.5 text-[32px] font-semibold text-[#000000]`}>Canvas</h2>

            <div className="mb-2 text-sm text-gray-300">
                <strong>Nodes:</strong> {kg.nodes?.length}&nbsp;
                <strong>Edges:</strong> {kg.edges?.length}
            </div>

            <Tabs
                data={[
                    ["tree", "Tree"],
                    ["nodes", "Nodes"],
                    ["edges", "Edges"],
                    ["logs", "Logs"]
                ]}
                activeTab={tab}
                setActiveTab={setTab}
            />

            <div className="max-h-[50vh] w-full space-y-1 overflow-y-auto rounded bg-[#141414] p-3 text-xs text-gray-200 shadow">
                {tab === "tree" &&
                    kg.nodes
                        ?.filter((n) => n.labels.includes("KPI"))
                        .map((kpi) => <NodeTree key={kpi.id} node={kpi} allNodes={kg.nodes} allEdges={kg.edges} threadId={threadId || ""} />)}

                {tab === "nodes" &&
                    kg.nodes?.map((node) => (
                        <div key={node.id} className="border-tungsten-600 border-b pb-1">
                            <strong>{node.labels.join(",")}:</strong> {node.id} <br />
                            {JSON.stringify(node.properties, null, 2)}
                        </div>
                    ))}

                {tab === "edges" &&
                    kg.edges?.map((e) => (
                        <div key={e.id} className="border-tungsten-600 border-b pb-1">
                            ({e.from_id})─[{e.type}]→({e.to_id})
                        </div>
                    ))}

                {tab === "logs" && (logs.length === 0 ? "No logs yet" : logs.map((entry, i) => <div key={i}>• {entry.message}</div>))}
            </div>
        </div>
    );
}
