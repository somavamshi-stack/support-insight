import { AdminSideBar, ChatBox, PageHeader, PageLayout, PageTitle } from "@templates";
import { Pane, SplitPane, withAuth } from "@utils";
import { WorkBenchConfigPanel } from "@organisms";
import { CopilotChatButton } from "@molecules";
import { useFigAgent } from "@hooks";
import React from "react";

const WorkbenchPage: React.FC = () => {
    const { isChatOpen, chatLayout, threadId } = useFigAgent();

    const [x, y] = localStorage.getItem("splitPos")?.split(",") ?? ["75%", "25%"];
    return (
        <PageLayout
            className="relative"
            name="admin"
            header={
                <PageHeader>
                    <PageTitle>Workbench</PageTitle>
                </PageHeader>
            }
            sidebar={<AdminSideBar />}
        >
            <SplitPane split={chatLayout} onChange={(size) => localStorage.setItem("splitPos", size)}>
                <Pane initialSize={isChatOpen ? x : "100%"}>
                    <WorkBenchConfigPanel />
                </Pane>
                {isChatOpen && (
                    <Pane initialSize={y} maxSize="50%" minSize="20%">
                        <ChatBox threadId={threadId} />
                    </Pane>
                )}
            </SplitPane>
            <CopilotChatButton />
        </PageLayout>
    );
};

export default withAuth(WorkbenchPage);
