import { useCallback, useEffect, useRef, useState } from "react";
import isEmpty from "lodash/isEmpty";

import { NewLineText } from "./NewLineText";
import { InlineSpinner } from "@atoms";

interface SlowTextRendererProp {
    text: string;
    speed?: number;
    initialTime?: number;
    description?: string;
    onShowSpinner?: (val: boolean) => void;
    children?: any;
}

export const SlowTextRenderer = ({ text, speed = 40, onShowSpinner, initialTime = 0 }: SlowTextRendererProp) => {
    const [placeholder, setPlaceholder] = useState<string>("");
    const [showSpinner, setShowSpinner] = useState<boolean>(false);
    const index = useRef<number>(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const setSpinner = useCallback(
        (val: boolean) => {
            setShowSpinner(val);
            if (typeof onShowSpinner === "function") onShowSpinner(val);
        },
        [onShowSpinner]
    );

    useEffect(() => {
        if (speed > 0 && text != "") {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            index.current = 0;
            setPlaceholder("");
            setSpinner(true);

            const tokens = text.split("");

            const timeout = setTimeout(() => {
                if (speed === 1) {
                    setSpinner(false);
                    setPlaceholder(text);
                } else {
                    intervalRef.current = setInterval(() => {
                        if (index.current < tokens.length) {
                            const nextChar = tokens[index.current];
                            setPlaceholder((prev) => prev + nextChar);
                            index.current += 1;
                        } else {
                            setSpinner(false);
                            if (intervalRef.current) clearInterval(intervalRef.current);
                        }
                    }, speed);
                }
            }, initialTime);

            return () => {
                clearTimeout(timeout);
                if (intervalRef.current) clearInterval(intervalRef.current);
            };
        } else {
            setSpinner(false);
            setPlaceholder(text);
        }
    }, [speed, text, initialTime, setSpinner]);

    return <>{isEmpty(text) ? <InlineSpinner /> : <NewLineText text={placeholder} showSpinner={showSpinner} />}</>;
};
