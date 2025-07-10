import { adminState, setAdminFlagStatus, setChatLayout, setOpenChat, setThread, setThreadId, setThreadPage } from "@redux/slices";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { AdminFlowAgentState, LayoutType } from "@types";
import { fetchAdminThreads } from "@redux/actions";
import { LOADING } from "@constants";

export const useFigAgent = () => {
    const dispatch = useAppDispatch();
    const store = useAppSelector(adminState);
    return {
        ...store,
        setOpenChat: (open: boolean) => {
            dispatch(setOpenChat(open));
        },
        setThreadPage: (threadPage: string) => {
            dispatch(setThreadPage(threadPage));
        },
        setAdminFlagStatus: (status: any) => {
            dispatch(setAdminFlagStatus(status));
        },
        setThreadId: (threadId: string | undefined) => {
            dispatch(setThreadId(threadId));
        },
        setChatLayout: (layout: LayoutType) => {
            dispatch(setChatLayout(layout));
        },
        fetchThreads: () => {
            if (store.thread_list_status === LOADING) return;
            dispatch(fetchAdminThreads());
        },
        setThread: (data: AdminFlowAgentState) => {
            dispatch(setThread(data));
        }
    };
};
