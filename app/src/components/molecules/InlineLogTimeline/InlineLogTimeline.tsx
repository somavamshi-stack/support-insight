import { useCoAgent } from "@copilotkit/react-core";
import { ADMIN_AGENT_NAME } from "@constants";
import { AdminFlowAgentState } from "@types";
import { motion } from "framer-motion";
import { useRef } from "react";

/** Tiny fading‑dot spinner for steps in progress. */
function Spinner() {
    return (
        <motion.span className="inline-block w-3" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity }}>
            •••
        </motion.span>
    );
}

/** A single log line row: show spinner or checkmark, plus the text. */
function Row({ text, done }: { text: string; done?: boolean }) {
    return (
        <div className="flex items-start font-mono text-sm text-gray-700">
            <span className="mr-2">{done ? "✔" : <Spinner />}</span>
            <span>{text}</span>
        </div>
    );
}

export function InlineLogTimeLine({ threadId }: { threadId: string | undefined }) {
    const { state } = useCoAgent<AdminFlowAgentState>({
        name: ADMIN_AGENT_NAME,
        initialState: {
            threadId
        }
    });
    const lastExec = useRef<number | null>(null); // last executionId seen
    const startIndex = useRef<number>(0); // where this turn’s logs start
    const bubbleId = useRef<string>(crypto.randomUUID());

    // 1) If the user has started a new turn, reset the log pointer:
    if (state?.executionId !== undefined && state?.executionId !== lastExec.current) {
        lastExec.current = state?.executionId;
        startIndex.current = state?.logs?.length ?? 0;
        // Change bubble ID so it’s recognized as a “new partial message.”
        bubbleId.current = crypto.randomUUID();
    }

    // 2) Slice only the newly appended logs
    const logs = state?.logs ?? [];
    const newLogs = logs.slice(startIndex.current);

    // 3) Return your custom UI
    return (
        <div className="space-y-1">
            {newLogs.map((entry, i) => (
                <Row key={i} text={entry.message} done={entry.done} />
            ))}
        </div>
    );
}
