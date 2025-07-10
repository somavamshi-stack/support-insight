import React from "react";

import { ActionButtonProps } from "@types";
import { MdAddBox } from "react-icons/md";
import { Button } from "./Button";

export const AddDSButton: React.FC<ActionButtonProps> = ({ id, onClick }) => {
    return (
        <Button
            id={`${id ?? "btn"}-btn`}
            label="Add Datasource"
            icon={<MdAddBox />}
            variant="primary"
            onClick={onClick}
            style={{ display: "inline-flex", alignItems: "center" }}
        />
    );
};
