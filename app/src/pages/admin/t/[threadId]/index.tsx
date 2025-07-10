"use client";

import { ThreadPanel } from "@organisms";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useFigAgent } from "@hooks";
import { withAuth } from "@utils";

const ThreadPage: React.FC = () => {
    const { query } = useRouter();
    const { threadId, setThreadId } = useFigAgent();
    useEffect(() => {
        if (query.threadId !== undefined && query.threadId != threadId) {
            let id = query.threadId as string;
            if (id === "new") {
                id = "";
            }
            setThreadId(id);
        }
    }, [query.threadId, threadId, setThreadId]);

    return <ThreadPanel pageTitle={`Canvas ${threadId ? "- " + threadId : ""}`} />;
};

export default withAuth(ThreadPage);
