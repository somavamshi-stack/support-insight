import React from "react";

const CloseIcon: React.FC<{ size?: number | string; color?: string }> = ({ size = 20, color = "#ffffff" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24" // corrected viewBox
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12 12L21 21M12 12L3 21M12 12L21 3M12 12L3 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default CloseIcon;
