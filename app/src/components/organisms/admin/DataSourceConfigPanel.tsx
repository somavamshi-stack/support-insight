import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { fetchDataSourceConnections } from "@redux/actions";
import { useCallback, useEffect } from "react";
import KpiTable from "../../molecules/Tables/KpiTable";
import { barlow } from "../../../assets/fonts/barlow";
import { AddDSButton, Centered } from "@atoms";
import { adminState } from "@redux/slices";
import { withAuth } from "@utils";

interface DataSourceConfigPanelProps {
    onAddDataSource: () => void;
}

const DataSourceComponent: React.FC<DataSourceConfigPanelProps> = ({ onAddDataSource }) => {
    const dispatch = useAppDispatch();
    const { topic_list_status, topic_list } = useAppSelector(adminState);

    const fetchTopicsList = useCallback(() => {
        dispatch(fetchDataSourceConnections());
    }, [dispatch]);

    useEffect(fetchTopicsList, [fetchTopicsList]);

    const getColumns = useCallback(() => {
        return [
            { key: "name", label: "Datasource" },
            { key: "created_by", label: "Created By" },
            { key: "created_on", label: "Created On" },
            { key: "last_updated", label: "Last Updated" },
            { key: "status", label: "Status" }
        ];
    }, []);

    return (
        <>
            <Centered className="items-start justify-start p-2">
                <div className="flex w-full flex-row items-center justify-between">
                    <h2 className={`${barlow.className} mt-5 mb-4 pl-2.5 text-[32px] font-semibold text-[#000000]`}>Data Source Connection</h2>
                    <AddDSButton id="add-ds" onClick={onAddDataSource} />
                </div>
                {topic_list_status === "loading" ? (
                    <p>Loading...</p>
                ) : topic_list_status === "failed" ? (
                    <p>Error fetching topics.</p>
                ) : (
                    <div className="w-full p-2">
                        <KpiTable columns={getColumns()} data={topic_list || []} />
                    </div>
                )}
            </Centered>
        </>
    );
};

export const DataSourceConfigPanel = withAuth(DataSourceComponent);
