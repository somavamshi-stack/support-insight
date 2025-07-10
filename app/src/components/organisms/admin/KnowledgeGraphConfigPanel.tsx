import { ChartContainer, ChartSqlPanel, KGPanel, TextContainer, TopicsPanel, Tabs } from "@molecules";
import { barlow } from "../../../assets/fonts/barlow";
import { useState, useEffect, useMemo } from "react";
import { Centered, GridSpinner } from "@atoms";
import { useFigAgent } from "@hooks";

import SaveDashboard from "pages/admin/dashboards/SaveDashboard";

export const KnowledgeGraphConfigPanel = () => {
    const { threadInfo } = useFigAgent();

    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
    const [chartTab, setChartTab] = useState<"sql" | "charts">("charts");
    const [showLoader, setShowLoader] = useState(true);

    // Memoized derived state to avoid recalculation
    const derivedState = useMemo(() => {
        const topics = Array.isArray(threadInfo?.topics) ? threadInfo.topics : [];
        const charts = Array.isArray(threadInfo?.charts) ? threadInfo.charts : [];
        const texts = Array.isArray(threadInfo?.texts) ? threadInfo.texts : [];
        const kgEdges = threadInfo?.kg?.edges?.length ?? 0;
        const kgNodes = threadInfo?.kg?.nodes?.length ?? 0;

        return {
            hasTopics: topics.length > 0,
            hasCharts: charts.length > 0,
            hasTexts: texts.length > 0,
            hasKnowledgeGraph: kgEdges > 0 || kgNodes > 0,
            hasDashboardContent: charts.length > 0 || texts.length > 0,
            topics,
            charts,
            texts
        };
    }, [threadInfo]);

    useEffect(() => {
        setShowLoader(true);

        const timer = setTimeout(() => {
            setShowLoader(false);
        }, 10000);

        if (derivedState.hasCharts) {
            setShowLoader(false);
        }

        return () => clearTimeout(timer);
    }, [derivedState.hasCharts]);

    const shouldShowLoader = showLoader;
    const tabData = [
        ["sql", "Chart SQL"],
        ["charts", "Charts"]
    ];

    // Component renderers
    const renderTopicsSection = () => {
        if (!derivedState.hasTopics) return null;

        return (
            <>
                <TopicsPanel
                    topics={derivedState.topics}
                    selectedTopicId={selectedTopicId}
                    onSetSelectedTopicId={setSelectedTopicId}
                    onSetTopics={() => {}}
                />
                <button onClick={() => {}} className="mt-2 rounded px-3 py-1 text-sm text-white">
                    Create KPI for Selected Topic
                </button>
            </>
        );
    };

    const renderKnowledgeGraph = () => {
        if (!derivedState.hasKnowledgeGraph) return null;
        return <KGPanel state={threadInfo} />;
    };

    const renderChartContent = () => {
        if (!derivedState.hasCharts && !shouldShowLoader) return null;

        if (shouldShowLoader && !derivedState.hasCharts) {
            return (
                <div className="flex min-h-70 items-center justify-center">
                    <GridSpinner height={32} width={32} />
                </div>
            );
        }

        if (chartTab === "sql") {
            return <ChartSqlPanel charts={derivedState.charts} />;
        }

        return <ChartContainer charts={derivedState.charts} />;
    };

    const renderChartsSection = () => {
        const hasChartsOrTexts = derivedState.hasCharts || derivedState.hasTexts;
        if (!hasChartsOrTexts && !shouldShowLoader) return null;

        return (
            <div className="mt-6 w-full">
                <div className="relative mb-4 flex w-full items-center justify-between">
                    {derivedState.hasCharts && <Tabs data={tabData} activeTab={chartTab} setActiveTab={setChartTab} />}
                    {derivedState.hasDashboardContent && <SaveDashboard />}
                </div>
                <div className="relative z-10">
                    {renderChartContent()}
                    {derivedState.hasTexts && <TextContainer text={derivedState.texts} heightLimit="max-h-[400px]" />}
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-full w-full flex-col overflow-y-auto p-2">
            <Centered className={`${barlow.className} h-full items-start justify-start p-1 font-normal text-[#000]`}>
                {renderTopicsSection()}
                {renderKnowledgeGraph()}
                {renderChartsSection()}
            </Centered>
        </div>
    );
};
