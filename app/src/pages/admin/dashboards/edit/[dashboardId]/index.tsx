import { PageHeader, PageLayout, PageTitle } from "@templates";
import { withAuth } from "@utils";
import React from "react";

const DashboardEdit: React.FC = () => (
    <PageLayout
        className="relative"
        name="admin"
        header={
            <PageHeader>
                <PageTitle>Dashboards ID : {"1"} </PageTitle>
            </PageHeader>
        }
    >
        {/* <DashboardPanel /> */}
        <></>
    </PageLayout>
);

export default withAuth(DashboardEdit);
