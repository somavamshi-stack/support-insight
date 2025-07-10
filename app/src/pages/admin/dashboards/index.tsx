import {
    deleteAdminDashboard,
    deleteMonitoringConfig,
    fetchAdminDashboards,
    fetchAllMonitoringConfigs,
    updateAdminDashboard,
    updateMonitoringConfig
} from "@redux/actions/adminActions";
import {
    adminState,
    setDeleteConfigId,
    setDeleteConfigModal,
    setEditConfigId,
    setEditConfigInitialData,
    setShowEditConfigModal,
    setShowEditConfigSuccess
} from "@redux/slices";
import { BasicModal, ConfirmationModal, CopilotChatButton, SaveDashboardForm } from "@molecules";
import { AdminSideBar, ChatBox, PageHeader, PageLayout, PageTitle } from "@templates";
import EditKpiMonitoring from "components/organisms/admin/EditKpiMonitoring";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { DashboardPanel } from "@organisms";
import { useFigAgent } from "@hooks";
import { withAuth } from "@utils";

const Dashboards: React.FC = () => {
    const dispatch = useAppDispatch();
    const containerRef = useRef<HTMLDivElement>(null);
    const { threadId } = useFigAgent();
    const isDraggingRef = useRef(false);

    const { edit_kpi_config, delete_kpi_config } = useAppSelector(adminState);

    const [isChatCollapsed, setIsChatCollapsed] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [deleteDashboardId, setDeleteDashboardId] = useState<string | null>(null);

    const [isEditDashboard, setIsEditDashboard] = useState(false);
    const [editDashboardId, setEditDashboardId] = useState<string | null>(null);
    const [initialData, setInitialData] = useState<{ name: string; description: string }>({
        name: "",
        description: ""
    });
    const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);

    const [leftWidth, setLeftWidth] = useState<number>(() => {
        const saved = localStorage.getItem("dashboardSplitPos");
        return saved ? parseInt(saved, 10) : 75;
    });

    const handleChatCollapseChange = useCallback((collapsed: boolean) => {
        setIsChatCollapsed(collapsed);
    }, []);

    // Debounced localStorage save
    useEffect(() => {
        if (!isDraggingRef.current) {
            const timeoutId = setTimeout(() => {
                localStorage.setItem("dashboardSplitPos", leftWidth.toString());
            }, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [leftWidth]);

    const startDragging = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();

            const container = containerRef.current;
            if (!container) return;

            isDraggingRef.current = true;
            const containerRect = container.getBoundingClientRect();

            // Add dragging class for potential CSS optimizations
            document.body.classList.add("dragging");

            const onMouseMove = (e: MouseEvent) => {
                if (!isDraggingRef.current) return;

                // Calculate percentage directly from mouse position
                const relativeX = e.clientX - containerRect.left;
                const newWidth = Math.max(10, Math.min(90, (relativeX / containerRect.width) * 100));

                setLeftWidth(newWidth);
            };

            const onMouseUp = () => {
                isDraggingRef.current = false;
                document.body.classList.remove("dragging");

                // Save final position
                localStorage.setItem("dashboardSplitPos", leftWidth.toString());

                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        },
        [leftWidth]
    );

    const getLeftPanelWidth = useCallback(() => {
        return isChatCollapsed ? "calc(100% - 40px)" : `${leftWidth}%`;
    }, [isChatCollapsed, leftWidth]);

    const getRightPanelWidth = useCallback(() => {
        return isChatCollapsed ? "40px" : `${100 - leftWidth}%`;
    }, [isChatCollapsed, leftWidth]);

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleteDashboardId(null);
    };

    const handleDeleteDashboard = async () => {
        if (deleteDashboardId) {
            setShowDeleteSuccess(true);
            await dispatch(deleteAdminDashboard(deleteDashboardId));
            await dispatch(fetchAdminDashboards());
        }
    };

    const handleCloseEditModal = () => {
        setIsEditDashboard(false);
        setEditDashboardId(null);
        setInitialData({ name: "", description: "" });
    };

    const handleUpdateDashboard = async (dashboard: { name: string; description: string }) => {
        try {
            if (editDashboardId) {
                setShowUpdateSuccess(true);
                await dispatch(updateAdminDashboard({ dashboardId: editDashboardId, dashboardPayload: dashboard }));
                await dispatch(fetchAdminDashboards());
            }
        } catch (error) {
            console.error(error);
            setShowUpdateSuccess(false);
        }
    };

    const handleConfirmEditConfig = async (data: any) => {
        dispatch(setShowEditConfigSuccess(true));
        if (edit_kpi_config?.selectedConfigId)
            await dispatch(
                updateMonitoringConfig({
                    configId: edit_kpi_config?.selectedConfigId,
                    configPayload: { is_active: data?.is_active, schedule_cron: data?.schedule_cron }
                })
            );
        await dispatch(fetchAllMonitoringConfigs());
    };

    const handleCloseEditConfigModal = () => {
        dispatch(setShowEditConfigModal(false));
        dispatch(setEditConfigId(null));
        dispatch(setEditConfigInitialData({ schedule_cron: "", is_active: true }));
    };

    const handleConfirmConfigDelete = async () => {
        if (delete_kpi_config?.selectedConfigId) {
            setShowDeleteSuccess(true);
            await dispatch(deleteMonitoringConfig(delete_kpi_config?.selectedConfigId));
            await dispatch(fetchAllMonitoringConfigs());
        }
    };

    const handleCloseDeleteConfigModal = () => {
        dispatch(setDeleteConfigModal(false));
        dispatch(setDeleteConfigId(null));
    };

    return (
        <PageLayout
            className="relative h-screen bg-[#F7F7F7] overflow-hidden"
            name="admin"
            sidebar={<AdminSideBar />}
            header={
                <PageHeader>
                    <PageTitle>Dashboards</PageTitle>
                </PageHeader>
            }
        >
            {/* Delete dashboard modal */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={handleCloseDeleteModal}
                title="Delete Dashboard"
                message="Are you sure you want to delete this dashboard? This action cannot be undone."
                onConfirm={handleDeleteDashboard}
            />

            {/* Edit dashboard modal */}
            <BasicModal
                isOpen={isEditDashboard}
                onClose={handleCloseEditModal}
                title="Edit Dashboard"
                modalContent={
                    <SaveDashboardForm
                        mode="update"
                        initialData={initialData}
                        onClose={handleCloseEditModal}
                        onSubmit={handleUpdateDashboard}
                        submitButtonLabel="Update"
                    />
                }
            />

            {/* Edit configuration modal */}
            <BasicModal
                isOpen={edit_kpi_config?.showEditModal}
                onClose={handleCloseEditModal}
                title="Edit Configuration"
                modalContent={
                    <EditKpiMonitoring
                        onClose={handleCloseEditConfigModal}
                        initialData={edit_kpi_config?.initialData}
                        onSave={handleConfirmEditConfig}
                    />
                }
            />

            {/* Delete configuration modal */}
            <ConfirmationModal
                isOpen={delete_kpi_config?.showDeleteModal}
                onClose={handleCloseDeleteConfigModal}
                title="Delete Configuration"
                message="Are you sure you want to delete this dashboard? This action cannot be undone."
                onConfirm={handleConfirmConfigDelete}
            />

            {/* Main Content Container with 10px padding and 10px gap between panels */}
            <div className="h-[calc(100vh-64px)] m-0 p-0 overflow-hidden bg-[#F7F7F7]">
                <div ref={containerRef} className="flex h-[99%] p-0 gap-[5px] overflow-hidden">
                    {/* Left Panel - Dashboard Panel */}
                    <div
                        className="flex flex-col overflow-hidden bg-white rounded-sm border border-[#E5E6E6]shadow-sm transition-[width] duration-200 ease-out will-change-[width]"
                        style={{
                            width: getLeftPanelWidth(),
                            transform: "translate3d(0,0,0)" // Force hardware acceleration
                        }}
                    >
                        <div className="flex-1 overflow-y-auto">
                            <DashboardPanel
                                setDeleteDashboardId={setDeleteDashboardId}
                                setShowDeleteModal={setShowDeleteModal}
                                setShowDeleteSuccess={setShowDeleteSuccess}
                                showDeleteSuccess={showDeleteSuccess}
                                showUpdateSuccess={showUpdateSuccess}
                                setEditDashboardId={setEditDashboardId}
                                setIsEditDashboard={setIsEditDashboard}
                                setInitialData={setInitialData}
                                setShowUpdateSuccess={setShowUpdateSuccess}
                            />
                        </div>
                    </div>

                    {/* Resizer */}
                    {!isChatCollapsed && (
                        <div
                            className="group relative w-[8px] flex-shrink-0 cursor-col-resize select-none"
                            onMouseDown={startDragging}
                            style={{ userSelect: "none" }}
                        >
                            {/* The thin line */}
                            <div className="absolute top-0 left-1/2 h-full w-px bg-gray-300 transition-colors duration-150 group-hover:bg-gray-500" />

                            {/* The bulge handle */}
                            <div className="absolute top-1/2 left-1/2 h-8 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-300 bg-gray-100 transition-all duration-150 group-hover:border-gray-500 group-hover:shadow-md" />
                        </div>
                    )}

                    {/* Right Panel - Chat */}
                    <div
                        className="flex h-full min-h-0 flex-col m-0 overflow-hidden bg-white rounded-sm border border-[#E5E6E6] shadow-sm transition-[width] duration-200 ease-out will-change-[width]"
                        style={{
                            width: getRightPanelWidth(),
                            transform: "translate3d(0,0,0)"
                        }}
                    >
                        <ChatBox threadId={threadId} onCollapseChange={handleChatCollapseChange} />
                    </div>
                </div>
            </div>

            <CopilotChatButton />

            <style jsx>{`
                :global(.dragging) {
                    cursor: col-resize !important;
                    user-select: none !important;
                }
                :global(.dragging *) {
                    pointer-events: none !important;
                }
            `}</style>
        </PageLayout>
    );
};

export default withAuth(Dashboards);