import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import { SnowflakeFormData, Thread, YAMLFormData } from "@types";
import { AdminApiService, AdminDevApiService } from "@utils";

// Dummy data
let data: any[] = [];

// ########## ADMIN THREADS ACTIONS ###############
// Create new thread
export const fetchAdminThreads = createAsyncThunk("threads/fetchThreads", async () => {
    try {
        const response = await AdminApiService.get<Thread[]>("/api/threads");
        return response.data;
    } catch (error) {
        console.error("Error fetching threads:", error);
        return isRejectedWithValue(error.response);
    }
});

// delete a thread
export const deleteAdminThreads = createAsyncThunk("threads/deleteThread", async (threadId: string) => {
    try {
        const response = await AdminApiService.delete<Thread[]>(`/api/threads/${threadId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching threads:", error);
        return isRejectedWithValue(error.response);
    }
});

// ########## ADMIN DASHBOARD ACTIONS ###############
// Create new dashboard
export const createAdminDashboard = createAsyncThunk("admin/createDashboard", async (payload: any, { rejectWithValue }) => {
    try {
        const response = await AdminDevApiService.post<Thread[]>("/api/v1/create-dashboards/", payload);
        return response.data;
    } catch (error: any) {
        console.log("Error creating dashboard:", error);
        return rejectWithValue({
            status: error.response?.status,
            message: error.response?.data?.detail?.message || error.message || "Failed to create dashboard"
        });
    }
});

// Get All dashboards
export const fetchAdminDashboards = createAsyncThunk("admin/fetchAdminDashboards", async (_, { rejectWithValue }) => {
    try {
        const response = await AdminDevApiService.get("/api/v1/get-dashboards/");
        return response.data;
    } catch (error: any) {
        console.error("Error fetching dashboards:", error);
        return rejectWithValue({
            status: error.response?.status,
            message: error.response?.data?.detail?.message || error.message || "Failed to fetch dashboards"
        });
    }
});

// Get Dashboard by Id
export const fetchAdminDashboardByID = createAsyncThunk("admin/fetchAdminDashboardByID", async (dashboardId: string, { rejectWithValue }) => {
    try {
        const response = await AdminDevApiService.get(`/api/v1/dashboards/${dashboardId}`);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching dashboard by ID:", error);
        return rejectWithValue({
            status: error.response?.status,
            message: error.response?.data?.detail?.message || error.message || "Failed to fetch dashboard"
        });
    }
});

// Update Dashboard
export const updateAdminDashboard = createAsyncThunk(
    "admin/updateAdminDashboard",
    async (
        { dashboardId, dashboardPayload }: { dashboardId: string; dashboardPayload: { name: string; description: string } },
        { rejectWithValue }
    ) => {
        try {
            const response = await AdminDevApiService.put(`/api/v1/dashboards/${dashboardId}`, dashboardPayload);
            return response.data;
        } catch (error: any) {
            console.log("Error updating dashboard:", error);
            return rejectWithValue({
                status: error.response?.status,
                message: error.response?.data?.detail?.message || error.message || "Failed to update dashboard"
            });
        }
    }
);

// Delete dashboard
export const deleteAdminDashboard = createAsyncThunk("admin/deleteAdminDashboard", async (dashboardId: string, { rejectWithValue }) => {
    try {
        const response = await AdminDevApiService.delete(`/api/v1/dashboards/${dashboardId}`);
        return response.data;
    } catch (error: any) {
        console.error("Error deleting dashboard:", error);
        return rejectWithValue({
            status: error.response?.status,
            message: error.response?.data?.detail?.message || error.message || "Failed to delete dashboard"
        });
    }
});

// Add new item to existing dashboard
export const addNewItemToAdminDashboard = createAsyncThunk(
    "admin/addNewItemToAdminDashboard",
    async ({ dashboard_id, payload }: { dashboard_id: string; payload: any }, { rejectWithValue }) => {
        try {
            const response = await AdminDevApiService.post<Thread[]>(`/api/v1/dashboards/${dashboard_id}/items`, payload);
            return response.data;
        } catch (error: any) {
            console.error("Error adding new item to dashboard:", error);
            return rejectWithValue({
                status: error.response?.status,
                message: error.response?.data?.detail?.message || error.message || "Failed to add item to dashboard"
            });
        }
    }
);

// Delete an chart Item from dashboard
export const deleteItemFromAdminDashboard = createAsyncThunk(
    "admin/deleteItemFromAdminDashboard",
    async ({ dashboardId, itemId }: { dashboardId: string; itemId: string }, { rejectWithValue }) => {
        try {
            const response = await AdminDevApiService.delete(`/api/v1/dashboards/${dashboardId}/items/${itemId}`);
            return response.data;
        } catch (error: any) {
            console.error("Error deleting item from dashboard:", error);
            return rejectWithValue({
                status: error.response?.status,
                message: error.response?.data?.detail?.message || error.message || "Failed to delete item from dashboard"
            });
        }
    }
);

// ##################### DataSource Actions ############################
export const fetchDataSourceConnections = createAsyncThunk("topic/getDataSourceConnections", async () => {
    try {
        await new Promise<void>((resolve) => {
            setTimeout(() => resolve(), 2000);
        });
        return data;
    } catch (error) {
        return isRejectedWithValue(error.response);
    }
});

// Create a new topic (adds to dummy data and returns the updated topic)
export const addDataSourceConnection = createAsyncThunk("topic/addDataSourceConnection", async (payload: SnowflakeFormData | YAMLFormData) => {
    try {
        await new Promise<void>((resolve) => {
            setTimeout(() => resolve(), 2000);
        });

        // Simulate adding the new topic to the dummy data
        const newTopic = { ...payload, topic_id: (data.length + 1).toString() };
        data = [...data, newTopic];
        return data;
    } catch (error) {
        return isRejectedWithValue(error.response);
    }
});

// ########## ADMIN KPI MONITORING ACTIONS ###############
// Fetch all monitoring configs:
export const fetchAllMonitoringConfigs = createAsyncThunk("admin/fetchAllMonitoringConfigs", async (_, { rejectWithValue }) => {
    try {
        const response = await AdminDevApiService.get("/api/v1/get-monitoring-configs/");
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            return [];
        }
        console.error("Error fetching monitoring configs:", error);
        return rejectWithValue({
            status: error.response?.status,
            message: error.response?.data?.detail?.message || error.message || "Failed to fetch monitoring configs"
        });
    }
});

// Fetch monitoring config by Id
export const fetchMonitoringConfigByID = createAsyncThunk("admin/fetchMonitoringConfigByID", async (configId: string, { rejectWithValue }) => {
    try {
        const response = await AdminDevApiService.get(`/api/v1/monitoring-configs/${configId}`);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching monitoring config by ID:", error);
        return rejectWithValue({
            status: error.response?.status,
            message: error.response?.data?.detail?.message || error.message || "Failed to fetch monitoring config."
        });
    }
});

// Update Monitoring config
export const updateMonitoringConfig = createAsyncThunk(
    "admin/updateMonitoringConfig",
    async ({ configId, configPayload }: { configId: string; configPayload: any }, { rejectWithValue }) => {
        try {
            const response = await AdminDevApiService.put(`/api/v1/monitoring-configs/${configId}`, configPayload);
            return response.data;
        } catch (error: any) {
            return rejectWithValue({
                status: error.response?.status,
                message: error.response?.data?.detail?.message || error.message || "Failed to update monitoring config"
            });
        }
    }
);

// Delete monitoring config
export const deleteMonitoringConfig = createAsyncThunk("admin/deleteMonitoringConfig", async (configId: string, { rejectWithValue }) => {
    try {
        const response = await AdminDevApiService.delete(`/api/v1/monitoring-configs/${configId}`);
        return response.data;
    } catch (error: any) {
        console.error("Error deleting monitoring config:", error);
        return rejectWithValue({
            status: error.response?.status,
            message: error.response?.data?.detail?.message || error.message || "Failed to delete monitoring config"
        });
    }
});
