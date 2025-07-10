"use client";
import { AdminSideBar, ChatBox, PageHeader, PageLayout, PageTitle } from "@templates";
import { KnowledgeGraphConfigPanel } from "@organisms";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { CopilotChatButton } from "@molecules";
import isEmpty from "lodash/isEmpty";
import { useFigAgent } from "@hooks";

export const ThreadPanel: React.FC<{ pageTitle: string }> = ({ pageTitle }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    const { threadId, threadInfo } = useFigAgent();
    
    const [isChatCollapsed, setIsChatCollapsed] = useState(false);
    const [leftWidth, setLeftWidth] = useState<number>(() => {
        const saved = localStorage.getItem("splitPos");
        return saved ? parseInt(saved, 10) : 75;
    });

    const handleChatCollapseChange = useCallback((collapsed: boolean) => {
        setIsChatCollapsed(collapsed);
    }, []);

    // Debounced localStorage save
    useEffect(() => {
        if (!isDraggingRef.current) {
            const timeoutId = setTimeout(() => {
                localStorage.setItem("splitPos", leftWidth.toString());
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
                localStorage.setItem("splitPos", leftWidth.toString());

                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        },
        [leftWidth]
    );

    const isThreadContainInfo =
        (threadInfo?.kg?.edges?.length ?? 0) > 0 ||
        (threadInfo?.kg?.nodes?.length ?? 0) > 0 ||
        (threadInfo?.charts?.length ?? 0) > 0 ||
        (threadInfo?.texts?.length ?? 0) > 0;

    const isNewOrEmptyChat = isEmpty(threadId) || threadId === "new" || !isThreadContainInfo;

    const getLeftPanelWidth = useCallback(() => {
        if (isNewOrEmptyChat) return "0%";
        if (isChatCollapsed) return "calc(100% - 40px)";
        return `${leftWidth}%`;
    }, [isNewOrEmptyChat, isChatCollapsed, leftWidth]);

    const getRightPanelWidth = useCallback(() => {
        if (isNewOrEmptyChat) return "100%";
        if (isChatCollapsed) return "40px";
        return `${100 - leftWidth}%`;
    }, [isNewOrEmptyChat, isChatCollapsed, leftWidth]);

    return (
        <div className="flex h-screen flex-col overflow-hidden">
            <PageLayout
                className="relative h-screen bg-[#F7F7F7] overflow-hidden"
                name="admin"
                header={
                    <PageHeader>
                        <PageTitle>{pageTitle}</PageTitle>
                    </PageHeader>
                }
                sidebar={<AdminSideBar />}
            >
                {/* Main Content Container with 10px padding and 10px gap between panels */}
                <div className="h-[calc(100vh-64px)] m-0 p-0 overflow-hidden bg-[#F7F7F7]">
                    <div ref={containerRef} className="flex h-[99%] p-0 gap-[5px] overflow-hidden">
                        {/* Left Panel - Knowledge Graph Panel */}
                        {!isNewOrEmptyChat ? (
                            <div
                                className="flex flex-col overflow-hidden bg-white rounded-sm border border-[#E5E6E6] shadow-sm transition-[width] duration-200 ease-out will-change-[width]"
                                style={{
                                    width: getLeftPanelWidth(),
                                    transform: "translate3d(0,0,0)" // Force hardware acceleration
                                }}
                            >
                                <div className="flex-1 overflow-y-auto">
                                    <KnowledgeGraphConfigPanel />
                                </div>
                            </div>
                        ) : (
                            isChatCollapsed && (
                                <div
                                    className="flex flex-col items-center justify-center overflow-hidden bg-white rounded-sm border border-[#E5E6E6] shadow-sm transition-[width] duration-200 ease-out"
                                    style={{ width: "100%", minWidth: 0 }}
                                >
                                    <div className="flex h-full w-full flex-1 flex-col items-center justify-center p-8">
                                        <div className="text-center text-lg font-medium text-gray-500">
                                            No data available.
                                            <br />
                                            Please use the chat to start a new conversation.
                                        </div>
                                    </div>
                                </div>
                            )
                        )}

                        {/* Resizer */}
                        {!isChatCollapsed && !isNewOrEmptyChat && (
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
        </div>
    );
};