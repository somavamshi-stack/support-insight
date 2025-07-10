import { ChartSpec, TextSpec } from "@types";

export const formatDashboardPayload = (chartData: ChartSpec[], textData: TextSpec[], dashboardData?: { name: string; description: string }) => {
    const chartItems = chartData?.map((chart, index) => ({
        item_type: "chart",
        item_spec: chart,
        display_order: index
    }));

    const textItems = textData?.map((text, index) => ({
        item_type: "text",
        item_spec: text,
        display_order: index
    }));
    let payload = {};
    if (dashboardData) {
        payload = {
            name: dashboardData?.name,
            description: dashboardData?.description,
            items: [...chartItems, ...textItems]
        };
    } else {
        payload = [...chartItems, ...textItems];
    }

    return payload;
};
