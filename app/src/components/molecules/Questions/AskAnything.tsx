import { FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";

import { dashboardState, setFlagStatus } from "@redux/slices";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { createTopic } from "@redux/actions";
import { IDLE, SUCCESS } from "@constants";
import { Centered } from "@atoms";

export const AskAnything = ({ userId, className = "", title = "", placeholder = "" }) => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { topic_create_status, topic_create_response } = useAppSelector(dashboardState);

    const [inputValue, setInputValue] = useState<string>("");

    const onSubmit = () => {
        dispatch(createTopic({ user_id: userId, topic_description: inputValue }));
    };

    useEffect(() => {
        if (topic_create_status === SUCCESS && !isEmpty(topic_create_response)) {
            dispatch(setFlagStatus({ topic_create_status: IDLE }));
            setTimeout(() => {
                router.push(`/c/${topic_create_response.topic_id}`, undefined, { shallow: true });
            }, 1000);
        }
    }, [topic_create_status, topic_create_response, router, dispatch]);

    const canSubmit = !isEmpty(inputValue);
    return (
        <Centered>
            <div className={`my-5 flex w-[40%] flex-col items-center justify-center space-y-2 ${className}`}>
                {!isEmpty(title) && <span className="text-color-label font-regular font-display text-3xl md:text-4xl">{title}</span>}
                <div className="relative flex w-full flex-col rounded-3xl border border-slate-300 p-3 shadow-lg">
                    <textarea
                        id="aksme-anything-input"
                        placeholder={placeholder}
                        className={`selection:bg-superDuper selection:text-textMain bg-background text-textMain placeholder-textOff scrollbar-thumb-idle scrollbar-thin scrollbar-track-transparent mx-2 ${isEmpty(title) ? "min-h-[15vh] sm:min-h-[10vh] lg:min-h-[5vh]" : "min-h-[20vh] sm:min-h-[15vh] lg:min-h-[10vh]"} w-full resize-none overflow-auto font-sans caret-slate-400 outline-none placeholder:select-none`}
                        autoComplete="off"
                        data-1p-ignore="true"
                        defaultValue={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <div className="absolute right-1.5 bottom-1.5 inline-flex justify-end">
                        <button
                            id="askme-submit-btn"
                            disabled={!canSubmit}
                            onClick={onSubmit}
                            className={`inline-flex size-10 cursor-pointer items-center justify-center rounded-full border ${canSubmit ? "bg-color-300 hover:bg-color-400" : "hover:bg-color-50 bg-slate-50"}`}
                        >
                            <FaArrowRight />
                        </button>
                    </div>
                </div>
            </div>
        </Centered>
    );
};
