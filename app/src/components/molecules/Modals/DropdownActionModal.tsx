import { Button, SmoothDropdown } from "@atoms";
import styles from "./ActionModal.module.css";
import React, { useState } from "react";

interface DropdownActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    options: { label: string; value: string }[];
    onSubmit: (selectedOption: { label: string; value: string }) => void;
    submitLabel?: string;
    cancelLabel?: string;
}

export const DropdownActionModal: React.FC<DropdownActionModalProps> = ({
    isOpen,
    onClose,
    title,
    options,
    onSubmit,
    submitLabel = "Submit",
    cancelLabel = "Cancel"
}) => {
    const [selectedOption, setSelectedOption] = useState<{ label: string; value: string } | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (selectedOption) {
            onSubmit(selectedOption);
            setSelectedOption(null);
            onClose();
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleOptionSelect = (option: { label: string; value: string }) => {
        setSelectedOption(option);
        setIsDropdownOpen(false);
    };

    const handleClose = () => {
        setSelectedOption(null);
        onClose();
    };

    return (
        <div className={styles.modalBackdrop} onClick={handleClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2 className="mb-2">{title}</h2>
                <SmoothDropdown options={options} onSelect={handleOptionSelect} label="Select a dashboard" selected={selectedOption?.label || ""} />

                <div className="mt-3 flex justify-end gap-3">
                    <Button label={cancelLabel} variant="secondary" onClick={onClose} />
                    <Button label={submitLabel} variant="primary" onClick={handleSubmit} />
                </div>
            </div>
        </div>
    );
};
