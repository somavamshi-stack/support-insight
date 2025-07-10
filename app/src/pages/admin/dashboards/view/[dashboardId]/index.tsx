import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { ChartContainer, showNotification, TextContainer } from "@molecules";
import { Button, Centered, GridSpinner } from "@atoms";
import { IDLE, LOADING, SUCCESS } from "@constants";

import { adminState, setFlagStatus, setSelectedDashboardGraph, setSelectedDashboardText } from "@redux/slices";
import { deleteItemFromAdminDashboard, fetchAdminDashboardByID } from "@redux/actions";
import { useAppDispatch, useAppSelector } from "@redux/hooks";

import { AdminSideBar, PageHeader, PageLayout, PageTitle } from "@templates";
import { withAuth } from "@utils";

const DashboardView: React.FC = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { dashboard_item, selectedDashboardGraphs, selectedDashboardTexts, dashboard_delete_item } = useAppSelector(adminState);

    const [dashboardChart, setDashboardChart] = useState([]);
    const [dashboardText, setDashboardText] = useState([]);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

    const { dashboardId } = router.query;
    const items = dashboard_item?.response?.items;

    const graphsCount = selectedDashboardGraphs?.length || 0;
    const textsCount = selectedDashboardTexts?.length || 0;
    const totalSelectedItems = graphsCount + textsCount;
    const disableDeleteButton = totalSelectedItems !== 1;

    useEffect(() => {
        if (dashboardId && typeof dashboardId === "string") {
            setDashboardChart([]);
            dispatch(fetchAdminDashboardByID(dashboardId));
        }
    }, [dashboardId, dispatch, dashboard_delete_item]);

    useEffect(() => {
        if (dashboard_item?.status === SUCCESS && dashboard_item?.response) {
            const chartItems = items?.filter((item) => item?.item_type === "chart").map((item) => item.item_spec) || [];
            const textItems = items?.filter((item) => item?.item_type === "text").map((item) => item.item_spec) || [];

            setDashboardChart(chartItems);
            setDashboardText(textItems);

            const validSelectedGraphs = selectedDashboardGraphs?.filter((graph) => chartItems.some((item) => item.chart_id === graph.chart_id)) || [];
            const validSelectedTexts = selectedDashboardTexts?.filter((text) => textItems.some((item) => item.text_id === text.text_id)) || [];

            dispatch(setSelectedDashboardGraph(validSelectedGraphs));
            dispatch(setSelectedDashboardText(validSelectedTexts));
        } else if (dashboard_item?.error) {
            showNotification({
                title: `${dashboard_item?.api_response_status}: Failed to fetch Dashboard Items`,
                text: `${dashboard_item?.error_message}`,
                icon: "error"
            });
        }
    }, [dashboard_item, dispatch]);

    useEffect(() => {
        if (dashboard_delete_item?.status === SUCCESS && showDeleteSuccess) {
            dispatch(setFlagStatus({ dashboard_delete: { status: IDLE } }));
            setShowDeleteSuccess(false);
            dispatch(setSelectedDashboardGraph([]));
            dispatch(setSelectedDashboardText([]));
            showNotification({
                title: "Dashboard Item Deleted",
                text: "Dashboard item deleted successfully",
                icon: "success"
            });
        } else if (dashboard_delete_item?.error) {
            setShowDeleteSuccess(false);
            showNotification({
                title: `${dashboard_delete_item?.api_response_status}: Failed to Delete the Item!`,
                text: `${dashboard_delete_item?.error_message}`,
                icon: "error"
            });
        }
    }, [dashboard_delete_item, showDeleteSuccess, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(setSelectedDashboardGraph([]));
            dispatch(setSelectedDashboardText([]));
        };
    }, [dispatch]);

    const handleDeleteItemButton = async () => {
        if (dashboardId && typeof dashboardId === "string") {
            setShowDeleteSuccess(true);
            let itemId = null;

            if (selectedDashboardGraphs?.length === 1) {
                const matchingItem = dashboard_item?.response?.items.find(
                    (item) => item?.item_type === "chart" && item?.item_spec?.chart_id === selectedDashboardGraphs[0]?.chart_id
                );
                itemId = matchingItem ? matchingItem.item_id : null;
            } else if (selectedDashboardTexts?.length === 1) {
                const matchingItem = dashboard_item?.response?.items.find(
                    (item) => item?.item_type === "text" && item?.item_spec?.text_id === selectedDashboardTexts[0]?.text_id
                );
                itemId = matchingItem ? matchingItem.item_id : null;
            }

            if (itemId) {
                await dispatch(deleteItemFromAdminDashboard({ dashboardId, itemId }));
                // dispatch(setSelectedDashboardGraph([]));
                // dispatch(setSelectedDashboardText([]));
            } else {
                setShowDeleteSuccess(false);
                showNotification({
                    title: "Failed to Delete Item",
                    text: "No matching item found for deletion",
                    icon: "error"
                });
            }
        }
    };

    return (
        <PageLayout
            className="relative"
            name="admin"
            header={
                <PageHeader>
                    <PageTitle>Dashboard: {dashboard_item?.response?.name || "Loading..."}</PageTitle>
                </PageHeader>
            }
            sidebar={<AdminSideBar />}
        >
            <div className="flex h-16 justify-end gap-2 p-4">
                <Button
                    label="Delete Item"
                    disabled={disableDeleteButton}
                    className="h-9 bg-red-500 text-lg text-white"
                    onClick={handleDeleteItemButton}
                />
            </div>

            {dashboard_item?.status === LOADING || !dashboardId ? (
                <Centered>
                    <GridSpinner height={30} width={30} color="#793964" />
                    <div className="mt-0.5">Loading dashboard items...</div>
                </Centered>
            ) : (
                <div className="max-h-[calc(100vh-128px)] overflow-y-auto">
                    {dashboardChart.length > 0 && (
                        <div className="mb-4">
                            <ChartContainer charts={dashboardChart} />
                        </div>
                    )}
                    {dashboardText.length > 0 && (
                        <div className="mb-4">
                            <TextContainer text={dashboardText} heightLimit="300px" />
                        </div>
                    )}
                </div>
            )}
        </PageLayout>
    );
};

export default withAuth(DashboardView);
