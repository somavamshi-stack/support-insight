import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { createTopic, deleteTopic, fetchCardData, fetchSchema, fetchTopics, setDefaultTopic } from "@redux/actions";
import { ERROR, FAILED, IDLE, LOADING, SUCCESS } from "@constants";
import { ExecutionLog, PollingInterval } from "@types";
import { RootState } from "@redux/store";
import { generateSchema } from "@utils";
import isEmpty from "lodash/isEmpty";

export interface ITopic {
    topic_id: string;
    user_id: string;
    topic_description: string;
    is_default_overview: boolean;
    created_at: string;
    updated_at: string;
    db_created_at: string;
    db_updated_at: string;
}

interface IDashboardState {
    schema_status: string;
    schema: any;
    isFirstTopic: boolean;
    data_status: Record<string, string>;
    chart_data: Record<string, any>;
    pollingInterval: PollingInterval;
    topic_list_status: string;
    topic_list: Array<ITopic>;
    topic_create_status: string;
    topic_create_response: any;
    topic_default_status: string;
    topic_deleted: any;
    topic_delete_status: string;
    execution_logs: ExecutionLog[];
}

const initialState: IDashboardState = {
    schema_status: IDLE,
    isFirstTopic: true,
    schema: [],
    data_status: {},
    chart_data: {},
    pollingInterval: "off",
    topic_list_status: IDLE,
    topic_list: [],
    topic_create_status: IDLE,
    topic_create_response: {},
    topic_default_status: IDLE,
    topic_delete_status: IDLE,
    topic_deleted: null,
    execution_logs: []
};

export const dashboardStore = createSlice({
    name: "dashboardStore",
    initialState,
    reducers: {
        resetDashboard: () => initialState,
        setCardDataStatus: (state, action: PayloadAction<any>) => {
            return { ...state, data_status: { ...state.data_status, ...action.payload } };
        },
        setFlagStatus: (state, action: PayloadAction<any>) => {
            return { ...state, ...action.payload };
        },
        setPollingInterval: (state, action: PayloadAction<any>) => ({ ...state, pollingInterval: action.payload })
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSchema.pending, (state) => {
                state.schema = [];
                state.schema_status = LOADING;
            })
            .addCase(fetchSchema.rejected, (state) => {
                state.schema_status = FAILED;
            })
            .addCase(fetchSchema.fulfilled, (state, action) => {
                state.schema = [];
                state.schema_status = action.payload?.status ? String(action.payload?.status).toUpperCase() : ERROR;
                if (!isEmpty(action.payload?.schema_data)) {
                    state.schema = generateSchema(action.payload?.schema_data?.elements || []);
                } else {
                    state.execution_logs = action.payload?.execution_logs || [];
                }
            })
            .addCase(fetchCardData.fulfilled, (state, action: { payload: any }) => {
                state.data_status[action.payload.id] = SUCCESS;
                state.chart_data[action.payload.id] = action.payload;
            })
            .addCase(fetchTopics.rejected, (state) => {
                state.topic_list_status = FAILED;
            })
            .addCase(fetchTopics.fulfilled, (state, action) => {
                state.topic_list_status = SUCCESS;
                if (Array.isArray(action.payload)) state.topic_list = action.payload;
                state.isFirstTopic = action.payload.length === 0;
            })
            .addCase(fetchTopics.pending, (state) => {
                state.topic_list_status = LOADING;
            })
            .addCase(createTopic.rejected, (state) => {
                state.topic_create_status = FAILED;
            })
            .addCase(createTopic.fulfilled, (state, action) => {
                state.topic_create_status = SUCCESS;
                if (Array.isArray(action.payload) && action.payload.length > 0) state.topic_create_response = action.payload[0];
            })
            .addCase(createTopic.pending, (state) => {
                state.topic_create_status = LOADING;
            })
            .addCase(setDefaultTopic.rejected, (state) => {
                state.topic_default_status = FAILED;
            })
            .addCase(setDefaultTopic.fulfilled, (state) => {
                state.topic_default_status = SUCCESS;
            })
            .addCase(setDefaultTopic.pending, (state) => {
                state.topic_default_status = LOADING;
            })
            .addCase(deleteTopic.rejected, (state) => {
                state.topic_delete_status = FAILED;
            })
            .addCase(deleteTopic.fulfilled, (state, action) => {
                state.topic_delete_status = SUCCESS;
                state.topic_deleted = action.payload?.topic_description;
            })
            .addCase(deleteTopic.pending, (state) => {
                state.topic_deleted = null;
                state.topic_delete_status = LOADING;
            });
    }
});

export const dashboardState = (state: RootState): IDashboardState => state.dashboard;
export const { resetDashboard, setPollingInterval, setCardDataStatus, setFlagStatus } = dashboardStore.actions;
export default dashboardStore.reducer;
