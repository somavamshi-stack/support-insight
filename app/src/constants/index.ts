import DataSourceIcon from "../components/icons/dataSourceicom";
import DashboardIcon from "../components/icons/dashboardIcon";
import CanvasIcon from "../components/icons/canvasIcon";
import type { IconType } from "react-icons";

export const COMPANY_NAME = "insight.ai";
export const IDLE = "IDLE";
export const FAILED = "FAILED";
export const SUCCESS = "SUCCESS";
export const RUNNING = "RUNNING";
export const ERROR = "ERROR";
export const LOADING = "LOADING";

export const DEFAULT_NAV_PAGES = [
    { name: "Dashboard", page: "dashboard" },
    { name: "Ask Me", page: "chat" }
];

export const CARD_TYPE_MAPPING = Object.freeze({
    KPI_SIMPLE: "kpi",
    KPI_THRESHOLD: "kpi",
    KPI_CHANGE: "kpi",
    TEXT_INSIGHTS: "kpi",
    TEXT_SUMMARY: "kpi",
    CHART_LINE: "line",
    CHART_MULTI_LINE: "line",
    CHART_LINE_WITH_BANDS: "line",
    CHART_BAR: "bar",
    CHART_PROGRESS_BARS: "bar",
    CHART_FUNNEL: "funnel",
    CHART_RADAR: "radar",
    CHART_STACKED_BAR: "bar",
    CHART_WATERFALL: "waterfall",
    CHART_BAR_LINE_OVERLAY: "bar",
    CHART_GROUPED_BAR: "bar",
    CHART_BAR_WITH_BANDS: "bar",
    CHART_DONUT: "doughnut",
    CHART_GAUGE: "doughnut",
    CHART_SCATTER: "scatter",
    CHART_BOX_PLOT: "boxplot",
    CHART_HEATMAP: "heatmap",
    CHART_BUBBLE: "bubble",
    CHART_TREEMAP: "treemap",
    CHART_SANKEY: "sankey",
    CHART_CHORD: "chord",
    empty: "empty"
});

export const ADMIN_SIDEBAR_ITEMS: { name: string; path: string; icon: IconType }[] = [
    { name: "Dashboards", path: "dashboards", icon: DashboardIcon },
    { name: "Data Source", path: "dsm", icon: DataSourceIcon },
    { name: "Canvas", path: "kg", icon: CanvasIcon }
];

export const DASHBOARD_TABS = [
    ["manual", "Manual"],
    ["autonomous", "Autonomous"]
];

export const DASHBOARD_TABS_AUTONOMUS = [
    ["autonomus_dashboard", "Dashboard"],
    ["kpi_monitoring", "KPI Monitoring"]
];

export const NEXT_PUBLIC_APP_NAME = "";
export const DASHBOARD_API_URL = "https://internal1.dashboard.bff.insight.ai";
export const TOPIC_API_URL = "https://internal1.topic.bff.insight.ai";
export const AUTH_DOMAIN = "https://internal1.auth.bff.insight.ai";
export const ADMIN_AGENT_NAME = "knowledge_agent";

export const CHAT_INIT_STATE = {
    threadId: "",
    kg: { nodes: [], edges: [] },
    topics: [],
    charts: [],
    logs: [],
    messages: [],
    executionId: 0
};

export const THREAD_PAGE_PREFIX = "/admin/t";
