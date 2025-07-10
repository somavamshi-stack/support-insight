"use client";

import { adminState, setSelectedDashboardText } from "@redux/slices";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { MarkdownSpec } from "types/text.types";
import { MarkdownBlock } from "@molecules";
import { TextSpec } from "@types";

interface TextContainerProps {
    text: TextSpec[];
    heightLimit: string;
}

export function TextContainer({ text, heightLimit }: TextContainerProps) {
    const dispatch = useAppDispatch();
    const { selectedDashboardTexts } = useAppSelector(adminState);

    const handleTextClick = (spec: MarkdownSpec) => {
        const isSelected = selectedDashboardTexts.some((text) => text.text_id === spec.id);

        const updatedTexts = isSelected
            ? selectedDashboardTexts.filter((text) => text.text_id !== spec.id)
            : [...selectedDashboardTexts, { ...spec, text_id: spec.id }];

        dispatch(setSelectedDashboardText(updatedTexts));
    };

    return (
        <div className={`relative inset-0 z-50 h-full w-full overflow-auto rounded border bg-white p-4 text-sm transition-all`}>
            <div className={`grid grid-cols-1 gap-4`}>
                {text?.map((item, index) => {
                    return (
                        <MarkdownBlock
                            key={item?.text_id || index}
                            markdown={{ id: item?.text_id, content: item?.content, title: item?.title }}
                            handleMarkdownClick={handleTextClick}
                            heightLimit={heightLimit}
                        />
                    );
                })}
            </div>
        </div>
    );
}
