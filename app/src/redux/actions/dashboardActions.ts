import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import { DashboardApiService, TopicApiService } from "@utils";
import { CARD_TYPE_MAPPING } from "@constants";

export const fetchSchema = createAsyncThunk("dashboard/getSchema", async (req: any) => {
    try {
        const response = await DashboardApiService.get(`/api/v1/dashboard/schema?topic_id=${req.topic_id}&user_id=${req.userId}`);
        return response.data;
    } catch (error) {
        return isRejectedWithValue(error.response);
    }
});

export const fetchCardData = createAsyncThunk("dashboard/fetchCardData", async (id: string) => {
    try {
        const response = await DashboardApiService.get(`/api/v1/dashboard/data/${id}`);
        const { type, datasets, insight, ...data } = response.data.topic_data;
        return { id, data, type: CARD_TYPE_MAPPING[type], datasets, insight };
    } catch (error) {
        return isRejectedWithValue(error.response);
    }
});

export const fetchTopics = createAsyncThunk("topic/getTopics", async (userId: string) => {
    try {
        const response = await TopicApiService.get(`/api/v1/topics?user_id=${userId}`);
        return response.data;
    } catch (error) {
        return isRejectedWithValue(error.response);
    }
});

export const createTopic = createAsyncThunk("topic/createTopic", async (payload: any) => {
    try {
        const response = await TopicApiService.post("/api/v1/topics", [payload]);
        return response.data;
    } catch (error) {
        return isRejectedWithValue(error.response);
    }
});

export const setDefaultTopic = createAsyncThunk("topic/changeDefaultTopicTopic", async (req: any) => {
    try {
        const response = await TopicApiService.patch(`/api/v1/topics/${req.topic_id}/default`, req);
        return response.data;
    } catch (error) {
        return isRejectedWithValue(error.response);
    }
});

export const deleteTopic = createAsyncThunk("topic/deleteTopic", async (topic_id: string) => {
    try {
        const response = await TopicApiService.delete(`/api/v1/topics/${topic_id}`);
        return response.data;
    } catch (error) {
        return isRejectedWithValue(error.response);
    }
});
