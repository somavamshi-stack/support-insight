import capitalize from "lodash/capitalize";
import isEmpty from "lodash/isEmpty";
import React from "react";

import { TileLayout } from "@templates";
import { ChartCardProps } from "@types";

import ChartClient from "./ChartClient";

export const ChartCard: React.FC<ChartCardProps> = ({ label, loading = true, onRefine, onAnalyze, insight, ...chartData }) => {
    const hasValidData = chartData && !isEmpty(chartData);
    return (
        <TileLayout label={capitalize(label)} insight={insight} loading={loading || !hasValidData} onRefine={onRefine} onAnalyze={onAnalyze}>
            <div className="max-h-[250px]">
                {hasValidData ? <ChartClient {...chartData} /> : <p className="text-center text-gray-500">No data available</p>}
            </div>
        </TileLayout>
    );
};
