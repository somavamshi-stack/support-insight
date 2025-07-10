import React, { TextareaHTMLAttributes } from "react";
import styles from "./TextArea.module.css";

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, ...rest }) => {
    return (
        <div className={styles.wrapper}>
            {label && <label className={styles.label}>{label}</label>}
            {/* Here we use a <textarea> instead of <input> to allow multi-line text */}
            <textarea className={styles.textArea} {...rest} />
        </div>
    );
};
