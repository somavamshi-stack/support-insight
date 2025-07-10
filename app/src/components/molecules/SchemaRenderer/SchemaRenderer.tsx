import { useCallback, useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import Image from "next/image";
import map from "lodash/map";

import { Responsive, WidthProvider } from "react-grid-layout";

import { CARD_TYPE_MAPPING, ERROR, LOADING, RUNNING, SUCCESS } from "@constants";
import { ChartCard, EmptyIconRenderer, KpiCard } from "@molecules";
import { CardRendererProps, SchemaRendererProps } from "@types";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { fetchCardData, fetchSchema } from "@redux/actions";
import schemaLoading from "@assets/img/schema_loading.gif";
import { dashboardState } from "@redux/slices";
import isEqual from "lodash/isEqual";
import { Centered } from "@atoms";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

let interval: string | number | NodeJS.Timeout | undefined;
export const SchemaRenderer = ({ topicId, userId }: SchemaRendererProps) => {
    const dispatch = useAppDispatch();
    const { schema, schema_status, execution_logs } = useAppSelector(dashboardState);
    const [layouts, setLayouts] = useState<any>({ lg: [] });

    const loadSchema = useCallback(() => {
        if (topicId)
            dispatch(
                fetchSchema({
                    userId,
                    topic_id: topicId
                })
            );
    }, [topicId, userId, dispatch]);

    useEffect(loadSchema, [loadSchema]);

    useEffect(() => {
        if (interval) clearInterval(interval);
        if (schema_status === RUNNING || schema_status === LOADING) {
            interval = setInterval(() => {
                loadSchema();
            }, 10000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [schema_status, loadSchema]);

    useEffect(() => {
        if (schema_status === SUCCESS && schema != null) {
            setLayouts({
                lg: schema,
                md: schema,
                sm: schema,
                xs: schema,
                xxs: schema
            });
        }
    }, [schema_status, schema]);

    const onLayoutChange = useCallback(
        (props: any) => {
            const obj = props.map((prop, i) => {
                prop.id = layouts.lg[i].id;
                prop.type = layouts.lg[i].type;
                prop.label = layouts.lg[i].label;
                return prop;
            });
            if (!isEqual(obj, layouts.lg))
                setLayouts({
                    lg: obj,
                    md: obj,
                    sm: obj,
                    xs: obj,
                    xxs: obj
                });
        },
        [layouts]
    );

    if (schema_status == LOADING || schema_status == RUNNING) {
        return (
            <Centered className="min-h-[90vh]">
                <Image src={schemaLoading} width={250} height={250} alt="Please wait while I am preparing data" />
                <label className={`text-color-600 text-lg font-semibold`}>Please wait while I am preparing data for you...</label>
            </Centered>
        );
    }

    if (schema_status === ERROR || (schema_status === SUCCESS && isEmpty(schema))) {
        return (
            <Centered className="min-h-[90vh]">
                <EmptyIconRenderer
                    isError={true}
                    title="Sorry!!! I am unable to find you the relevant data."
                    details={execution_logs?.map((log, i) => (
                        <p key={i} className="text-red-500">
                            {log.message}
                        </p>
                    ))}
                />
            </Centered>
        );
    }

    return (
        <ResponsiveReactGridLayout
            layouts={layouts}
            onLayoutChange={onLayoutChange}
            compactType={null}
            preventCollision={true}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
        >
            {layouts &&
                map(layouts.lg, function (l, i) {
                    return (
                        <div key={i} className="p-1">
                            <CardRenderer schema={l} />
                        </div>
                    );
                })}
        </ResponsiveReactGridLayout>
    );
};

const CardRenderer = ({ schema }: CardRendererProps) => {
    const dispatch = useAppDispatch();
    const { chart_data, data_status, pollingInterval } = useAppSelector(dashboardState);
    const { id, label } = schema;
    const type = CARD_TYPE_MAPPING[schema.type];
    const getData = useCallback(() => {
        if (id != "-1") {
            dispatch(fetchCardData(id));
        }
    }, [id, dispatch]);
    useEffect(() => {
        getData();
        let interval: NodeJS.Timeout | null = null;

        if (pollingInterval !== "off") {
            if (interval) clearInterval(interval);
            interval = setInterval(getData, pollingInterval);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [pollingInterval, getData]);

    return (
        <>
            {type === "empty" ? (
                <div />
            ) : type === "kpi" ? (
                <KpiCard {...chart_data[id]} loading={data_status[id] == LOADING} label={label || ""} onAnalyze={() => {}} onRefine={() => {}} />
            ) : (
                <ChartCard {...chart_data[id]} loading={data_status[id] == LOADING} label={label || ""} onAnalyze={() => {}} onRefine={() => {}} />
            )}
        </>
    );
};
