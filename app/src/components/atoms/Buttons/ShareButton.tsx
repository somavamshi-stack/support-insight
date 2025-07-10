import React from "react";

import { FaShareAlt } from "react-icons/fa";
import { ActionButtonProps } from "@types";
import { Button } from "./Button";

export const ShareButton: React.FC<ActionButtonProps> = ({ id, onClick }) => {
    return (
        <Button
            id={`${id ?? "btn"}-share-btn`}
            label="Share"
            icon={<FaShareAlt />}
            variant="primary"
            onClick={onClick}
            style={{ display: "inline-flex", alignItems: "center" }}
        />
    );
};
