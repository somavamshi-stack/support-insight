import React, { useState } from "react";

import { Button, TextArea } from "@atoms";

interface QuestionInputProps {
    onSubmit: (question: string) => void;
}

const QuestionInput: React.FC<QuestionInputProps> = ({ onSubmit }) => {
    const [inputValue, setInputValue] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = () => {
        if (inputValue.trim().length > 0) {
            onSubmit(inputValue);
            setInputValue("");
        }
    };

    return (
        <div className="flex w-full flex-row flex-wrap items-center justify-center space-x-2">
            <TextArea
                placeholder="Ask your question."
                value={inputValue}
                onChange={handleChange}
                rows={3} // start with 3 lines tall
                className="text-color-label hover:ring-color-500 focus:border-color-600 focus:ring-color-500 block w-[40vw] rounded-xs border border-slate-300 px-1.5 py-1 placeholder-gray-300 caret-slate-300 focus:outline-hidden"
            />
            <Button label=">" onClick={handleSubmit} variant="primary" style={{ minWidth: "3rem", height: "3rem" }} />
        </div>
    );
};

export default QuestionInput;
