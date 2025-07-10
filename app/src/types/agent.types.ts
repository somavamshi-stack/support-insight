// src/lib/types.ts

export interface Thread {
    thread_id: string;
    thread_name: string;
    description: string;
}
export interface LogEntry {
    message: string;
    done?: boolean;
}

export interface GraphNode {
    id: string;
    labels: string[];
    properties: Record<string, any>;
    // Possibly "upsert_key" etc. if you want to display them
}

export interface GraphEdge {
    id: string;
    type: string; // e.g., "HAS_METRIC"
    from_id: string;
    to_id: string;
    properties: Record<string, any>;
}

export interface KGState {
    nodes: GraphNode[];
    edges: GraphEdge[];
}

export interface Topic {
    topic_id: string;
    name: string;
    is_verified: boolean;
}

export interface ChartSpec {
    chart_id: string;
    chart_type: string;
    datasets?: any;
    labels?: string[];
    options?: any;
    sql: string;
    series?: any[];
    data?: any[];
    backgroundColor?: string;
    borderColor?: string;
}

export interface TextSpec {
    text_id: string;
    text_type: string;
    title: string;
    content: string;
    generated_by_agent: boolean;
    metadata: {
        related_chart: string;
        format: string;
    };
}

// The entire shape of your agent’s state:
export interface AdminFlowAgentState {
    kg: KGState;
    logs: LogEntry[];
    topics: Topic[];
    messages: any[];
    charts: ChartSpec[];
    texts: TextSpec[];
    executionId?: number;
    threadId?: string;
}
