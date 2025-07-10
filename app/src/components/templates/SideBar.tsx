import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { MdDashboard, MdDoubleArrow } from "react-icons/md";
import { RiAdminFill, RiChatAiFill } from "react-icons/ri";
import { TopicNavCard, UserInformationCard } from "@atoms";
import { useCallback, useEffect, useState } from "react";
import { HiDocumentText } from "react-icons/hi";
import { dashboardState } from "@redux/slices";
import { fetchTopics } from "@redux/actions";
import { useRouter } from "next/router";
import { SUCCESS } from "@constants";
import { Tooltip } from "@molecules";
import { getUserId } from "@utils";

const SidebarBody = ({ expandSB, path, label, icon }) => {
    const router = useRouter();
    return (
        <div
            id={"navbar-" + path.replaceAll("/", "")}
            className={`inline-flex w-full min-w-0 items-center gap-2 px-5 py-1 font-medium hover:bg-slate-50 ${router.pathname === path ? "rounded-l-lg border-y bg-slate-50" : ""}`}
            onClick={() => router.push(path)}
        >
            <Tooltip title={!expandSB && label}>{icon}</Tooltip>
            {expandSB && <span className="text-align-center truncate text-sm leading-loose">{label}</span>}
        </div>
    );
};

export const SideBar = () => {
    const dispatch = useAppDispatch();
    const [expandSB, setExpandSB] = useState(true);
    const { isFirstTopic, topic_list, topic_create_status } = useAppSelector(dashboardState);
    const userId = getUserId();

    const fetchTopicsList = useCallback(() => {
        if (userId) dispatch(fetchTopics(userId));
    }, [dispatch, userId]);

    useEffect(fetchTopicsList, [fetchTopicsList]);

    useEffect(() => {
        if (topic_create_status === SUCCESS) {
            fetchTopicsList();
        }
    }, [topic_create_status, fetchTopicsList]);

    const openInNewTab = (url) => {
        const newWindow = window.open(url, "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
    };

    const openInSametab = (url) => {
        const newWindow = window.open(url, "_self", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
    };

    return (
        <aside
            className={`sticky top-0 transition-all duration-500 ${expandSB ? "w-[200px]" : "w-16"} flew-grow mr-1 flex cursor-pointer flex-col border-r-[1px] pt-5 text-white shadow-md`}
        >
            <div className="text-color-label mx-px inline-flex items-center justify-start border-b-[1px] border-slate-200 py-1.5 select-none">
                <div className="flex w-full flex-col space-y-2 border border-red-400">
                    {!isFirstTopic && (
                        <SidebarBody icon={<MdDashboard fontSize={expandSB ? 16 : 20} />} expandSB={expandSB} label="Home" path="/dashboard" />
                    )}
                    <SidebarBody icon={<RiChatAiFill fontSize={expandSB ? 16 : 20} />} expandSB={expandSB} label="New Chat" path="/chat" />
                </div>
            </div>
            <div
                id="navbar-topic"
                className="custom-scrollbar flex h-full cursor-default flex-col overflow-x-hidden overflow-y-auto py-2 select-none"
            >
                <div className="group/history">
                    <div style={{ opacity: 1, transform: "none" }}>
                        <div
                            className="mb-md mt-xs space-y-xs pr-sm dark:border-borderMainDark relative ml-2 gap-y-2 border-l border-slate-200 pl-2 duration-200"
                            style={{ transform: "none", transformOrigin: "50% 50% 0px" }}
                        >
                            {topic_list?.map(({ topic_id, topic_description }, key) => (
                                <SidebarItem key={key} id={topic_id} label={topic_description} userIdId={userId} expandSB={expandSB} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div
                id="navbar-admin"
                className="text-color-label inline-flex w-full min-w-0 cursor-pointer items-center gap-2 px-5 py-2 font-medium hover:bg-slate-50 hover:text-blue-600 hover:underline"
                onClick={() => openInSametab(`${window.location.origin}/admin/kg`)}
            >
                <Tooltip title={!expandSB && "Admin Configuration Page"}>
                    <RiAdminFill fontSize={expandSB ? 16 : 20} />
                </Tooltip>
                {expandSB && <span className="text-align-center truncate text-sm leading-loose">Admin Console</span>}
            </div>
            <div
                id="navbar-documentation"
                className="text-color-label inline-flex w-full min-w-0 cursor-pointer items-center gap-2 px-5 py-2 font-medium hover:bg-slate-50 hover:text-blue-600 hover:underline"
                onClick={() => openInNewTab(`${window.location.origin}/documentation/docs/intro`)}
            >
                <Tooltip title={!expandSB && "Documentation"}>
                    <HiDocumentText fontSize={expandSB ? 16 : 20} />
                </Tooltip>
                {expandSB && <span className="text-align-center truncate text-sm leading-loose">Documentation</span>}
            </div>
            {expandSB && <UserInformationCard />}
            <div
                className={`mx-px flex h-9 w-full border-t-[1px] border-slate-200 py-1 transition-all duration-500 ${expandSB ? "justify-end" : "justify-center"}`}
            >
                <div
                    id="navbar-toggle-btn"
                    className="text-color-label/90 mx-1 flex size-7 cursor-pointer items-center justify-center rounded hover:bg-slate-300"
                    onClick={() => setExpandSB(!expandSB)}
                >
                    <MdDoubleArrow className={` ${expandSB ? "rotate-180" : ""} cursor-pointer`} fontSize="24px" />
                </div>
            </div>
        </aside>
    );
};

const SidebarItem = (props) => {
    const { query, push } = useRouter();
    const ref = `/c/${props.id}`;
    const pathname = `/c/${query.chatId}`;
    return (
        <div
            style={{
                opacity: 1,
                transform: "none",
                transformOrigin: "50% 50% 0px"
            }}
        >
            <div
                id={`navbar-${props.id}`}
                onClick={() => push(ref)}
                className={`group block w-full cursor-pointer divide-slate-300 rounded border-slate-300 p-1 pl-2 ring-slate-300 transition duration-300 md:hover:bg-slate-50 ${pathname === ref ? "rounded-l-lg border-y bg-slate-100" : ""}`}
            >
                <TopicNavCard {...props} />
            </div>
        </div>
    );
};
