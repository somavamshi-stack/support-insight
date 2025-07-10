"use client";
import { CopilotKit, useCoAgent, useCopilotContext } from "@copilotkit/react-core";
import { CopilotChat, CopilotKitCSSProperties } from "@copilotkit/react-ui";
import { ADMIN_AGENT_NAME, THREAD_PAGE_PREFIX } from "@constants";
import { IoCloseSharp, IoSend } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { barlow } from "../../assets/fonts/barlow";
import { InlineLogTimeLine } from "@molecules";
import { AdminFlowAgentState } from "@types";
import { LuSparkles } from "react-icons/lu";
import CloseIcon from "../icons/closeIcon";
import "@copilotkit/react-ui/styles.css";
import ChatIcon from "../icons/newChat";
import { useRouter } from "next/router";
import { extractMetrics } from "@utils";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import { useFigAgent } from "@hooks";

// Custom UI Component that appears when button is clicked
const CustomAttachmentUI = ({ isOpen, onClose, onSelect }: { isOpen: boolean; onClose: () => void; onSelect: (option: any) => void }) => {
    if (!isOpen) return null;
    const { threadInfo } = useFigAgent();
    let metricOptions;
    if (threadInfo) metricOptions = extractMetrics(threadInfo, <LuSparkles size={16} />);

    return (
        <div className="mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
            <div className="p-2">
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Set monitoring for</span>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <IoCloseSharp size={16} />
                    </button>
                </div>
                <div className="space-y-1">
                    {metricOptions?.length > 0 ? (
                        metricOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => onSelect(option)}
                                className="flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm hover:bg-gray-100"
                            >
                                <span>{option.icon}</span>
                                <span>{option.label}</span>
                            </button>
                        ))
                    ) : (
                        <p className="text-center text-[0.625rem] font-light text-gray-100 italic">No KPIs available for monitoring</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Custom Input Component with additional button
const CustomChatInput = (props: any) => {
    const [message, setMessage] = useState("");
    const [showCustomUI, setShowCustomUI] = useState(false);

    const { onSubmitMessage, onSend, placeholder, disabled, value, onChange, onKeyDown, ...restProps } = props;

    const submitFunction = onSubmitMessage || onSend || props.onSubmit;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (message.trim() && submitFunction) {
            submitFunction(message);
            setMessage("");
        }
    };

    const handleCustomButtonClick = () => {
        setShowCustomUI(!showCustomUI);

        setTimeout(() => {
            const scrollableElement =
                document.querySelector('[data-testid="copilot-chat-container"]') ||
                document.querySelector(".copilot-kit-chat-container") ||
                document.querySelector('[class*="overflow-y-auto"]');

            if (scrollableElement) {
                scrollableElement.scrollTop = scrollableElement.scrollHeight;
            }

            let element = document.activeElement;
            while (element && element.parentElement) {
                element = element.parentElement;
                if (element.scrollHeight > element.clientHeight) {
                    element.scrollTop = element.scrollHeight;
                    break;
                }
            }
        }, 100);
    };

    const handleCustomUISelect = (option: any) => {
        setShowCustomUI(false);

        if (submitFunction) {
            submitFunction(option.id);
        } else {
            setMessage(option.id);
        }
    };

    return (
        <div className="ml-1">
            <form onSubmit={handleSubmit} className="flex items-start gap-1">
                <div className="flex flex-1 items-center rounded-lg border border-gray-300 bg-white">
                    <button
                        type="button"
                        onClick={handleCustomButtonClick}
                        className="mt-1 flex h-8 w-8 items-center justify-center text-gray-500 transition-colors hover:text-gray-700"
                        title="Quick Actions"
                    >
                        <LuSparkles size={16} />
                    </button>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={placeholder || "Type your message..."}
                        disabled={disabled}
                        rows={1}
                        className="min-w-0 flex-1 resize-none overflow-hidden border-none px-2 py-2 text-sm focus:ring-0 focus:outline-none sm:px-3"
                        style={{
                            minHeight: "2rem",
                            maxHeight: "7.5rem"
                        }}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = "auto";
                            target.style.height = Math.min(target.scrollHeight, 120) + "px";
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                    />
                    <button
                        type="submit"
                        disabled={disabled || !message.trim()}
                        className="mr-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded bg-[#343434] text-white transition-colors hover:bg-[#3c3c3c] disabled:cursor-default disabled:opacity-50"
                        title="Send message"
                    >
                        <IoSend size={14} color="white" />
                    </button>
                </div>
            </form>
            <CustomAttachmentUI isOpen={showCustomUI} onClose={() => setShowCustomUI(false)} onSelect={handleCustomUISelect} />
        </div>
    );
};

const ChatBoxContent = ({ isCollapsed, setIsCollapsed, onCollapseChange }) => {
    const router = useRouter();
    const lastSyncedState = useRef<AdminFlowAgentState | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

    const { threadId, setThreadId, setThread, threadInfo, fetchThreads } = useFigAgent();
    const { isLoading } = useCopilotContext();

    const {
        state,

        threadId: oid
    } = useCoAgent<AdminFlowAgentState>({
        name: ADMIN_AGENT_NAME,
        initialState: {
            threadId: isEmpty(threadId) || threadId === "new" ? undefined : threadId
        }
    });

    const scrollToBottom = (force = false) => {
        if (!force && !shouldAutoScroll) return;

        setTimeout(() => {
            // Strategy 1: Use our specific refs
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                return;
            }

            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                return;
            }

            // Strategy 2: Find CopilotKit specific containers
            const copilotMessagesContainer = document.querySelector(".copilot-kit-messages");
            if (copilotMessagesContainer && copilotMessagesContainer.scrollHeight > copilotMessagesContainer.clientHeight) {
                copilotMessagesContainer.scrollTop = copilotMessagesContainer.scrollHeight;
                return;
            }

            // Strategy 3: Find any scrollable container within our chat
            const chatContainer = document.querySelector(".copilot-chat-container");
            if (chatContainer) {
                const scrollableElements = chatContainer.querySelectorAll('[class*="overflow"], [class*="scroll"]');
                for (let element of scrollableElements) {
                    if (element.scrollHeight > element.clientHeight) {
                        element.scrollTop = element.scrollHeight;
                        return;
                    }
                }
            }

            // Strategy 4: Fallback - find any scrollable element in the document
            const allScrollable = document.querySelectorAll("*");
            for (let element of allScrollable) {
                if (element.scrollHeight > element.clientHeight + 10) {
                    const computedStyle = window.getComputedStyle(element);
                    if (computedStyle.overflowY === "auto" || computedStyle.overflowY === "scroll") {
                        element.scrollTop = element.scrollHeight;
                        break;
                    }
                }
            }
        }, 50);
    };

    const handleScroll = (e: Event) => {
        const target = e.target as HTMLElement;
        if (target && target.scrollHeight && target.clientHeight) {
            const { scrollTop, scrollHeight, clientHeight } = target;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
            setShouldAutoScroll(isNearBottom);
        }
    };

    useEffect(() => {
        const setupScrollListeners = () => {
            document.removeEventListener("scroll", handleScroll, true);
            document.addEventListener("scroll", handleScroll, true);

            setTimeout(() => {
                const containers = [
                    chatContainerRef.current,
                    scrollRef.current,
                    document.querySelector(".copilot-kit-messages"),
                    document.querySelector('.copilot-chat-container [class*="overflow"]')
                ].filter(Boolean);

                containers.forEach((container) => {
                    if (container) {
                        container.addEventListener("scroll", handleScroll);
                    }
                });
            }, 100);

            return () => {
                document.removeEventListener("scroll", handleScroll, true);
                const containers = [
                    chatContainerRef.current,
                    scrollRef.current,
                    document.querySelector(".copilot-kit-messages"),
                    document.querySelector('.copilot-chat-container [class*="overflow"]')
                ].filter(Boolean);

                containers.forEach((container) => {
                    if (container) {
                        container.removeEventListener("scroll", handleScroll);
                    }
                });
            };
        };

        const timer = setTimeout(setupScrollListeners, 200);
        return () => {
            clearTimeout(timer);
            document.removeEventListener("scroll", handleScroll, true);
        };
    }, []);

    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            const mutationObserver = new MutationObserver((mutations) => {
                const hasNewContent = mutations.some((mutation) => mutation.type === "childList" && mutation.addedNodes.length > 0);

                if (hasNewContent) {
                    scrollToBottom();
                }
            });

            mutationObserver.observe(chatContainer, {
                childList: true,
                subtree: true
            });

            return () => {
                mutationObserver.disconnect();
            };
        }
    }, []);

    useEffect(() => {
        onCollapseChange(isCollapsed);
    }, [isCollapsed, onCollapseChange]);

    useEffect(() => {
        if (!isLoading && state) {
            const isDifferentFromThreadInfo = !isEqual(threadInfo, state);
            const isDifferentFromLastSync = !isEqual(lastSyncedState.current, state);
            const stateHasContent = state && Object.keys(state).length > 0;

            if (isDifferentFromThreadInfo && isDifferentFromLastSync && stateHasContent) {
                lastSyncedState.current = state;

                setThread({
                    kg: { nodes: [], edges: [] },
                    logs: [],
                    topics: [],
                    messages: [],
                    charts: [],
                    texts: [],
                    executionId: undefined,
                    threadId: undefined
                });

                setTimeout(() => {
                    setThread(state);
                    setTimeout(() => scrollToBottom(true), 200);
                }, 10);
            }
        }
    }, [isLoading, state, threadInfo, setThread]);

    useEffect(() => {
        if (!isLoading && isEmpty(threadId) && oid) {
            localStorage.removeItem("splitPos");
            setThreadId(oid);
            fetchThreads();
            setTimeout(() => {
                router.replace(`${THREAD_PAGE_PREFIX}/${oid}`, "", { shallow: true, scroll: true });
            }, 1000);
        }
    }, [isLoading, threadId, oid, fetchThreads, router, setThreadId]);

    useEffect(() => {
        scrollToBottom();
    }, [state, threadInfo]);

    if (isCollapsed) {
        return (
            <div
                className={`${barlow.className} group fixed top-0 right-0 z-10 flex h-full w-10 cursor-pointer flex-col items-center justify-center bg-[#FAFAFA] transition-colors duration-200 hover:bg-[#e4e4e4]`}
                onClick={() => setIsCollapsed(false)}
            >
                <div className="-rotate-90 transform text-xs whitespace-nowrap text-gray-600 select-none">Chat</div>
                <div className="mt-2 text-gray-600 group-hover:text-gray-800">
                    <ChatIcon size={16} />
                </div>
                <div className="absolute left-full z-50 ml-2 rounded bg-black px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    Click to expand chat
                </div>
            </div>
        );
    }

    return (
        <div className={`${barlow.className} flex h-full w-full flex-col bg-white transition-all duration-300 ease-in-out`}>
            {/* Header - Fixed at top */}
            <div className={`${barlow.className} z-40 flex flex-shrink-0 items-center justify-between border-b-2 bg-white px-2 py-1`}>
                <div className="flex items-center gap-2">
                    <span className="text-black">
                        <ChatIcon size={28} />
                    </span>
                    <span className={`${barlow.className} font-semibold tracking-wide text-black`}>Fig CoAgent</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsCollapsed(true)}
                        className="flex h-8 w-8 items-center justify-center rounded-md bg-[#AE3020] text-white transition-colors hover:bg-[#F8513C]"
                        title="Minimize chat"
                    >
                        <CloseIcon />
                    </button>
                </div>
            </div>

            <div className={`${barlow.className} flex min-h-0 flex-1 flex-col`} ref={scrollRef}>
                <div
                    ref={chatContainerRef}
                    style={
                        {
                            "--copilot-kit-background-color": "transparent",
                            "--copilot-kit-primary-color": "#F2F2F2",
                            "--copilot-kit-separator-color": "#d3d3d3",
                            "--copilot-kit-font-family": `${barlow.style.fontFamily}, sans-serif`,
                            "--barlow-font-family": barlow.style.fontFamily
                        } as CopilotKitCSSProperties & { "--barlow-font-family": string }
                    }
                    className={`${barlow.className} copilot-chat-container flex flex-1 flex-col overflow-y-auto`}
                >
                    <InlineLogTimeLine threadId={threadId} />
                    <CopilotChat
                        labels={{
                            initial: "Hello! How can I help you today?",
                            title: "FIG Agent",
                            placeholder: "Ask me anything!",
                            stopGenerating: "Stop",
                            regenerateResponse: "Regenerate"
                        }}
                        Input={CustomChatInput}
                    />
                    {(!state || isLoading) && <p className={`${barlow.className} mt-4 text-center text-base text-gray-700`}>Loading...</p>}
                </div>
            </div>
        </div>
    );
};

export const ChatBox = ({ threadId, onCollapseChange }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        onCollapseChange?.(isCollapsed);
    }, [isCollapsed, onCollapseChange]);

    return (
        <div className={`${barlow.className} ${isCollapsed ? "w-10" : "w-full"} h-full transition-all duration-300 ease-in-out`}>
            <CopilotKit
                runtimeUrl="/api/copilotkit"
                agent={ADMIN_AGENT_NAME}
                threadId={isEmpty(threadId) || threadId === "new" ? "" : threadId}
                key={threadId ?? "__new__"}
                showDevConsole={false}
                credentials="include"
            >
                <ChatBoxContent isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} onCollapseChange={onCollapseChange} />
            </CopilotKit>
        </div>
    );
};
