import React from "react";

const DashboardIcon: React.FC<{ size?: number | string; color?: string }> = ({ size = 20, color = "#646464" }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M4.66667 1.33334H11.3333M3.33333 4H12.6667M3.33333 6.66667H12.6667C13.403 6.66667 14 7.26362 14 8V13.3333C14 14.0697 13.403 14.6667 12.6667 14.6667H3.33333C2.59695 14.6667 2 14.0697 2 13.3333V8C2 7.26362 2.59695 6.66667 3.33333 6.66667Z"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default DashboardIcon;
