import {
    addDataSourceConnection,
    addNewItemToAdminDashboard,
    createAdminDashboard,
    deleteAdminDashboard,
    deleteItemFromAdminDashboard,
    deleteMonitoringConfig,
    fetchAdminDashboardByID,
    fetchAdminDashboards,
    fetchAdminThreads,
    fetchAllMonitoringConfigs,
    fetchDataSourceConnections,
    fetchMonitoringConfigByID,
    updateAdminDashboard,
    updateMonitoringConfig
} from "@redux/actions/adminActions";
import { AdminFlowAgentState, LayoutType, Thread } from "@types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FAILED, IDLE, LOADING, SUCCESS } from "@constants";
import { RootState } from "@redux/store";
import isEmpty from "lodash/isEmpty";

interface IAdminState {
    topic_list_status: string;
    topic_list: Array<any>;
    thread_list_status: string;
    thread_list: Array<Thread>;
    topic_create_status: string;
    topic_create_response: any;
    isCreateModalOpen: boolean;
    selectedDashboardGraphs: Array<any>;
    selectedDashboardTexts: Array<any>;
    isChatOpen: boolean;
    loadingSnap: boolean;
    chatLayout: LayoutType;
    threadPage: string;
    threadId?: string;
    threadInfo?: AdminFlowAgentState;
    dashboard_create: {
        status: string;
        response: any;
        error: boolean;
        api_response_status?: number;
        error_message?: string;
    };

    dashboard_list: {
        status: string;
        response: any;
        error: boolean;
        api_response_status?: number;
        error_message?: string;
    };
    dashboard_item: {
        status: string;
        response: any;
        error: boolean;
        api_response_status?: number;
        error_message?: string;
    };
    dashboard_update: {
        status: string;
        response: any;
        error: boolean;
        api_response_status?: number;
        error_message?: string;
    };
    dashboard_delete: {
        status: string;
        response: any;
        error: boolean;
        api_response_status?: number;
        error_message?: string;
    };
    dashboard_add_new_item: {
        status: string;
        response: any;
        error: boolean;
        api_response_status?: number;
        error_message?: string;
    };
    dashboard_delete_item: {
        status: string;
        response: any;
        error: boolean;
        api_response_status?: number;
        error_message?: string;
    };
    monitoring_configs_list: {
        status: string;
        response: any;
        error: boolean;
        api_response_status?: number;
        error_message?: string;
    };
    monitoring_config_item: {
        status: string;
        response: any;
        error: boolean;
        api_response_status?: number;
        error_message?: string;
    };
    monitoring_config_update: {
        status: string;
        response: any;
        error: boolean;
        api_response_status?: number;
        error_message?: string;
    };
    monitoring_config_delete: {
        status: string;
        response: any;
        error: boolean;
        api_response_status?: number;
        error_message?: string;
    };
    edit_kpi_config: {
        showEditModal: boolean;
        selectedConfigId: string | null;
        showEditSuccess: boolean;
        initialData: { schedule_cron: string; is_active: boolean };
    };

    delete_kpi_config: {
        showDeleteModal: boolean;
        selectedConfigId: string | null;
        showDeleteSuccess: boolean;
    };
}

// Initial state
const initialState: IAdminState = {
    topic_list_status: IDLE,
    thread_list_status: IDLE,
    topic_list: [],
    thread_list: [],
    topic_create_status: IDLE,
    topic_create_response: {},
    isCreateModalOpen: false,
    selectedDashboardGraphs: [],
    selectedDashboardTexts: [],
    isChatOpen: true,
    threadPage: "kg",
    loadingSnap: false,
    chatLayout: "vertical",

    dashboard_create: {
        status: IDLE,
        response: {},
        error: false,
        api_response_status: undefined,
        error_message: undefined
    },
    dashboard_list: {
        status: IDLE,
        response: {},
        error: false,
        api_response_status: undefined,
        error_message: undefined
    },
    dashboard_item: {
        status: IDLE,
        response: {},
        error: false,
        api_response_status: undefined,
        error_message: undefined
    },
    dashboard_update: {
        status: IDLE,
        response: {},
        error: false,
        api_response_status: undefined,
        error_message: undefined
    },
    dashboard_delete: {
        status: IDLE,
        response: {},
        error: false,
        api_response_status: undefined,
        error_message: undefined
    },
    dashboard_add_new_item: {
        status: IDLE,
        response: {},
        error: false,
        api_response_status: undefined,
        error_message: undefined
    },
    dashboard_delete_item: {
        status: IDLE,
        response: {},
        error: false,
        api_response_status: undefined,
        error_message: undefined
    },
    monitoring_configs_list: {
        status: IDLE,
        response: {},
        error: false,
        api_response_status: undefined,
        error_message: undefined
    },
    monitoring_config_item: {
        status: IDLE,
        response: {},
        error: false,
        api_response_status: undefined,
        error_message: undefined
    },
    monitoring_config_update: {
        status: IDLE,
        response: {},
        error: false,
        api_response_status: undefined,
        error_message: undefined
    },
    monitoring_config_delete: {
        status: IDLE,
        response: {},
        error: false,
        api_response_status: undefined,
        error_message: undefined
    },
    edit_kpi_config: {
        showEditModal: false,
        selectedConfigId: null,
        showEditSuccess: false,
        initialData: { schedule_cron: "", is_active: true }
    },
    delete_kpi_config: {
        showDeleteModal: false,
        selectedConfigId: null,
        showDeleteSuccess: false
    }
};

const adminSlice = createSlice({
    name: "adminDashboard",
    initialState,
    reducers: {
        resetAdminDashboard: () => initialState,
        setFlagStatus: (state, action: PayloadAction<any>) => {
            return { ...state, ...action.payload };
        },
        setCreateModalOpen: (state, action) => {
            state.isCreateModalOpen = action.payload;
        },
        setAdminFlagStatus: (state, action: PayloadAction<any>) => {
            return { ...state, ...action.payload };
        },
        setSelectedDashboardGraph: (state, action) => {
            state.selectedDashboardGraphs = action.payload;
        },
        setSelectedDashboardText: (state, action) => {
            state.selectedDashboardTexts = action.payload;
        },
        setOpenChat: (state, action: PayloadAction<boolean>) => {
            state.isChatOpen = action.payload;
        },
        setChatLayout: (state, action: PayloadAction<LayoutType>) => {
            state.chatLayout = action.payload;
        },
        setThreadId: (state, action: PayloadAction<string | undefined>) => {
            state.threadId = action.payload;
        },
        setThreadPage: (state, action: PayloadAction<string>) => {
            state.threadPage = action.payload;
        },
        setThread: (state, action: PayloadAction<AdminFlowAgentState>) => {
            if (isEmpty(state.threadId) || state.threadId === "new") {
                state.threadInfo = action.payload;
            } else if (!isEmpty(state.threadId)) {
                state.threadInfo = { ...state.threadInfo, ...action.payload };
            }
        },
        setShowEditConfigModal: (state, action) => {
            state.edit_kpi_config.showEditModal = action.payload;
        },
        setEditConfigId: (state, action) => {
            state.edit_kpi_config.selectedConfigId = action.payload;
        },
        setShowEditConfigSuccess: (state, action) => {
            state.edit_kpi_config.showEditSuccess = action.payload;
        },
        setEditConfigInitialData: (state, action) => {
            state.edit_kpi_config.initialData = action.payload;
        },
        setDeleteConfigModal: (state, action) => {
            state.delete_kpi_config.showDeleteModal = action.payload;
        },
        setDeleteConfigId: (state, action) => {
            state.delete_kpi_config.selectedConfigId = action.payload;
        },
        setDeleteConfigSuccess: (state, action) => {
            state.delete_kpi_config.showDeleteSuccess = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDataSourceConnections.rejected, (state) => {
                state.topic_list_status = FAILED;
            })
            .addCase(fetchDataSourceConnections.fulfilled, (state, action) => {
                state.topic_list_status = SUCCESS;
                if (Array.isArray(action.payload)) state.topic_list = action.payload;
            })
            .addCase(fetchDataSourceConnections.pending, (state) => {
                state.topic_list_status = LOADING;
            })
            .addCase(fetchAdminThreads.rejected, (state) => {
                state.thread_list_status = FAILED;
            })
            .addCase(fetchAdminThreads.fulfilled, (state, action) => {
                state.thread_list_status = SUCCESS;
                if (Array.isArray(action.payload)) state.thread_list = action.payload;
            })
            .addCase(fetchAdminThreads.pending, (state) => {
                state.thread_list_status = LOADING;
            })
            .addCase(addDataSourceConnection.rejected, (state) => {
                state.topic_create_status = FAILED;
            })
            .addCase(addDataSourceConnection.fulfilled, (state, action) => {
                state.topic_create_status = SUCCESS;
                state.topic_list = [...state.topic_list, action.payload];
            })
            .addCase(addDataSourceConnection.pending, (state) => {
                state.topic_create_status = LOADING;
            })
            .addCase(createAdminDashboard.pending, (state) => {
                state.dashboard_create.status = LOADING;
                state.dashboard_create.error = false;
                state.dashboard_create.api_response_status = undefined;
                state.dashboard_create.error_message = undefined;
            })
            .addCase(createAdminDashboard.rejected, (state, action: any) => {
                state.dashboard_create.status = FAILED;
                state.dashboard_create.error = true;
                state.dashboard_create.api_response_status = action.payload?.status;
                state.dashboard_create.error_message = action.payload?.message;
            })
            .addCase(createAdminDashboard.fulfilled, (state, action) => {
                state.dashboard_create.status = SUCCESS;
                state.dashboard_create.error = false;
                state.dashboard_create.response = action.payload;
                state.dashboard_create.api_response_status = undefined;
                state.dashboard_create.error_message = undefined;
            })
            // fetchAdminDashboards
            .addCase(fetchAdminDashboards.pending, (state) => {
                state.dashboard_list.status = LOADING;
                state.dashboard_list.error = false;
                state.dashboard_list.api_response_status = undefined;
                state.dashboard_list.error_message = undefined;
            })

            .addCase(fetchAdminDashboards.rejected, (state, action: any) => {
                state.dashboard_list.status = FAILED;
                state.dashboard_list.error = true;
                state.dashboard_list.api_response_status = action.payload?.status;
                state.dashboard_list.error_message = action.payload?.message || "Failed to fetch dashboards.";
            })

            .addCase(fetchAdminDashboards.fulfilled, (state, action) => {
                state.dashboard_list.status = SUCCESS;
                state.dashboard_list.error = false;
                state.dashboard_list.response = Array.isArray(action.payload) ? action.payload : [];
                state.dashboard_list.api_response_status = undefined;
                state.dashboard_list.error_message = undefined;
            })
            // fetchAdminDashboardByID
            .addCase(fetchAdminDashboardByID.pending, (state) => {
                state.dashboard_item.status = LOADING;
                state.dashboard_item.error = false;
                state.dashboard_item.api_response_status = undefined;
                state.dashboard_item.error_message = undefined;
            })
            .addCase(fetchAdminDashboardByID.rejected, (state, action: any) => {
                state.dashboard_item.status = FAILED;
                state.dashboard_item.error = true;
                state.dashboard_item.api_response_status = action.payload?.status;
                state.dashboard_item.error_message = action.payload?.message;
            })
            .addCase(fetchAdminDashboardByID.fulfilled, (state, action) => {
                state.dashboard_item.status = SUCCESS;
                state.dashboard_item.error = false;
                state.dashboard_item.response = action.payload;
                state.dashboard_item.api_response_status = undefined;
                state.dashboard_item.error_message = undefined;
            })
            // updateAdminDashboard
            .addCase(updateAdminDashboard.pending, (state) => {
                state.dashboard_update.status = LOADING;
                state.dashboard_update.error = false;
                state.dashboard_update.api_response_status = undefined;
                state.dashboard_update.error_message = undefined;
            })
            .addCase(updateAdminDashboard.rejected, (state, action: any) => {
                state.dashboard_update.status = FAILED;
                state.dashboard_update.error = true;
                state.dashboard_update.api_response_status = action.payload?.status;
                state.dashboard_update.error_message = action.payload?.message;
            })
            .addCase(updateAdminDashboard.fulfilled, (state, action) => {
                state.dashboard_update.status = SUCCESS;
                state.dashboard_update.error = false;
                state.dashboard_update.response = action.payload;
                state.dashboard_update.api_response_status = undefined;
                state.dashboard_update.error_message = undefined;
            })
            // deleteAdminDashboard
            .addCase(deleteAdminDashboard.pending, (state) => {
                state.dashboard_delete.status = LOADING;
                state.dashboard_delete.error = false;
                state.dashboard_delete.api_response_status = undefined;
                state.dashboard_delete.error_message = undefined;
            })
            .addCase(deleteAdminDashboard.rejected, (state, action: any) => {
                state.dashboard_delete.status = FAILED;
                state.dashboard_delete.error = true;
                state.dashboard_delete.api_response_status = action.payload?.status;
                state.dashboard_delete.error_message = action.payload?.message;
            })
            .addCase(deleteAdminDashboard.fulfilled, (state, action) => {
                state.dashboard_delete.status = SUCCESS;
                state.dashboard_delete.error = false;
                state.dashboard_delete.response = action.payload;
                state.dashboard_delete.api_response_status = undefined;
                state.dashboard_delete.error_message = undefined;
            })
            // addNewItemToAdminDashboard
            .addCase(addNewItemToAdminDashboard.pending, (state) => {
                state.dashboard_add_new_item.status = LOADING;
                state.dashboard_add_new_item.error = false;
                state.dashboard_add_new_item.api_response_status = undefined;
                state.dashboard_add_new_item.error_message = undefined;
            })
            .addCase(addNewItemToAdminDashboard.rejected, (state, action: any) => {
                state.dashboard_add_new_item.status = FAILED;
                state.dashboard_add_new_item.error = true;
                state.dashboard_add_new_item.api_response_status = action.payload?.status;
                state.dashboard_add_new_item.error_message = action.payload?.message;
            })
            .addCase(addNewItemToAdminDashboard.fulfilled, (state, action) => {
                state.dashboard_add_new_item.status = SUCCESS;
                state.dashboard_add_new_item.error = false;
                state.dashboard_add_new_item.response = action.payload;
                state.dashboard_add_new_item.api_response_status = undefined;
                state.dashboard_add_new_item.error_message = undefined;
            })
            // deleteItemFromAdminDashboard
            .addCase(deleteItemFromAdminDashboard.pending, (state) => {
                state.dashboard_delete_item.status = LOADING;
                state.dashboard_delete_item.error = false;
                state.dashboard_delete_item.api_response_status = undefined;
                state.dashboard_delete_item.error_message = undefined;
            })
            .addCase(deleteItemFromAdminDashboard.rejected, (state, action: any) => {
                state.dashboard_delete_item.status = FAILED;
                state.dashboard_delete_item.error = true;
                state.dashboard_delete_item.api_response_status = action.payload?.status;
                state.dashboard_delete_item.error_message = action.payload?.message;
            })
            .addCase(deleteItemFromAdminDashboard.fulfilled, (state, action) => {
                state.dashboard_delete_item.status = SUCCESS;
                state.dashboard_delete_item.error = false;
                state.dashboard_delete_item.response = action.payload;
                state.dashboard_delete_item.api_response_status = undefined;
                state.dashboard_delete_item.error_message = undefined;
            })
            // fetchAllMonitoringConfigs
            .addCase(fetchAllMonitoringConfigs.pending, (state) => {
                state.monitoring_configs_list.status = LOADING;
                state.monitoring_configs_list.error = false;
                state.monitoring_configs_list.api_response_status = undefined;
                state.monitoring_configs_list.error_message = undefined;
            })
            .addCase(fetchAllMonitoringConfigs.rejected, (state, action: any) => {
                state.monitoring_configs_list.status = FAILED;
                state.monitoring_configs_list.error = true;
                state.monitoring_configs_list.api_response_status = action.payload?.status;
                state.monitoring_configs_list.error_message = action.payload?.message;
            })
            .addCase(fetchAllMonitoringConfigs.fulfilled, (state, action) => {
                state.monitoring_configs_list.status = SUCCESS;
                state.monitoring_configs_list.error = false;
                state.monitoring_configs_list.response = Array.isArray(action.payload) ? action.payload : [];
                state.monitoring_configs_list.api_response_status = undefined;
                state.monitoring_configs_list.error_message = undefined;
            })

            // fetchMonitoringConfigItemById
            .addCase(fetchMonitoringConfigByID.pending, (state) => {
                state.monitoring_config_item.status = LOADING;
                state.monitoring_config_item.error = false;
                state.monitoring_config_item.api_response_status = undefined;
                state.monitoring_config_item.error_message = undefined;
            })
            .addCase(fetchMonitoringConfigByID.rejected, (state, action: any) => {
                state.monitoring_config_item.status = FAILED;
                state.monitoring_config_item.error = true;
                state.monitoring_config_item.api_response_status = action.payload?.status;
                state.monitoring_config_item.error_message = action.payload?.message;
            })
            .addCase(fetchMonitoringConfigByID.fulfilled, (state, action) => {
                state.monitoring_config_item.status = SUCCESS;
                state.monitoring_config_item.error = false;
                state.monitoring_config_item.response = Array.isArray(action.payload) ? action.payload : [];
                state.monitoring_config_item.api_response_status = undefined;
                state.monitoring_config_item.error_message = undefined;
            })

            // UpdateMonitoringConfigItemById
            .addCase(updateMonitoringConfig.pending, (state) => {
                state.monitoring_config_update.status = LOADING;
                state.monitoring_config_update.error = false;
                state.monitoring_config_update.api_response_status = undefined;
                state.monitoring_config_update.error_message = undefined;
            })
            .addCase(updateMonitoringConfig.rejected, (state, action: any) => {
                state.monitoring_config_update.status = FAILED;
                state.monitoring_config_update.error = true;
                state.monitoring_config_update.api_response_status = action.payload?.status;
                state.monitoring_config_update.error_message = action.payload?.message;
            })
            .addCase(updateMonitoringConfig.fulfilled, (state, action) => {
                state.monitoring_config_update.status = SUCCESS;
                state.monitoring_config_update.error = false;
                state.monitoring_config_update.response = Array.isArray(action.payload) ? action.payload : [];
                state.monitoring_config_update.api_response_status = undefined;
                state.monitoring_config_update.error_message = undefined;
            })

            // DeleteMonitoringConfigItemById
            .addCase(deleteMonitoringConfig.pending, (state) => {
                state.monitoring_config_delete.status = LOADING;
                state.monitoring_config_delete.error = false;
                state.monitoring_config_delete.api_response_status = undefined;
                state.monitoring_config_delete.error_message = undefined;
            })
            .addCase(deleteMonitoringConfig.rejected, (state, action: any) => {
                state.monitoring_config_delete.status = FAILED;
                state.monitoring_config_delete.error = true;
                state.monitoring_config_delete.api_response_status = action.payload?.status;
                state.monitoring_config_delete.error_message = action.payload?.message;
            })
            .addCase(deleteMonitoringConfig.fulfilled, (state, action) => {
                state.monitoring_config_delete.status = SUCCESS;
                state.monitoring_config_delete.error = false;
                state.monitoring_config_delete.response = Array.isArray(action.payload) ? action.payload : [];
                state.monitoring_config_delete.api_response_status = undefined;
                state.monitoring_config_delete.error_message = undefined;
            });
    }
});

export const adminState = (state: RootState): IAdminState => state.adminDashboard;
export const {
    resetAdminDashboard,
    setCreateModalOpen,
    setAdminFlagStatus,
    setOpenChat,
    setChatLayout,
    setThreadId,
    setThreadPage,
    setThread,
    setSelectedDashboardGraph,
    setSelectedDashboardText,
    setFlagStatus,
    setShowEditConfigSuccess,
    setEditConfigId,
    setShowEditConfigModal,
    setEditConfigInitialData,
    setDeleteConfigId,
    setDeleteConfigModal,
    setDeleteConfigSuccess
} = adminSlice.actions;
export default adminSlice.reducer;
