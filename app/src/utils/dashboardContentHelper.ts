// lib/dashboardContentHelper.ts

import { CARD_TYPE_MAPPING, DASHBOARD_API_URL } from "@constants";
import { DashboardContent, schemaType } from "@types";

/**
 * Fetches dashboard content from the backend API.
 */
export const fetchDashboardContent = async (): Promise<DashboardContent> => {
    const apiUrl = process.env.DASHBOARD_API_URL || DASHBOARD_API_URL;
    if (!apiUrl) {
        throw new Error("Dashboard Content API URL is not defined in environment variables.");
    }

    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch dashboard content: ${response.statusText}`);
    }

    const data: DashboardContent = await response.json();
    return data;
};

export const sortByType = (field) => (a, b) => (a[field] > b[field] ? 1 : b[field] > a[field] ? -1 : 0);

export const generateSchema = (schema: schemaType[]): schemaType[] => {
    let i = 0,
        x = 0,
        y = -1;
    let result: schemaType[] = [];
    const schemas = schema?.sort(sortByType("label")).map((o) => ({
        ...o,
        resizeHandles: ["se"],
        moved: false,
        static: false
    }));

    const get = ({ type, h = 1, w = 3 }): schemaType[] => {
        x = 0;

        const filtered: schemaType[] = schemas.filter((o) => type.includes(CARD_TYPE_MAPPING[o.type]));
        if (filtered.length > 0) y++;
        const res: schemaType[] = filtered.map((o) => {
            const currX = x;
            const currY = y;
            x = x + w;
            if (x >= 12) {
                x = 0;
                y++;
            }
            return { ...o, i: String(i++), h, w, x: currX, y: currY };
        });

        while (x !== 0 && x < 12) {
            const currX = x;
            const currY = y;
            x = x + w;
            res.push({
                id: "-1",
                label: "",
                type: "empty",
                i: String(i++),
                h,
                w,
                x: currX,
                y: currY
            } as schemaType);
        }
        return res;
    };

    [
        { type: ["kpi"], h: 1, w: 3 },
        { type: ["line", "bar", "scatter"], h: 2, w: 6 },
        { type: ["treemap", "waterfall"], h: 2, w: 6 },
        { type: ["radar"], h: 3.5, w: 6 },
        { type: ["boxplot"], h: 2.5, w: 6 },
        { type: ["heatmap"], h: 2.5, w: 6 },
        { type: ["bubble", "doughnut", "funnel"], h: 2, w: 6 }
    ].forEach((t) => {
        result = result.concat(get(t));
    });

    return result;
};
