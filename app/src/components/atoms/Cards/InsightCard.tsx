import isEmpty from "lodash/isEmpty";

import { SlowTextRenderer } from "../Text/SlowTextRenderer";

export const InsightCard = ({ insight }) => {
    if (isEmpty(insight)) return <></>;
    return (
        <div className="card hidden w-full rounded-md border-l-2 border-slate-300 bg-slate-100 p-1 px-2 group-hover:border-l-4 sm:block">
            <strong className="text-sm">Actionable Insight:</strong>
            <SlowTextRenderer text={insight} />
        </div>
    );
};
