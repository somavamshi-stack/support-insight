// context/ActionContext.tsx

import React, { createContext } from "react";
interface ActionHandlers {
    kpiRefine: (label: string, input: string) => void;
    kpiAnalyze: (label: string, input: string) => void;
    chartRefine: (dataKey: string, input: string) => void;
    chartAnalyze: (dataKey: string, input: string) => void;
}

const ActionContext = createContext<ActionHandlers | undefined>(undefined);

interface ActionProviderProps {
    children: React.ReactNode;
}

export const ActionProvider: React.FC<ActionProviderProps> = ({ children }) => {
    const actionHandlers: ActionHandlers = {
        kpiRefine: (label, input) => {
            console.log(`Refine KPI: ${label} with input: ${input}`);
            // Implement refine logic here (e.g., API call to refine KPI data)
        },
        kpiAnalyze: (label, input) => {
            console.log(`Analyze KPI: ${label} with input: ${input}`);
            // Implement analyze logic here (e.g., navigate to detailed KPI analysis page)
        },
        chartRefine: (dataKey, input) => {
            console.log(`Refine Chart: ${dataKey} with input: ${input}`);
            // Implement refine logic here (e.g., filter chart data based on input)
        },
        chartAnalyze: (dataKey, input) => {
            console.log(`Analyze Chart: ${dataKey} with input: ${input}`);
            // Implement analyze logic here (e.g., navigate to detailed chart analysis page)
        }
    };

    return <ActionContext.Provider value={actionHandlers}>{children}</ActionContext.Provider>;
};
