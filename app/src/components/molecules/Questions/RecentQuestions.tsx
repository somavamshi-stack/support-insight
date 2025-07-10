import React from "react";

interface RecentQuestionsProps {
    questions: any[];
    onClickQuestion?: (question: string) => void;
}

const RecentQuestions: React.FC<RecentQuestionsProps> = ({ questions, onClickQuestion }) => {
    return (
        <div className="my-5 flex w-[30%] flex-col">
            <h3 className="text-color-label text-2xl">Recently asked</h3>
            <div className="flex flex-col gap-y-3">
                {questions.slice(0, 3).map((q, index) => (
                    <button
                        key={index}
                        className="cursor-pointer rounded-md border bg-white p-2 shadow hover:bg-slate-50 hover:shadow-2xl"
                        onClick={() => onClickQuestion?.(q.topic_id)}
                    >
                        {q.topic_description}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default RecentQuestions;
