import { deleteAdminThread, fetchAdminThreads } from "@redux/actions/adminActions";
import { ADMIN_SIDEBAR_ITEMS, SUCCESS, THREAD_PAGE_PREFIX } from "@constants";
import logoRoundImage from "../../assets/img/logo-round-image.svg";
import threadsExpandedIcon from "../icons/threadsExpandedIcon";
import existingChatIcon from "../icons/existingChat";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { barlow } from "../../assets/fonts/barlow";
import { MdEdit, MdDelete } from "react-icons/md";
import threadsIcon from "../icons/threadsIcon";
import { useAppDispatch } from "@redux/hooks";
import { UserInformationCard } from "@atoms";
import newChatIcon from "../icons/newChat";
import { useRouter } from "next/router";
import { IconType } from "react-icons";
import { useFigAgent } from "@hooks";
import Image from "next/image";

export const AdminSideBar = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isThreadBarExpanded, setIsThreadBarExpanded] = useState(false);
    const [activeSettingsMenu, setActiveSettingsMenu] = useState<string | null>(null);
    const { setThreadId, thread_list, thread_list_status, fetchThreads, threadId, admin_thread_delete } = useFigAgent();

    const threadListRef = useRef<HTMLDivElement>(null);

    useEffect(fetchThreads, []);

    useEffect(() => {
        const routeId = router.query.threadId as string;
        if (routeId && thread_list_status === SUCCESS && thread_list.length > 0) {
            setIsThreadBarExpanded(true);
        }
    }, [router.query.threadId, thread_list_status, thread_list]);

    useEffect(() => {
        const handleMouseLeave = (e: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(e.relatedTarget as Node)) {
                setIsExpanded(false);
            }
        };

        const sidebarNode = sidebarRef.current;
        if (sidebarNode) {
            sidebarNode.addEventListener("mouseleave", handleMouseLeave);
            return () => sidebarNode.removeEventListener("mouseleave", handleMouseLeave);
        }
    }, []);

    // Close settings menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest(".settings-menu") && !target.closest(".settings-trigger")) {
                setActiveSettingsMenu(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    // Function to scroll selected thread into view within the sidebar container
    const scrollToThread = (threadId: string) => {
        setTimeout(() => {
            const threadElement = document.getElementById(threadId);
            const container = threadListRef.current;

            if (threadElement && container) {
                // Get the offset of the thread element relative to the container
                const threadOffsetTop = threadElement.offsetTop;
                const itemHeight = threadElement.offsetHeight;
                const containerHeight = container.clientHeight;

                // Calculate the ideal scroll position to center the selected thread
                let idealScrollTop = threadOffsetTop - containerHeight / 2 + itemHeight / 2;

                // Clamp the scroll position within bounds
                idealScrollTop = Math.max(0, Math.min(idealScrollTop, container.scrollHeight - containerHeight));

                container.scrollTo({
                    top: idealScrollTop,
                    behavior: "smooth"
                });
            }
        }, 300);
    };

    // Scroll to selected thread when threadId, thread list, or sidebar expansion changes
    useEffect(() => {
        if (isExpanded && isThreadBarExpanded && thread_list.length > 0 && threadId && thread_list.some((thread) => thread.thread_id === threadId)) {
            scrollToThread(threadId);
        }
    }, [isExpanded, isThreadBarExpanded, thread_list, threadId]);

    // Refresh thread list after deletion
    useEffect(() => {
        if (admin_thread_delete?.status === SUCCESS) {
            dispatch(fetchAdminThreads());
        }
    }, [admin_thread_delete, dispatch]);

    const handleEditThread = (threadId: string) => {
        // Implement edit functionality here
        console.log("Edit thread:", threadId);
        setActiveSettingsMenu(null);
        // You can add your edit logic here, such as opening an edit modal
    };

    const handleDeleteThread = (threadId: string) => {
        dispatch(deleteAdminThread(threadId));
        setActiveSettingsMenu(null);
    };

    return (
        <aside
            ref={sidebarRef}
            onMouseEnter={() => setIsExpanded(true)}
            className={`${barlow.className} sticky top-0 font-semibold transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isExpanded ? "w-[250px]" : "w-16"} flew-grow flex cursor-pointer flex-col space-y-1 border border-[#E4E4E7] bg-[#FAFAFA] text-white shadow-md`}
        >
            <div className="mb-3 flex items-center justify-center py-2">
                <Image src={logoRoundImage} alt="Company Logo" width={40} height={40} className="transition-all duration-300 ease-in-out" />
            </div>
            {ADMIN_SIDEBAR_ITEMS.map((item) => (
                <AdminSidebarItem
                    id={item.name}
                    key={item.name}
                    {...item}
                    path={`/admin/${item.path}`}
                    isExpanded={isExpanded}
                    onClick={() => {
                        router.push(`/admin/${item.path}`);
                        setIsThreadBarExpanded(false);
                    }}
                />
            ))}

            <AdminSidebarItem
                id="threads"
                icon={isThreadBarExpanded ? threadsExpandedIcon : threadsIcon}
                name="Threads"
                isExpanded={isExpanded}
                path={THREAD_PAGE_PREFIX}
                onClick={() => {
                    setIsThreadBarExpanded((prev) => !prev);
                    // Do NOT set isExpanded to false here, let sidebar stay open
                }}
            />

            {isExpanded && isThreadBarExpanded && (
                <div className="relative flex h-[55vh] grow flex-col border-t-2 border-gray-200 pt-3">
                    <div ref={threadListRef} className="scrollbar-hide flex grow flex-col space-y-2 overflow-y-auto">
                        <AdminSidebarItem
                            id="new-thread"
                            icon={newChatIcon}
                            name="New Thread"
                            isExpanded={isExpanded}
                            path={THREAD_PAGE_PREFIX}
                            onClick={() => {
                                setThreadId("new");
                                setIsThreadBarExpanded(true);
                                setTimeout(() => {
                                    router.push(`${THREAD_PAGE_PREFIX}/new`);
                                }, 500);
                            }}
                        />
                        {thread_list.map((item, index) => (
                            <ThreadSidebarItem
                                id={item.thread_id}
                                key={index}
                                icon={existingChatIcon}
                                name={item.description}
                                isExpanded={isExpanded}
                                path={`${THREAD_PAGE_PREFIX}/${item.thread_id}`}
                                isSettingsActive={activeSettingsMenu === item.thread_id}
                                onSettingsClick={(e) => {
                                    e.stopPropagation();
                                    setActiveSettingsMenu(activeSettingsMenu === item.thread_id ? null : item.thread_id);
                                }}
                                onEdit={() => handleEditThread(item.thread_id)}
                                onDelete={() => handleDeleteThread(item.thread_id)}
                                onClick={() => {
                                    setThreadId(item.thread_id);
                                    setIsThreadBarExpanded(true);
                                    router.push(`${THREAD_PAGE_PREFIX}/${item.thread_id}`);
                                    // Scroll to the selected thread after navigation
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {isExpanded && (
                <div className="absolute bottom-0 w-full">
                    <UserInformationCard />
                </div>
            )}
        </aside>
    );
};

interface SidebarItemProps {
    id: string;
    icon: IconType;
    name: string;
    path: string;
    isExpanded: boolean;
    onClick: () => void;
}

function AdminSidebarItem({ id, icon: Icon, name, path, isExpanded, onClick }: SidebarItemProps) {
    const { threadId, threadPage } = useFigAgent();
    const isThreadActive = threadId === id;
    const isActive = window.location.pathname === path || (isThreadActive && `/admin/${threadPage}` === path);

    return (
        <div
            id={id}
            onClick={onClick}
            className={`${barlow.className} flex flex-row items-center ${isExpanded ? "" : "justify-center"} mx-1 space-x-1 rounded px-2 py-3.5 transition-colors duration-800 ease-in-out ${isActive || isThreadActive ? "bg-[#343434] text-white shadow-md" : "text-gray-700 hover:bg-[#d8d8d8]"}`}
        >
            <div className="size-5">
                <Icon color={`${isActive || isThreadActive ? "#fff" : "#343434"}`} fontSize={20} />
            </div>
            <div
                className={`transform overflow-hidden text-sm text-ellipsis whitespace-nowrap transition-all duration-500 ease-in-out ${isExpanded ? "ml-2 max-w-[120px] opacity-100" : "ml-0 max-w-0 opacity-0"}`}
                style={{ pointerEvents: isExpanded ? "auto" : "none" }}
            >
                {name}
            </div>
        </div>
    );
}

interface ThreadSidebarItemProps {
    id: string;
    icon: IconType;
    name: string;
    path: string;
    isExpanded: boolean;
    isSettingsActive: boolean;
    onClick: () => void;
    onSettingsClick: (e: React.MouseEvent) => void;
    onEdit: () => void;
    onDelete: () => void;
}

function ThreadSidebarItem({
    id,
    icon: Icon,
    name,
    path,
    isExpanded,
    isSettingsActive,
    onClick,
    onSettingsClick,
    onEdit,
    onDelete
}: ThreadSidebarItemProps) {
    const { threadId, threadPage } = useFigAgent();
    const isThreadActive = threadId === id;
    const isActive = window.location.pathname === path || (isThreadActive && `/admin/${threadPage}` === path);

    return (
        <div className="relative">
            <div
                id={id}
                onClick={onClick}
                className={`${barlow.className} group flex flex-row items-center ${isExpanded ? "" : "justify-center"} mx-1 space-x-1 rounded px-2 py-3.5 transition-colors duration-800 ease-in-out ${isActive || isThreadActive ? "bg-[#343434] text-white shadow-md" : "text-gray-700 hover:bg-[#d8d8d8]"}`}
            >
                <div className="size-5">
                    <Icon color={`${isActive || isThreadActive ? "#fff" : "#343434"}`} fontSize={20} />
                </div>
                <div
                    className={`transform overflow-hidden text-sm text-ellipsis whitespace-nowrap transition-all duration-500 ease-in-out ${isExpanded ? "ml-2 max-w-[140px] opacity-100" : "ml-0 max-w-0 opacity-0"}`}
                    style={{ pointerEvents: isExpanded ? "auto" : "none" }}
                >
                    {name}
                </div>
                {isExpanded && (
                    <div
                        className={`settings-trigger ml-auto rounded p-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-gray-500/20 ${isSettingsActive ? "opacity-100" : ""}`}
                        onClick={onSettingsClick}
                    >
                        <BsThreeDotsVertical size={12} color={`${isActive || isThreadActive ? "#fff" : "#343434"}`} />
                    </div>
                )}
            </div>

            {isSettingsActive && isExpanded && (
                <div className="settings-menu absolute top-full right-1 z-50 mt-1 w-32 rounded border border-gray-200 bg-white shadow-lg">
                    <div className="py-1">
                        <button onClick={onEdit} className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <MdEdit className="mr-2 h-4 w-4" />
                            Edit
                        </button>
                        <button onClick={onDelete} className="flex w-full items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                            <MdDelete className="mr-2 h-4 w-4" />
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
