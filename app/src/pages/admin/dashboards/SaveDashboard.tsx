import React, { useEffect, useState } from "react";

import { BasicModal, DropdownActionModal, SaveDashboardForm, showNotification } from "@molecules";
import { IDLE, SUCCESS } from "@constants";
import { ButtonDropdown } from "@atoms";

import { adminState, setFlagStatus, setSelectedDashboardGraph, setSelectedDashboardText } from "@redux/slices/adminSlice";
import { addNewItemToAdminDashboard, createAdminDashboard, fetchAdminDashboards } from "@redux/actions";
import { useAppDispatch, useAppSelector } from "@redux/hooks";

import { formatDashboardPayload } from "@utils";
import { isEmpty } from "lodash";

const SaveDashboard = () => {
    const dispatch = useAppDispatch();

    const { selectedDashboardGraphs, selectedDashboardTexts, dashboard_create, dashboard_list, dashboard_add_new_item } = useAppSelector(adminState);

    const [saveAsNewModalOpen, setSaveAsNewModalOpen] = useState(false);
    const [saveToExistingModalOpen, setSaveToExistingModalOpen] = useState(false);
    const [dashboards, setDashboards] = useState<any>();

    const hasSelectedGraph = selectedDashboardGraphs?.length > 0;
    const hasSelectedText = selectedDashboardTexts?.length > 0;

    useEffect(() => {
        if (dashboard_create.status === SUCCESS && !isEmpty(dashboard_create.response)) {
            dispatch(setFlagStatus({ dashboard_create: { status: IDLE } }));
            resetCreateDashboardStatus();
            showNotification({
                title: "Dashboard Saved",
                text: "Dashboard saved successfully",
                icon: "success"
            });
            dispatch(fetchAdminDashboards());
            dispatch(setSelectedDashboardGraph([]));
            dispatch(setSelectedDashboardText([]));
        } else if (dashboard_create.error) {
            resetCreateDashboardStatus();

            showNotification({
                title: `${dashboard_create?.api_response_status}:Failed to Save Dashboard!`,
                text: `${dashboard_create.error_message}`,
                icon: "error"
            });
        }
    }, [dashboard_create, dispatch]);

    useEffect(() => {
        if (dashboard_add_new_item.status === SUCCESS && !isEmpty(dashboard_add_new_item.response)) {
            dispatch(setFlagStatus({ dashboard_add_new_item: { status: IDLE } }));
            showNotification({
                title: "Item Added",
                text: "New item added successfully",
                icon: "success"
            });
            dispatch(setSelectedDashboardGraph([]));
            dispatch(setSelectedDashboardText([]));
        } else if (dashboard_add_new_item?.error) {
            showNotification({
                title: `${dashboard_add_new_item?.api_response_status}:Failed to Save New Item!`,
                text: `${dashboard_add_new_item?.error_message}`,
                icon: "error"
            });
        }
    }, [dashboard_add_new_item, dispatch]);

    useEffect(() => {
        dispatch(fetchAdminDashboards());
    }, []);

    useEffect(() => {
        if (dashboard_list?.response?.length > 0) {
            const dashboardData = dashboard_list?.response?.map((item: any) => ({
                label: item.name,
                value: item.dashboard_id
            }));
            setDashboards(dashboardData);
        }
    }, [dashboard_list]);
    useEffect(() => {
        return () => {
            dispatch(setSelectedDashboardGraph([]));
            dispatch(setSelectedDashboardText([]));
        };
    }, [dispatch]);

    const resetCreateDashboardStatus = () => {
        setSaveAsNewModalOpen(false);
        setSaveToExistingModalOpen(false);
    };

    const handleSaveSelect = (option: string) => {
        if (!hasSelectedGraph && !hasSelectedText) return;
        if (option === "Save as New") {
            setSaveAsNewModalOpen(true);
        } else if (option === "Save to Existing Dashboard") {
            setSaveToExistingModalOpen(true);
        }
    };

    const handleSaveDashboard = (dashboard: any) => {
        if (saveAsNewModalOpen) {
            const createDashboardPayload = formatDashboardPayload(selectedDashboardGraphs, selectedDashboardTexts, dashboard);

            dispatch(createAdminDashboard(createDashboardPayload));
            dispatch(setSelectedDashboardGraph([]));
            dispatch(setSelectedDashboardText([]));
        } else if (saveToExistingModalOpen) {
            const createDashboardPayload = formatDashboardPayload(selectedDashboardGraphs, selectedDashboardTexts);
            dispatch(addNewItemToAdminDashboard({ dashboard_id: dashboard?.value, payload: createDashboardPayload }));
        }
    };

    return (
        <div className="relative z-50 flex items-center justify-between">
            <ButtonDropdown
                label="Save Dashboard"
                options={["Save as New", "Save to Existing Dashboard"]}
                onSelect={handleSaveSelect}
                isOpenOptions={hasSelectedGraph || hasSelectedText}
                buttonClassName={`text-white  border-none rounded-lg px-4 py-2 ${hasSelectedGraph || hasSelectedText ? "bg-[#343434] hover:bg-[#646464] cursor-pointer " : "bg-[#343434]"} hover:bg-[#646464]`}
            />

            <BasicModal
                isOpen={saveAsNewModalOpen}
                onClose={() => setSaveAsNewModalOpen(false)}
                title="Save Dashboard"
                modalContent={<SaveDashboardForm mode="create" onClose={() => setSaveAsNewModalOpen(false)} onSubmit={handleSaveDashboard} />}
            />

            <DropdownActionModal
                isOpen={saveToExistingModalOpen}
                onClose={() => setSaveToExistingModalOpen(false)}
                title="Save  Dashboard"
                options={dashboards}
                onSubmit={handleSaveDashboard}
                submitLabel="Save"
            />
        </div>
    );
};

export default SaveDashboard;
