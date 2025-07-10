import isEmpty from "lodash/isEmpty";

import { InlineSpinner } from "../Spinners";

interface NewLineTextProp {
    text?: string;
    showSpinner?: boolean;
}

export const NewLineText = ({ text, showSpinner }: NewLineTextProp) => {
    let child: any = null;
    if (!isEmpty(text)) {
        const lines = text?.split("\n") || [];
        child = lines.map((str, i) => (
            <div key={i} className="mb-1 min-h-1 text-xs">
                {str}
                {i === lines.length - 1 && showSpinner && <InlineSpinner className="ml-2" />}
            </div>
        ));
    }
    return <>{child}</>;
};
