export interface KpiMonitoringConfigAPIResponse {
    ontology_item_id: string;
    ontology_item_type: string;
    value_columns: string[];
    schedule_cron: string;
    algo_name: string;
    algo_params: Record<string, any>;
    resolved_sql: string;
    ts_column: string;
    is_active: boolean;
    config_id: string;
    created_at: string;
    updated_at: string;
    last_run_at: string | null;
    last_status: string | null;
}

export interface KpiMonitoringTableData {
    id: string;
    ontology_item_id: string;
    ontology_item_type: string;
    ts_column: string;
    schedule_cron: string;
    status: string;
    created_at: string;
    updated_at: string;
    last_run_at: string | null;
    last_status: string | null;
}
