import React from "react";

const TrashIcon: React.FC<{ size?: number | string; color?: string }> = ({ size = 24, color = "white" }) => (
    <svg width={size} height={size} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M3 6.5H21M19 6.5V20.5C19 21.5 18 22.5 17 22.5H7C6 22.5 5 21.5 5 20.5V6.5M8 6.5V4.5C8 3.5 9 2.5 10 2.5H14C15 2.5 16 3.5 16 4.5V6.5M10 11.5V17.5M14 11.5V17.5"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default TrashIcon;
