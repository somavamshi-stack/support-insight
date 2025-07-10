import { barlow } from "../../../assets/fonts/barlow";
import React, { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    icon?: React.ReactNode;
    variant?: "primary" | "secondary";
}

/**
 * Atomic button
 * - Could have multiple variants (primary, secondary, etc.)
 * - Keep minimal styling to highlight the core CTA
 */
export const Button: React.FC<ButtonProps> = ({ label, icon, variant = "primary", className = "", disabled, ...rest }) => {
    return (
        <button
            type="button"
            disabled={disabled}
            className={`${barlow.className} flex cursor-pointer justify-center gap-x-2 rounded-md border-[0.2px] bg-[#343434] px-3 py-1.5 pt-3 pr-4 pb-3 pl-4 text-center text-sm text-[#fff] shadow select-none hover:bg-[#646464] ${variant === "primary" ? "" : "bg-slate-50"} ${!disabled ? "" : ""} ${className}`}
            {...rest}
        >
            <div className="inline-flex items-center space-x-1">
                {icon}
                <span>{label}</span>
            </div>
        </button>
    );
};
