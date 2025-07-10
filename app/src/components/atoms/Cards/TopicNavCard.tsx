import { deleteTopic, fetchTopics, setDefaultTopic } from "@redux/actions";
import { dashboardState, ITopic, setFlagStatus } from "@redux/slices";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { useCallback, useEffect, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { FAILED, IDLE, SUCCESS } from "@constants";
import { TbTrashFilled } from "react-icons/tb";
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";
import { Tooltip } from "@molecules";
import Swal from "sweetalert2";

export const TopicNavCard = ({ id, label, userId, expandSB }) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { topic_list, topic_deleted, topic_delete_status, topic_default_status } = useAppSelector(dashboardState);

    const [topic, setTopic] = useState<ITopic>();

    const handleResetFlag = useCallback(() => {
        dispatch(setFlagStatus({ topic_deleted: null, topic_delete_status: IDLE, topic_default_status: IDLE }));
        setTopic(undefined);
    }, [dispatch]);

    const findTopic = useCallback(() => {
        if (!isEmpty(topic_list)) {
            const t = topic_list.find((t) => t.topic_id === id);
            if (t) {
                setTopic(t);
            }
            return t;
        }
    }, [id, topic_list]);

    const handleDeleteClick = useCallback(() => {
        const t = findTopic();
        if (t) {
            Swal.fire({
                title: "Are you sure, You want to delete this topic?",
                text: `Topic: ${t?.topic_description}`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "green",
                cancelButtonColor: "red",
                confirmButtonText: "Yes",
                allowEscapeKey: false,
                allowOutsideClick: false
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    dispatch(deleteTopic(id));
                }
            });
        }
    }, [findTopic, dispatch, id]);

    const handleSetDefaultClick = useCallback(() => {
        const t = findTopic();
        if (t) {
            Swal.fire({
                title: "Are you sure, You want to make this topic as default?",
                text: `Topic: ${t.topic_description}`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "green",
                cancelButtonColor: "red",
                confirmButtonText: "Yes",
                allowEscapeKey: false,
                allowOutsideClick: false
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    dispatch(setDefaultTopic({ topic_id: id, user_id: userId, is_default_overview: true }));
                }
            });
        }
    }, [findTopic, dispatch, id, userId]);

    useEffect(() => {
        const t = findTopic();
        if (t) {
            if (topic_delete_status === SUCCESS) {
                Swal.fire({
                    title: "Successfully Deleted the Topic!",
                    text: `Topic: ${topic_deleted}`,
                    icon: "success",
                    allowEscapeKey: false,
                    allowOutsideClick: false
                }).then(({ isConfirmed }) => {
                    if (isConfirmed) {
                        handleResetFlag();
                        dispatch(fetchTopics(userId));
                        router.replace("/chat", undefined, { shallow: true });
                    }
                });
            }

            if (topic_delete_status === FAILED) {
                Swal.fire({
                    title: "OOPS!!!, Something went wrong",
                    text: `Topic: ${topic_deleted}`,
                    icon: "error",
                    allowEscapeKey: false,
                    allowOutsideClick: false
                }).then(({ isConfirmed }) => {
                    if (isConfirmed) {
                        handleResetFlag();
                    }
                });
            }
        }
    }, [topic_delete_status, topic_deleted, id, userId, findTopic, dispatch, router, handleResetFlag]);

    useEffect(() => {
        const t = findTopic();
        if (t) {
            if (topic_default_status === SUCCESS) {
                Swal.fire({
                    title: "Successfully Updated Default Topic!",
                    text: `Topic: ${t?.topic_description}`,
                    icon: "success",
                    allowEscapeKey: false,
                    allowOutsideClick: false
                }).then(({ isConfirmed }) => {
                    if (isConfirmed) {
                        handleResetFlag();
                        dispatch(fetchTopics(userId));
                    }
                });
            }

            if (topic_default_status === FAILED) {
                Swal.fire({
                    title: "OOPS!!!, Something went wrong",
                    text: `Topic: ${t?.topic_description}`,
                    icon: "error",
                    allowEscapeKey: false,
                    allowOutsideClick: false
                }).then(({ isConfirmed }) => {
                    if (isConfirmed) handleResetFlag();
                });
            }
        }
    }, [topic_default_status, userId, findTopic, handleResetFlag, dispatch]);

    return (
        <div className="group text-color-label relative inline-flex w-full items-center space-x-1">
            <div className="size-4" onClick={handleSetDefaultClick}>
                {topic?.is_default_overview ? <FaStar /> : <FaRegStar />}
            </div>
            <Tooltip title={label}>
                <div
                    className="w-36 cursor-pointer overflow-hidden whitespace-nowrap"
                    style={{
                        maskImage: "linear-gradient(to right, black 85%, transparent 97%)"
                    }}
                >
                    {expandSB ? label : String(label).at(0)?.toLocaleUpperCase()}
                </div>
            </Tooltip>
            {expandSB && (
                <div className="absolute right-0 opacity-0 group-hover:rounded-sm group-hover:bg-white group-hover:p-2 group-hover:opacity-100">
                    <Tooltip title="Delete this topic?" placement="left">
                        <TbTrashFilled onClick={handleDeleteClick} fontSize={16} />
                    </Tooltip>
                </div>
            )}
        </div>
    );
};
