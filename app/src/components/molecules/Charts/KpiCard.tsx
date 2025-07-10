import React from "react";

import { TileLayout } from "@templates";
import { KpiCardProps } from "@types";

export const KpiCard: React.FC<KpiCardProps> = ({ label, data, trend, currency, loading = true, insight, onRefine, onAnalyze }) => (
    <TileLayout label={label} insight={insight} loading={loading || data === undefined} onRefine={onRefine} onAnalyze={onAnalyze}>
        <div className="text-color-label/70 mb-2 inline-flex items-center text-base font-bold">
            {data?.value !== undefined && <p>{currency ? `$${data?.value.toLocaleString()}` : data?.value}</p>}
            {trend !== undefined && trend !== 0 && (
                <span className="mx-2" style={{ color: trend >= 0 ? "green" : "red" }}>
                    {trend >= 0 ? "+" : ""}
                    {trend}%
                </span>
            )}
        </div>
    </TileLayout>
);
