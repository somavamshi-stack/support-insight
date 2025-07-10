import { SetStateAction, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import { DASHBOARD_TABS, DASHBOARD_TABS_AUTONOMUS, IDLE, LOADING, SUCCESS } from "@constants";
import KpiTable from "../../molecules/Tables/KpiTable";
import { showNotification, Tabs } from "@molecules";
import { Centered, InputField } from "@atoms";

import { adminState, setFlagStatus, setSelectedDashboardGraph, setSelectedDashboardText } from "@redux/slices";
import { fetchAdminDashboards, fetchAllMonitoringConfigs } from "@redux/actions";
import { useAppDispatch, useAppSelector } from "@redux/hooks";

import KpiMonitoringDashboard from "./KpiMonitoringDashboard";
import { barlow } from "../../../assets/fonts/barlow";
import TrashIcon from "../../icons/deleteIcon";
import EditIcon from "../../icons/editIcon";
import ViewIcon from "../../icons/viewIcon";
import isEmpty from "lodash/isEmpty";
import { withAuth } from "@utils";
import React from "react";

interface Dashboard {
    dashboard_id: string;
    dashboard_type: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

interface DashboardComponentProps {
    setDeleteDashboardId: React.Dispatch<SetStateAction<string | null>>;
    setShowDeleteModal: React.Dispatch<SetStateAction<boolean>>;
    setShowDeleteSuccess: React.Dispatch<SetStateAction<boolean>>;
    showDeleteSuccess: boolean;

    showUpdateSuccess: boolean;
    setShowUpdateSuccess: React.Dispatch<SetStateAction<boolean>>;
    setIsEditDashboard: React.Dispatch<SetStateAction<boolean>>;
    setEditDashboardId: React.Dispatch<SetStateAction<string | null>>;
    setInitialData: React.Dispatch<SetStateAction<{ name: string; description: string }>>;
}

const DashboardComponent = ({
    setDeleteDashboardId,
    setShowDeleteModal,
    setShowDeleteSuccess,
    showDeleteSuccess,
    showUpdateSuccess,
    setShowUpdateSuccess,
    setIsEditDashboard,
    setEditDashboardId,
    setInitialData
}: DashboardComponentProps) => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { dashboard_list, dashboard_update, dashboard_delete } = useAppSelector(adminState);

    const [searchInput, setSearchInput] = useState("");
    const [activeTab, setActiveTab] = useState(DASHBOARD_TABS[0][0]);
    const [activeSubTab, setActiveSubTab] = useState(DASHBOARD_TABS_AUTONOMUS[0][0]);

    const manualColumns = [
        { key: "dashboard_id", label: "Dashboard ID" },
        { key: "name", label: "Name" },
        { key: "description", label: "Description" },
        { key: "created_at", label: "Created At" },
        { key: "updated_at", label: "Updated At" },
        { key: "actions", label: "Actions" }
    ];

    const filteredTableData = useMemo(() => {
        let filtered = Array.isArray(dashboard_list?.response) ? (dashboard_list.response as Dashboard[]) : [];

        if (activeTab !== "all") {
            filtered = filtered.filter((item) => item.dashboard_type === activeTab);
        }

        if (activeTab === "autonomous" && activeSubTab === "kpi_monitoring") {
            filtered = [];
        }

        if (searchInput && searchInput.trim() !== "") {
            filtered = filtered.filter((item) => item.name.toLowerCase().includes(searchInput.trim().toLowerCase()));
        }

        return filtered;
    }, [dashboard_list, searchInput, activeTab, activeSubTab]);

    useEffect(() => {
        // Clear all dashboard-related states on component mount
        dispatch(
            setFlagStatus({
                dashboard_update: { status: IDLE, error: null, error_message: null, api_response_status: null }
            })
        );
        dispatch(
            setFlagStatus({
                dashboard_delete: { status: IDLE, error: null, error_message: null, api_response_status: null }
            })
        );
        dispatch(fetchAdminDashboards());
        dispatch(fetchAllMonitoringConfigs());
    }, [dispatch]);

    // Handle failed to fetch dashboard
    useEffect(() => {
        if (dashboard_list?.error) {
            showNotification({
                title: `${dashboard_list?.api_response_status}: Failed to Fetch Dashboards!`,
                text: `${dashboard_list?.error_message}`,
                icon: "error"
            });
        }
    }, [dashboard_list]);

    useEffect(() => {
        if (dashboard_update?.status === SUCCESS && !isEmpty(dashboard_update?.response) && showUpdateSuccess) {
            dispatch(setFlagStatus({ dashboard_update: { status: IDLE, error: null, error_message: null, api_response_status: null } }));
            resetUpdateDashboardStatus();
            showNotification({ title: "Dashboard Updated", text: "Dashboard updated successfully", icon: "success" });
        } else if (dashboard_update?.error && showUpdateSuccess) {
            resetUpdateDashboardStatus();
            showNotification({
                title: `${dashboard_update?.api_response_status}: Failed to Update Dashboard!`,
                text: `${dashboard_update?.error_message}`,
                icon: "error"
            });
        }
    }, [dashboard_update, showUpdateSuccess, dispatch]);

    // Handle successful dashboard deletion
    useEffect(() => {
        if (dashboard_delete?.status === SUCCESS && showDeleteSuccess) {
            dispatch(setFlagStatus({ dashboard_delete: { status: IDLE, error: null, error_message: null, api_response_status: null } }));
            resetDeleteDashboardStatus();

            showNotification({
                title: "Dashboard Deleted",
                text: "Dashboard deleted successfully",
                icon: "success"
            });
        } else if (dashboard_delete?.error && showDeleteSuccess) {
            resetDeleteDashboardStatus();

            showNotification({
                title: `${dashboard_delete?.api_response_status}: Failed to Delete Dashboard!`,
                text: `${dashboard_delete?.error_message}`,
                icon: "error"
            });
        }
    }, [dashboard_delete, showDeleteSuccess, dispatch]);

    // Clear states more thoroughly on unmount
    useEffect(() => {
        return () => {
            dispatch(
                setFlagStatus({
                    dashboard_update: { status: IDLE, error: null, error_message: null, api_response_status: null }
                })
            );
            dispatch(
                setFlagStatus({
                    dashboard_delete: { status: IDLE, error: null, error_message: null, api_response_status: null }
                })
            );
            setShowUpdateSuccess(false);
            setShowDeleteSuccess(false);
        };
    }, [dispatch]);

    const resetUpdateDashboardStatus = () => {
        setIsEditDashboard(false);
        setEditDashboardId(null);
        setInitialData({ name: "", description: "" });
        setShowUpdateSuccess(false);
        setSearchInput("");
        setActiveTab(DASHBOARD_TABS[0][0]);
        setActiveSubTab(DASHBOARD_TABS_AUTONOMUS[0][0]);
    };

    const resetDeleteDashboardStatus = () => {
        setShowDeleteModal(false);
        setDeleteDashboardId(null);
        setShowDeleteSuccess(false);
        setSearchInput("");
        setActiveTab(DASHBOARD_TABS[0][0]);
        setActiveSubTab(DASHBOARD_TABS_AUTONOMUS[0][0]);
    };

    const handleDashboardViewClick = (dashboard_id: string) => {
        router.push(`/admin/dashboards/view/${dashboard_id}`);
        dispatch(setSelectedDashboardGraph([]));
        dispatch(setSelectedDashboardText([]));
    };

    const handleDashboardEditClick = (dashboard_id: string) => {
        const dashboard = (dashboard_list?.response as Dashboard[]).find((item) => item.dashboard_id === dashboard_id);
        if (dashboard) {
            setIsEditDashboard(true);
            setEditDashboardId(dashboard_id);
            setInitialData({
                name: dashboard.name,
                description: dashboard.description
            });
        }
    };

    const handleDashboardDeleteClick = (dashboard_id: string) => {
        const dashboard = (dashboard_list?.response as Dashboard[]).find((item) => item.dashboard_id === dashboard_id);
        if (dashboard) {
            setShowDeleteModal(true);
            setDeleteDashboardId(dashboard_id);
        }
    };

    const handleMainTabChange = (tab: string) => {
        setActiveTab(tab);
        // Reset sub-tab to default when switching main tabs
        if (tab === "autonomous") {
            setActiveSubTab(DASHBOARD_TABS_AUTONOMUS[0][0]);
        }
        setSearchInput("");
    };

    const actionHandler = (record: Dashboard) => {
        return (
            <div className="mx-4 flex justify-center gap-2">
                <button
                    onClick={() => handleDashboardEditClick(record.dashboard_id)}
                    className=" cursor-pointer rounded border border-[#DED300] px-2 py-2 text-xs text-white transition-all duration-200 hover:border-[#646464] active:scale-90"
                    aria-label={`Edit dashboard ${record.name}`}
                >
                    <EditIcon />
                </button>
                <button
                    onClick={() => handleDashboardViewClick(record.dashboard_id)}
                    className=" cursor-pointer rounded border border-[#e4e4e4] px-2 py-2 text-xs text-white transition-all duration-200 hover:border-[#646464] active:scale-90"
                    aria-label={`View dashboard ${record.name}`}
                >
                    <ViewIcon />
                </button>
                <div
                    className="bg-[#AE3020]  cursor-pointer rounded border border-[#F13F28] px-2 py-2 text-xs text-white transition-all duration-200 hover:border-[#646464] active:scale-90"
                    onClick={() => handleDashboardDeleteClick(record.dashboard_id)}
                >
                    <TrashIcon />
                </div>
            </div>
        );
    };

    const transformedManualTableData = useMemo(() => {
        return filteredTableData.map((row) => ({
            ...row,
            actions: actionHandler(row)
        }));
    }, [filteredTableData]);

    // Render loading state
    if (dashboard_list?.status === LOADING) {
        return (
            <Centered className={`flex-col items-center justify-center p-4 ${barlow.className}`}>
                <div className="flex animate-pulse space-x-1">
                    <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#343434]" style={{ animationDelay: "0s" }} />
                    <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#343434]" style={{ animationDelay: "0.1s" }} />
                    <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#343434]" style={{ animationDelay: "0.2s" }} />
                </div>
                <div className={`${barlow.className} mt-2 text-base font-semibold text-[#343434]`}>Dashboards Data Loading</div>
            </Centered>
        );
    }

    return (
        <>
            <Centered className="items-start justify-start p-2">
                <div className="flex w-full flex-row items-center justify-between">
                    <h2 className={`${barlow.className} mt-5 mb-4 pl-2.5 text-[32px] font-semibold text-[#000000]`}>Dashboards</h2>
                </div>

                <div className="mb-5 flex w-[40%] items-center justify-between pl-2.5">
                    <InputField
                        label=""
                        description="Search dashboards"
                        placeholder="Search Dashboard"
                        type="search"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </div>

                <div className="flex w-full justify-between pl-2.5">
                    {/* Main tabs (Manual/Autonomous) */}
                    <div className="mb-4">
                        <Tabs data={DASHBOARD_TABS} activeTab={activeTab} setActiveTab={handleMainTabChange} />
                    </div>

                    {/* Sub-tabs for Autonomous (only show when autonomous is selected) */}
                    {activeTab === "autonomous" && (
                        <div className="mb-4">
                            <Tabs data={DASHBOARD_TABS_AUTONOMUS} activeTab={activeSubTab} setActiveTab={setActiveSubTab} />
                        </div>
                    )}
                </div>

                <div className="w-full p-2">
                    {activeTab === "autonomous" && activeSubTab === "kpi_monitoring" ? (
                        <KpiMonitoringDashboard />
                    ) : (
                        <KpiTable columns={manualColumns} data={transformedManualTableData} />
                    )}
                </div>
            </Centered>
        </>
    );
};

export const DashboardPanel = withAuth(DashboardComponent);
