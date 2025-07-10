import React from "react";

const threadsIcon: React.FC<{ size?: number | string; color?: string }> = ({ size = 20, color = "#646464" }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M14.6668 1.33337L10.0002 14.6667L7.3335 8.66671M14.6668 1.33337L1.3335 6.00004L7.3335 8.66671M14.6668 1.33337L7.3335 8.66671"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default threadsIcon;
