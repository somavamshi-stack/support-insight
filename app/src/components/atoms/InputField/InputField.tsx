import { barlow } from "../../../assets/fonts/barlow";
import React, { InputHTMLAttributes } from "react";
import styles from "./InputField.module.css";
// import { Search } from "lucide-react";

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    enabled?: boolean;
    description?: string;
    isError?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({ label, enabled = true, description, isError, ...rest }) => {
    return (
        <div className={styles.wrapper}>
            {label && <label className={styles.label}>{label}</label>}
            <div className="flex w-full items-center gap-2">
                <input
                    disabled={!enabled}
                    type="text"
                    className={`${barlow.className} flex-grow rounded border border-[#E4E4E7] px-4 py-2 text-sm placeholder-gray-400 hover:border-2 hover:border-[#e4e4e4] focus:outline-none ${
                        enabled ? "bg-white" : "bg-gray-100"
                    } ${isError ? "focus:border-red-500 focus:ring-1 focus:ring-red-500" : "focus:border-[#343434] focus:border-2 focus:ring-1 focus:ring-[#fff]"}`}
                    placeholder={description}
                    {...rest}
                />
            </div>
        </div>
    );
};
