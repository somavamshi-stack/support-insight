import { AdminFlowAgentState, KpiMonitoringConfigAPIResponse, KpiMonitoringTableData, MetricOption } from "@types";
import cronstrue from "cronstrue";

export function extractMetrics(data: AdminFlowAgentState, icon: any): MetricOption[] {
    return data?.kg?.nodes
        .filter((node) => node.labels.includes("Metric"))
        .map((node) => ({
            id: ` Set monitoring for ${node.properties.name}`,
            label: ` ${node.properties.name} KPI`,
            icon: icon
        }));
}

export function transKpiMonitoringTableData(data: KpiMonitoringConfigAPIResponse[]): KpiMonitoringTableData[] {
    return data?.map((item, index) => ({
        id: item?.config_id,
        ontology_item_id: item.ontology_item_id,
        ontology_item_type: item.ontology_item_type,
        ts_column: item.ts_column,
        schedule_cron: item.schedule_cron,
        status: item.is_active ? "Active" : "Inactive",
        created_at: item.created_at,
        updated_at: item.updated_at,
        last_run_at: item.last_run_at ?? "N/A",
        last_status: item.last_status ?? "N/A"
    }));
}

export function getCronDescription(cronExpression: string): string {
    try {
        return cronstrue.toString(cronExpression, {
            use24HourTimeFormat: false,
            verbose: true
        });
    } catch (error) {
        return "Invalid cron expression";
    }
}
