import React, { useEffect, useRef, useState } from "react";

import { EmptyIconRenderer, PollingIntervalButton, SchemaRenderer, ShareModal } from "@molecules";
import { PageActions, PageHeader, PageLayout, PageTitle, SideBar } from "@templates";
import { dashboardState, setFlagStatus } from "@redux/slices";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { Button, Centered, ShareButton } from "@atoms";
import { useReactToPrint } from "react-to-print";
import { FaFilePdf } from "react-icons/fa6";
import { IDLE, SUCCESS } from "@constants";
import { useRouter } from "next/router";
import { withAuth } from "@utils";

const TopicsPage: React.FC = ({ userId }: any) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const topicId = router.query.chatId as string;

    const { schema_status, topic_list } = useAppSelector(dashboardState);
    const [topic, setTopic] = useState<any>(topic_list.find((q) => q.topic_id === topicId));

    useEffect(() => {
        return () => {
            dispatch(setFlagStatus({ schema_status: IDLE, schema: [], execution_logs: [] }));
        };
    }, [dispatch]);

    useEffect(() => {
        setTopic(topic_list.find((q) => q.topic_id === topicId));
    }, [topic_list, topicId]);

    const contentRef = useRef<HTMLDivElement>(null);

    const reactToPrintFn = useReactToPrint({
        contentRef,
        documentTitle: topic?.topic_description
    });

    const exportReport2PDF = () => {
        reactToPrintFn();
    };

    const topicDesc = topic?.topic_description || "Unknown Thread";
    return (
        <PageLayout
            name={`Thread: ${topicDesc}`}
            header={
                <PageHeader>
                    <PageTitle>{topicDesc}</PageTitle>
                    {schema_status === SUCCESS && (
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
            <div className="relative flex w-full flex-grow flex-col px-2">
                <div ref={contentRef} className="relative my-2 rounded-md border">
                    {topic ? (
                        <>
                            <SchemaRenderer topicId={topicId} userId={userId} />
                            {/* <div className="sticky bottom-5 mx-auto w-full max-w-2xl">
                                <AskAnything className={"w-full rounded-3xl bg-white"} placeholder={"Ask follow up questions..."} />
                            </div> */}
                        </>
                    ) : (
                        <Centered className="min-h-[90vh]">
                            <EmptyIconRenderer isError={true} title="Oops! This thread does not exist" />
                        </Centered>
                    )}
                </div>
            </div>
            <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
        </PageLayout>
    );
};

export default withAuth(TopicsPage);
