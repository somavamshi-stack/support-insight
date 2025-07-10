export interface SnowflakeFormData {
    account: string;
    username: string;
    password: string;
    timeout: number;
    warehouse: string;
    connection_id: string;
}

export interface YAMLFormData {
    yamlContent: string;
    connection_id: string;
}

export type LayoutType = "horizontal" | "vertical";

export interface MetricOption {
    id: string;
    label: string;
}
