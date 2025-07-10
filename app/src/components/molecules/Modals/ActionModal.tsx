import React, { useState } from "react";

import { Button, InputField, TextArea } from "@atoms";
import styles from "./ActionModal.module.css";

export interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    onSubmit: (input: string) => void;
    placeholder?: string;
    inputType?: "textArea" | "inputField";
    submitLabel?: string;
}

export const ActionModal: React.FC<ActionModalProps> = ({
    isOpen,
    onClose,
    title,
    onSubmit,
    placeholder = "Enter your input here...",
    inputType = "textArea",
    submitLabel = "Submit"
}) => {
    const [inputValue, setInputValue] = useState("");

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (inputValue.trim()) {
            onSubmit(inputValue);
            setInputValue("");
            onClose();
        }
    };

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
            >
                <h2 className="mb-2">{title}</h2>
                {inputType === "textArea" ? (
                    <TextArea placeholder={placeholder} value={inputValue} onChange={(e) => setInputValue(e.target.value)} rows={3} />
                ) : (
                    <InputField
                        label=""
                        description="Recipient's email"
                        placeholder={placeholder}
                        type="input"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                )}
                <div className={styles.actions}>
                    <Button label="Cancel" variant="secondary" onClick={onClose} />
                    <Button label={submitLabel} variant="primary" onClick={handleSubmit} />
                </div>
            </div>
        </div>
    );
};
