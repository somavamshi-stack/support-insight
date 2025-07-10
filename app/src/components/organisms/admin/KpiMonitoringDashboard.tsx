import {
    setDeleteConfigId,
    setDeleteConfigModal,
    setDeleteConfigSuccess,
    setEditConfigId,
    setEditConfigInitialData,
    setFlagStatus,
    setShowEditConfigModal,
    setShowEditConfigSuccess
} from "@redux/slices/adminSlice";
import { formatShortDate, getCronDescription, transKpiMonitoringTableData } from "@utils";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import KpiTable from "components/molecules/Tables/KpiTable";
import React, { useEffect, useMemo, useState } from "react";
import TrashIcon from "components/icons/deleteIcon";
import EditIcon from "components/icons/editIcon";
import { KpiMonitoringTableData } from "@types";
import { showNotification } from "@molecules";
import { adminState } from "@redux/slices";
import { IDLE, SUCCESS } from "@constants";

function KpiMonitoringDashboard() {
    const dispatch = useAppDispatch();
    const { monitoring_configs_list, monitoring_config_delete, monitoring_config_update, edit_kpi_config, delete_kpi_config } =
        useAppSelector(adminState);

    const [kpiTableData, setKpiTableData] = useState<KpiMonitoringTableData[]>([]);

    const kpiColumns = [
        { key: "ontology_item_id", label: "Ontology Item ID" },
        { key: "ontology_item_type", label: "Type" },
        { key: "ts_column", label: "Timestamp" },
        { key: "schedule_cron", label: "Scheduled At" },
        { key: "last_run_at", label: "Last Run At" },
        { key: "last_status", label: "Last Status" },
        { key: "updated_at", label: "Updated At" },
        { key: "status", label: "Status" },
        { key: "actions", label: "Actions" }
    ];

    const kpiActionHandler = (record: KpiMonitoringTableData) => {
        return (
            <div className="mx-4 flex justify-center gap-2">
                <button
                    onClick={() => handleEditConfig(record.id)}
                    className="my-1 cursor-pointer rounded border border-[#DED300] px-2 py-2 text-xs text-white transition-all duration-200 hover:border-[#646464] active:scale-90"
                    aria-label={`Edit dashboard ${record.ontology_item_type}`}
                >
                    <EditIcon />
                </button>
                <div
                    className="my-1 cursor-pointer rounded border border-[#F13F28] bg-[#AE3020] px-2 py-2 text-xs text-white transition-all duration-200 hover:border-[#646464] active:scale-90"
                    onClick={() => handleDeleteConfig(record.id)}
                >
                    <TrashIcon />
                </div>
            </div>
        );
    };

    const handleDeleteConfig = (configId: string) => {
        dispatch(setDeleteConfigModal(true));
        dispatch(setDeleteConfigId(configId));
    };

    const handleEditConfig = (configId: string) => {
        dispatch(setShowEditConfigModal(true));
        dispatch(setEditConfigId(configId));
    };

    const resetDeleteConfigStatus = () => {
        dispatch(setDeleteConfigModal(false));
        dispatch(setDeleteConfigId(null));
        dispatch(setDeleteConfigSuccess(false));
    };

    const resetEditConfigStatus = () => {
        dispatch(setShowEditConfigModal(false));
        dispatch(setEditConfigId(null));
        dispatch(setShowEditConfigSuccess(false));
    };

    const transformedKpiTableData = useMemo(() => {
        return kpiTableData.map((row) => ({
            ...row,
            schedule_cron: getCronDescription(row.schedule_cron),
            updated_at: formatShortDate(row.updated_at),
            actions: kpiActionHandler(row)
        }));
    }, [kpiTableData]);

    useEffect(() => {
        if (monitoring_configs_list?.response?.length > 0) {
            const tableData = transKpiMonitoringTableData(monitoring_configs_list?.response);
            if (tableData?.length > 0) setKpiTableData(tableData);

            // Set initial data
            const currentData = monitoring_configs_list?.response?.find((item) => item?.config_id === edit_kpi_config?.selectedConfigId) ?? null;
            if (currentData !== null) dispatch(setEditConfigInitialData(currentData));
        }
    }, [monitoring_configs_list, dispatch, edit_kpi_config?.showEditModal, edit_kpi_config?.selectedConfigId]);

    // Handle successful config item deletion
    useEffect(() => {
        if (monitoring_config_delete?.status === SUCCESS && delete_kpi_config?.showDeleteSuccess) {
            dispatch(setFlagStatus({ monitoring_config_delete: { status: IDLE, error: null, error_message: null, api_response_status: null } }));
            resetDeleteConfigStatus();

            showNotification({
                title: "Config Deleted",
                text: "Monitoring config deleted successfully",
                icon: "success"
            });
        } else if (monitoring_config_delete?.error && delete_kpi_config?.showDeleteSuccess) {
            resetDeleteConfigStatus();

            showNotification({
                title: `${monitoring_config_delete?.api_response_status}: Failed to Delete Dashboard!`,
                text: `${monitoring_config_delete?.error_message}`,
                icon: "error"
            });
        }
    }, [monitoring_config_delete, delete_kpi_config, dispatch]);

    // Handle successful config item updation
    useEffect(() => {
        if (monitoring_config_update?.status === SUCCESS && edit_kpi_config?.showEditSuccess) {
            dispatch(setFlagStatus({ monitoring_config_update: { status: IDLE, error: null, error_message: null, api_response_status: null } }));
            resetEditConfigStatus();

            showNotification({
                title: "Config Updated",
                text: "Monitoring config updated successfully",
                icon: "success"
            });
        } else if (monitoring_config_update?.error && edit_kpi_config?.showEditSuccess) {
            resetDeleteConfigStatus();

            showNotification({
                title: `${monitoring_config_update?.api_response_status}: Failed to Update Dashboard!`,
                text: `${monitoring_config_update?.error_message}`,
                icon: "error"
            });
        }
    }, [monitoring_config_update, edit_kpi_config?.showEditSuccess, dispatch]);

    return (
        <div>
            <KpiTable columns={kpiColumns} data={transformedKpiTableData} />
        </div>
    );
}

export default KpiMonitoringDashboard;
