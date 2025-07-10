import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { useReactToPrint } from "react-to-print";
import { FaFilePdf } from "react-icons/fa6";

import { PollingIntervalButton, RecentQuestionsRenderer, SchemaRenderer, ShareModal } from "@molecules";
import { PageActions, PageHeader, PageLayout, PageTitle, SideBar } from "@templates";
import { Button, ShareButton } from "@atoms";

import { dashboardState, setFlagStatus } from "@redux/slices";
import { useRouter } from "next/navigation";
import { IDLE, SUCCESS } from "@constants";
import { withAuth } from "@utils";

const DashboardLayout = ({ userId }) => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const { topic_list_status, schema_status, topic_list, execution_logs, isFirstTopic } = useAppSelector(dashboardState);
    const [topicId, setTopicId] = useState<any>(topic_list.find((q) => q.is_default_overview)?.topic_id);

    useEffect(() => {
        if (topic_list_status === SUCCESS && isFirstTopic) {
            router.replace("/chat");
        }
    }, [topic_list_status, isFirstTopic, router]);

    const LoadTopicId = useCallback(() => {
        if (!Array.isArray(topic_list)) return;

        if (topicId == undefined && topic_list?.length > 0) {
            setTopicId(topic_list[0].topic_id);
        }
    }, [topic_list, topicId]);

    useEffect(() => {
        return () => {
            dispatch(setFlagStatus({ schema_status: IDLE, schema: [], execution_logs: [] }));
        };
    }, [dispatch]);

    useEffect(LoadTopicId, [LoadTopicId]);

    const contentRef = useRef<HTMLDivElement>(null);

    const reactToPrintFn = useReactToPrint({
        contentRef,
        documentTitle: "Dashboard"
    });

    const exportReport2PDF = () => {
        reactToPrintFn();
    };

    return (
        <PageLayout
            name="Overview Dashboard"
            header={
                <PageHeader>
                    <PageTitle>Overview Dashboard</PageTitle>
                    {schema_status == SUCCESS && (
                        <PageActions>
                            <ShareButton id="share-dashboard" onClick={() => setIsShareModalOpen(true)} />
                            <Button
                                icon={<FaFilePdf />}
                                label="Export"
                                variant="primary"
                                onClick={exportReport2PDF}
                                style={{ display: "inline-flex", alignItems: "center" }}
                            />
                            <PollingIntervalButton />
                        </PageActions>
                    )}
                </PageHeader>
            }
            sidebar={<SideBar />}
        >
            <div ref={contentRef} className="my-2 rounded-md border">
                <SchemaRenderer userId={userId} topicId={topicId} executionLogs={execution_logs} />
            </div>
            <RecentQuestionsRenderer userId={userId} />
            <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
        </PageLayout>
    );
};

export default withAuth(DashboardLayout);
