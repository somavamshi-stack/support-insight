import { Tooltip } from "@molecules";

export const IconRenderer = ({ tooltip, description, icon, ...props }: any) => (
    <Tooltip title={tooltip} content={description}>
        {icon}
    </Tooltip>
);
