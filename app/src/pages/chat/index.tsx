import React from "react";

import { PageLayout, SideBar } from "@templates";
import { AskAnything } from "@molecules";
import { withAuth } from "@utils";

const ChatPage: React.FC = ({ userId }: any) => (
    <PageLayout name="New Chat" sidebar={<SideBar />}>
        <AskAnything userId={userId} placeholder="Ask me anything..." title="What do you want to know?" />
    </PageLayout>
);

export default withAuth(ChatPage);
