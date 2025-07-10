import React, { ButtonHTMLAttributes, useState } from "react";
import { LuRefreshCcw } from "react-icons/lu";
import { Button } from "./Button";

interface RefreshButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary";
    onClick: () => void;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({ id, ...rest }) => {
    const [isLoading, setLoading] = useState<boolean>(false);
    return (
        <Button
            label="Refresh"
            id={`${id ?? "btn"}-refresh-btn`}
            icon={<LuRefreshCcw className={`${isLoading ? "animate-spin" : "animate-none"}`} />}
            {...rest}
            className="rounded-r-none"
            onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 1000);
                rest.onClick();
            }}
        />
    );
};
