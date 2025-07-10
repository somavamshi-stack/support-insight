import styles from "./ActionModal.module.css";
import { Button } from "@atoms";
import React from "react";

export interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = "OK",
    cancelLabel = "Cancel"
}) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2 className="mb-2 text-lg font-semibold">{title}</h2>
                <p className="mb-4 text-sm text-gray-700">{message}</p>
                <div className={styles.actions}>
                    <Button label={cancelLabel} onClick={onClose} className="bg-[#AE3020]" />
                    <Button
                        label={confirmLabel}
                        variant="primary"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
