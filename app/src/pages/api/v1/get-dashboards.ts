import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    res.status(200).json([
        {
            name: "RCA Report: ActiveCustomersBySignupMonth",
            description:
                "Autonomous Root Cause Analysis for Run ID: 7cf54d47-608c-4819-94b1-2bc4558bb4e7. This report analyzes an anomaly event for the 'ActiveCustomersBySignupMonth' metric.",
            dashboard_id: "c126a6c8-c5be-40db-9abf-88175a9f0923",
            dashboard_type: "autonomous",
            created_at: "2025-06-23T07:25:54.204079Z",
            updated_at: "2025-06-23T07:25:54.204079Z",
            items: []
        },
        {
            name: "RCA Report: StockOutRate",
            description:
                "Autonomous Root Cause Analysis for Run ID: be45220f-2997-4abb-a4dc-d472eb283f50. This report analyzes an anomaly event for the 'StockOutRate' metric.",
            dashboard_id: "f1d87d1e-b77d-4b79-b689-cbd53b164c76",
            dashboard_type: "autonomous",
            created_at: "2025-06-18T00:56:57.094053Z",
            updated_at: "2025-06-18T00:56:57.094053Z",
            items: []
        },
        {
            name: "Channel performance",
            description: "This is channel performance",
            dashboard_id: "bc505d2f-6d2b-482e-b05f-68d9a4be5384",
            dashboard_type: "manual",
            created_at: "2025-06-16T17:21:03.137710Z",
            updated_at: "2025-06-17T04:54:39.986046Z",
            items: []
        },
        {
            name: "repeat purchase dashboard",
            description: "repeat purchase dashboard",
            dashboard_id: "e44e2d67-dab5-4903-94f6-d7d6d40b8cac",
            dashboard_type: "manual",
            created_at: "2025-06-13T20:00:50.331324Z",
            updated_at: "2025-06-13T20:00:50.331324Z",
            items: []
        },
        {
            name: "Multi text Dashboard",
            description: "testing multiple text components",
            dashboard_id: "1b189079-0c8d-4162-982d-8eac2c96eee7",
            dashboard_type: "manual",
            created_at: "2025-06-10T05:38:42.845871Z",
            updated_at: "2025-06-10T05:38:42.845871Z",
            items: []
        },
        {
            name: "Top Products Dashboard",
            description: "Top Products Dashboard",
            dashboard_id: "7e3a9ffb-1e23-443b-b0f9-557f7642f2a5",
            dashboard_type: "manual",
            created_at: "2025-06-09T21:53:31.834297Z",
            updated_at: "2025-06-09T21:53:31.834297Z",
            items: []
        },
        {
            name: "text-summ-test1",
            description: "text-summ-test1",
            dashboard_id: "7fd65074-9af3-4f12-b8a4-a72a4319f136",
            dashboard_type: "manual",
            created_at: "2025-06-09T14:20:57.413473Z",
            updated_at: "2025-06-09T14:20:57.413473Z",
            items: []
        },
        {
            name: "Sales by Product Category",
            description: "Sales by Category KPI",
            dashboard_id: "9d84f3eb-ea9e-45e7-a514-1dd40997e6d3",
            dashboard_type: "manual",
            created_at: "2025-06-04T05:43:53.895261Z",
            updated_at: "2025-06-04T05:43:53.895261Z",
            items: []
        },
        {
            name: "Bakery Purchase KPI",
            description: "Test",
            dashboard_id: "da627c16-2eba-4188-8ea3-77b625e9e0c2",
            dashboard_type: "manual",
            created_at: "2025-06-03T15:18:49.693377Z",
            updated_at: "2025-06-03T15:18:49.693377Z",
            items: []
        },
        {
            name: "Warehouse Stock Analysis",
            description: "Dashboard focusing on stock levels and out-of-stock rates across different warehouse locations.",
            dashboard_id: "25621790-07de-4a90-bbe8-ff960716b8f2",
            dashboard_type: "manual",
            created_at: "2025-05-27T00:19:31.272140Z",
            updated_at: "2025-05-27T00:19:31.272140Z",
            items: []
        }
    ]);
}
