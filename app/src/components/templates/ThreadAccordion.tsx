import React, { useState } from "react";
import { Thread } from "@types";

type AccordionProps = {
    threadIds: Thread[];
};

export const ThreadAccordion: React.FC<AccordionProps> = ({ threadIds }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => setIsOpen(!isOpen);

    return (
        <div className="mx-auto w-full max-w-md rounded-lg border border-gray-300 shadow-md">
            <button
                onClick={toggleAccordion}
                className="flex w-full items-center justify-between rounded-t-lg bg-gray-100 px-4 py-3 transition-colors hover:bg-gray-200"
            >
                <span className="text-lg font-medium text-gray-800">Thread</span>
                <svg
                    className={`h-5 w-5 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="rounded-b-lg border-t border-gray-300 bg-white px-4 py-2">
                    <ul className="space-y-1">
                        {threadIds.map((thread) => (
                            <li key={thread.thread_id} className="rounded bg-gray-50 px-2 py-1 font-mono text-sm text-gray-700">
                                {thread.thread_id}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
