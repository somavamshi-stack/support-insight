import { usePopperTooltip } from "@hooks";
import { useState } from "react";

export const Tooltip = ({ placement, title, content, children, backgroundColor }: any) => {
    const [controlledVisible, setControlledVisible] = useState(false);
    const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip({
        placement,
        trigger: "hover",
        closeOnOutsideClick: false,
        visible: controlledVisible,
        onVisibleChange: setControlledVisible
    });

    if (title === undefined && content === undefined) {
        return <>{children}</>;
    }

    const toolProps: any = { className: "tooltip-container px-2" };
    if (backgroundColor) {
        toolProps.style = { color: "#262640", backgroundColor };
    }

    return (
        <>
            <div ref={setTriggerRef}>{children}</div>
            {visible && (
                <div ref={setTooltipRef} {...getTooltipProps(toolProps)}>
                    {title && <div className={`text-xs ${content === undefined ? "leading-4" : "font-semibold"} break-words`}>{title}</div>}
                    {content && <div className="mt-2 text-xs leading-4 break-words">{content}</div>}
                    <div {...getArrowProps({ className: "tooltip-arrow" })} />
                </div>
            )}
        </>
    );
};
