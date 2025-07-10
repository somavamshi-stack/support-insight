import React from "react";

import { IconRenderer } from "@molecules";

export const LabelRenderer = React.memo(({ label, fontSize, description, ...props }: any) => {
    return (
        <div className="text-color-label mt-1 mr-0.5 flex flex-row items-center justify-between text-xs font-medium select-none">
            <div className="inline-flex items-center space-x-0.5">
                <label style={{ fontSize: fontSize !== undefined ? fontSize : "12px" }}>{label}</label>
                {showAsRequired(props) && <label className="items-center text-red-600">*</label>}
            </div>
            <div className="inline-flex items-center">
                {description && (
                    <IconRenderer icon="HelpOutlined" fontSize="10px" className="text-color-0600 ml-1 cursor-pointer" tooltip={description} />
                )}
                {props.onActionClick && (
                    <IconRenderer
                        icon={props.actionIcon}
                        fontSize="10px"
                        className="text-color-0600 mr-2 ml-1 cursor-pointer"
                        tooltip={props.actionTooltip}
                        onClick={props.onActionClick}
                    />
                )}
            </div>
        </div>
    );
});

function showAsRequired(props) {
    return props?.required && !props?.config?.hideRequiredAsterisk;
}
