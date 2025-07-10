import { Grid } from "react-loader-spinner";

interface GridSpinnerProps {
    height?: number;
    width?: number;
    radius?: number;
    color?: string;
    ariaLabel?: string;
}

export function GridSpinner({ height = 32, width = 32, radius = 12.5, color = "#343434", ariaLabel = "loading" }: GridSpinnerProps) {
    return (
        <div>
            <Grid
                visible={true}
                height={height}
                width={width}
                color={color}
                ariaLabel={ariaLabel}
                radius={radius}
                wrapperStyle={{}}
                wrapperClass="grid-wrapper"
            />
        </div>
    );
}
