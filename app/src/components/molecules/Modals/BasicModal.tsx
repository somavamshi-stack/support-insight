import React, { ReactElement } from "react";
import styles from "./ActionModal.module.css";

export interface BasicModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string; // Made optional
    placeholder?: string;
    inputType?: "textArea" | "inputField";
    submitLabel?: string;
    modalContent: ReactElement;
}

export const BasicModal: React.FC<BasicModalProps> = ({ 
    isOpen, 
    onClose, 
    title, 
    modalContent 
}) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                {/* Only show title if it exists */}
                {title && <div className="mb-2 text-xl font-bold">{title}</div>}
                {/* Modal Content */}
                <div className="w-full h-full">{modalContent}</div>
            </div>
        </div>
    );
};