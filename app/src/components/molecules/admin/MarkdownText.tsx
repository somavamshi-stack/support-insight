"use client";

import { MarkdownSpec } from "types/text.types";
import { useAppSelector } from "@redux/hooks";
import ReactMarkdown from "react-markdown";
import { adminState } from "@redux/slices";
import remarkGfm from "remark-gfm";

interface MarkdownBlockProps {
    markdown: MarkdownSpec;
    handleMarkdownClick?: (spec: MarkdownSpec) => void;
    heightLimit: string;
}

export function MarkdownBlock({ markdown, handleMarkdownClick, heightLimit }: MarkdownBlockProps) {
    const { selectedDashboardTexts } = useAppSelector(adminState);

    return (
        <div
            className={`w-full flex-1 basis-[300px] rounded-md bg-white p-6 shadow hover:shadow-md ${
                handleMarkdownClick && selectedDashboardTexts.some((text) => text.id === markdown.id) ? "rounded outline-2 outline-[#343434]" : ""
            } ${handleMarkdownClick ? "cursor-pointer" : ""}`}
            onClick={handleMarkdownClick ? () => handleMarkdownClick(markdown) : undefined}
        >
            {markdown.title && <h4 className="mb-1 text-xl font-semibold">{markdown.title}</h4>}
            <div className={`relative w-full overflow-auto ${heightLimit ? heightLimit : "h-auto"}`}>
                <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: (props) => <h1 className="my-1.5 text-xl font-bold text-black" {...props} />,
                            h2: (props) => <h2 className="my-1.5 text-lg font-semibold" {...props} />,
                            p: (props) => <p className="text-sm" {...props} />,
                            ul: (props) => <ul className="list-disc pl-10" {...props} />,
                            ol: (props) => <ol className="list-decimal pl-10" {...props} />,
                            code: (props) => (
                                <pre className="overflow-x-auto rounded bg-gray-100 p-2">
                                    <code {...props} />
                                </pre>
                            )
                        }}
                    >
                        {markdown.content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
}
