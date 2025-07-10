import React from "react";

const threadsIcon: React.FC<{ size?: number | string; color?: string }> = ({ size = 20, color = "#646464" }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.52632 8.5L1 1L17 8.5M3.52632 8.5L1 16L17 8.5M3.52632 8.5H17" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default threadsIcon;
