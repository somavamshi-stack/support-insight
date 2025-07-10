import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    res.status(200).json([
        {
            ontology_item_id: "StockOutRate",
            ontology_item_type: "Metric",
            value_columns: ["stock_out_rate"],
            schedule_cron: "0 0 * * *",
            algo_name: "isolation_forest",
            algo_params: {},
            resolved_sql:
                "WITH inv_agg AS (\n  SELECT\n    inv.inv_date_sk AS date_sk,\n    COUNT(DISTINCT inv.inv_warehouse_sk) AS total_warehouses,\n    COUNT(DISTINCT CASE WHEN inv.inv_quantity_on_hand=0 THEN inv.inv_warehouse_sk END) AS out_warehouses\n  FROM INVENTORY inv\n  JOIN ITEM i\n    ON inv.inv_item_sk = i.i_item_sk\n  JOIN DATE_DIM dd\n    ON inv.inv_date_sk = dd.d_date_sk\n  WHERE dd.d_year=1998\n  GROUP BY inv.inv_date_sk\n)\nSELECT\n  dd.d_date AS date,\n  (out_warehouses / NULLIF(total_warehouses,0)) AS stock_out_rate\nFROM inv_agg\nJOIN DATE_DIM dd ON inv_agg.date_sk = dd.d_date_sk\nORDER BY dd.d_date DESC\nLIMIT 365",
            ts_column: "date",
            is_active: true,
            config_id: "e32cb60e-99ce-4a79-97d1-8c9343305b99",
            created_at: "2025-06-24T20:16:24.796393Z",
            updated_at: "2025-06-24T20:16:24.796393Z",
            last_run_at: null,
            last_status: null
        },
        {
            ontology_item_id: "ActiveCustomersBySignupMonth",
            ontology_item_type: "Metric",
            value_columns: ["active_customers"],
            schedule_cron: "00 00 * * 1",
            algo_name: "isolation_forest",
            algo_params: {},
            resolved_sql:
                "SELECT TO_CHAR(SIGNUP_DATE, 'YYYY-MM') AS signup_month, COUNT(*) AS active_customers FROM OMNISCOP_AI_SAMPLES.CJA.DIM_CUSTOMER WHERE EMAIL_OPT_IN = TRUE GROUP BY signup_month ORDER BY signup_month DESC LIMIT 24;",
            ts_column: "signup_month",
            is_active: true,
            config_id: "08bfa8e9-2091-478f-8f6a-35ff7c7c3a62",
            created_at: "2025-06-23T06:48:01.717669Z",
            updated_at: "2025-06-23T06:48:38.951960Z",
            last_run_at: null,
            last_status: null
        }
    ]);
}
