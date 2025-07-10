import React, { useEffect } from "react";

import { ADMIN_SIDEBAR_ITEMS } from "@constants";
import { useRouter } from "next/router";
import { useFigAgent } from "@hooks";
import { withAuth } from "@utils";

const AdminPage: React.FC = () => {
    const router = useRouter();
    const { setThreadId } = useFigAgent();
    useEffect(() => {
        setThreadId("");
        const initialItem = ADMIN_SIDEBAR_ITEMS[1];
        router.push(`/admin/${initialItem.path}`);
    }, []);
    return <></>;
};

export default withAuth(AdminPage);
