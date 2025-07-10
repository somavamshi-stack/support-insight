export interface KpiData {
    label: string;
    value: number;
    trend?: number;
    currency?: boolean;
    insight?: string;
}

export interface ChartDataset {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
}

export interface ChartData {
    type: "line" | "bar" | "doughnut";
    title: string;
    labels: string[];
    data?: number[];
    datasets?: ChartDataset[];
    backgroundColor?: string[];
    insight?: string;
}

export interface LayoutSection {
    type: "kpiGrid" | "chart";
    dataSource?: string;
    dataKey?: string;
    itemsPerRow?: number;
}

export interface UISchema {
    version: string;
    layout: Layout;
}

export interface Layout {
    rows: Row[];
}

export interface Row {
    columns: Column[];
}

export interface Column {
    width: number;
    components: UIComponent[];
}

export interface UIComponent {
    type: string;
    props: Record<string, any>;
    children?: UIComponent[];
}

export interface DashboardData {
    kpis: KpiData[];
    charts: Record<string, ChartData>;
    layout: {
        sections: LayoutSection[];
    };
}

export interface DashboardContent {
    uiSchema: UISchema;
    dashboardData: DashboardData;
}

export interface schemaType {
    id: string;
    label: string;
    type: string;
    [key: string]: any;
}

export interface DashboardSchema {
    type: string;
    elements?: DashboardSchema[];
    id: string;
    label?: string;
    created?: number;
    enabled?: boolean;
    colSpan?: number;
    chartData?: any;
}

export interface TileLayoutProps {
    label: string;
    loading: boolean;
    children?: React.ReactNode;
    insight?: string;
    printInsightBefore?: boolean;
    onRefine: () => void;
    onAnalyze: () => void;
}

export interface KpiCardProps extends TileLayoutProps {
    data: { value: number };
    trend?: number;
    currency: boolean;
}

export interface ChartCardProps extends TileLayoutProps {
    chartData: any;
    chartOptions?: any;
    type: string;
    backgroundBandsPlugin?: any;
}

export interface SchemaRendererProps {
    topicId: string;
    userId: string;
    executionLogs?: ExecutionLog[];
}

export interface CardRendererProps {
    schema: DashboardSchema;
}

export type PollingInterval = number | "off";

export interface IQuestion {
    id: string;
    label: string;
}

export interface ExecutionLog {
    message: string;
    component: string;
    timestamp: string;
}
