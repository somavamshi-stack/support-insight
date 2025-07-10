export interface TreeNode {
    name: string;
    value?: number;
    children?: TreeNode[];
}

export interface ChartBands {
    label: string;
    start: number;
    end: number;
    color?: string;
}
