import { MdOutlineDragIndicator } from "react-icons/md";
import React, { useState } from "react";

import { InsightCard, Spinner } from "@atoms";
import { ActionModal } from "@molecules";
import { TileLayoutProps } from "@types";

export const TileLayout: React.FC<TileLayoutProps> = ({ label, children, loading = true, printInsightBefore, insight, onRefine, onAnalyze }) => {
    const [isRefineModalOpen, setIsRefineModalOpen] = useState(false);
    const [isAnalyzeModalOpen, setIsAnalyzeModalOpen] = useState(false);

    return (
        <div className="card group relative flex h-full grow cursor-pointer rounded-md border border-slate-200 bg-slate-50/30 p-3 shadow select-none hover:bg-slate-50 hover:shadow-md">
            <div className="flex w-full flex-col">
                <div className="relative flex w-full flex-row items-center justify-between">
                    <label className="text-color-label mb-2 text-base font-semibold">{label}</label>
                    {/* <div className="absolute right-0 flex flex-row items-center space-x-2 opacity-0 transition delay-300 duration-100 ease-in-out group-hover:opacity-100">
                        <Button label="Refine" variant="primary" onClick={() => setIsRefineModalOpen(true)} />
                        <Button label="Analyze" variant="primary" onClick={() => setIsAnalyzeModalOpen(true)} />
                    </div> */}
                </div>
                {loading ? (
                    <Spinner />
                ) : (
                    <div className="flex h-full flex-col justify-between">
                        {printInsightBefore && <InsightCard insight={insight} />}
                        {children}
                        {!printInsightBefore && <InsightCard insight={insight} />}
                    </div>
                )}
            </div>

            {/* Refine Modal */}
            <ActionModal isOpen={isRefineModalOpen} onClose={() => setIsRefineModalOpen(false)} title={`Refine ${label}`} onSubmit={onRefine} />
            {/* Analyze Modal */}
            <ActionModal isOpen={isAnalyzeModalOpen} onClose={() => setIsAnalyzeModalOpen(false)} title={`Analyze ${label}`} onSubmit={onAnalyze} />

            <MdOutlineDragIndicator className="text-color-700 absolute right-0 bottom-0 rotate-45" />
        </div>
    );
};
