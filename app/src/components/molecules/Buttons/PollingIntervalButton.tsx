import { dashboardState, setPollingInterval } from "@redux/slices";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { CustomSelect, RefreshButton } from "@atoms";
import { usePrevious } from "@hooks";

export const PollingIntervalButton = () => {
    const dispatch = useAppDispatch();

    const { pollingInterval } = useAppSelector(dashboardState);
    const previousInterval = usePrevious(pollingInterval);

    const handlePollingIntervalChange = ({ value }) => {
        dispatch(setPollingInterval(value));
    };

    const handleRefresh = () => {
        dispatch(setPollingInterval(pollingInterval === "off" ? 10000 : "off"));
        setTimeout(() => {
            dispatch(setPollingInterval(previousInterval));
        }, 50);
    };
    return (
        <div className="inline-flex items-center">
            <RefreshButton id="poll-interval" onClick={handleRefresh} />
            <CustomSelect id="poll-interval" options={POLLING_INTERVALS} value={pollingInterval} onChange={handlePollingIntervalChange} />
        </div>
    );
};

const POLLING_INTERVALS = Object.freeze([
    { label: "Off", value: "off" },
    { label: "10s", value: 10_000 },
    { label: "30s", value: 30_000 },
    { label: "1m", value: 60_000 }
]);
