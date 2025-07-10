"use client";

import { MessageRole, TextMessage } from "@copilotkit/runtime-client-gql";
import { useCoAgent } from "@copilotkit/react-core";
import { ADMIN_AGENT_NAME } from "@constants";
import { AdminFlowAgentState } from "@types";
import { useFigAgent } from "@hooks";

export function MetricSqlButton({ metricId, metricName }: { metricId: string; metricName: string }) {
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

    return (
        <span
            title="Generate SQL"
            className="ml-1 cursor-pointer text-blue-400 hover:text-blue-200"
            onClick={() =>
                run(
                    () =>
                        new TextMessage({
                            role: MessageRole.User,
                            content: `Please generate SQL for the metric "${metricName}" (id=${metricId}).`
                        })
                )
            }
        >
            ⚡︎
        </span>
    );
}
