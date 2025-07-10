"use client";

import { ThreadPanel } from "@organisms";
import { useFigAgent } from "@hooks";
import { withAuth } from "@utils";
import React from "react";

const ThreadPage: React.FC = () => {
    const { threadId } = useFigAgent();

    return <ThreadPanel pageTitle={`Canvas ${threadId ? "- " + threadId : ""}`} />;
};

export default withAuth(ThreadPage);
