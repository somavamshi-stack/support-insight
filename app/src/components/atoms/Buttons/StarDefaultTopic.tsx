import { dashboardState, ITopic, setFlagStatus } from "@redux/slices";
import { fetchTopics, setDefaultTopic } from "@redux/actions";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { useCallback, useEffect, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { FAILED, IDLE, SUCCESS } from "@constants";
import isEmpty from "lodash/isEmpty";
import Swal from "sweetalert2";

export const StarDefaultTopic = ({ id, userId }) => {
    const dispatch = useAppDispatch();
    const { topic_default_status, topic_list } = useAppSelector(dashboardState);

    const [topic, setTopic] = useState<ITopic>();

    const handleResetFlag = useCallback(() => dispatch(setFlagStatus({ topic_default_status: IDLE })), [dispatch]);

    const handleSetDefaultTopic = useCallback(
        () => dispatch(setDefaultTopic({ topic_id: id, user_id: userId, is_default_overview: !topic?.is_default_overview })),
        [id, userId, topic, dispatch]
    );

    const handleSetDefaultClick = useCallback(
        async (e: any) => {
            e.preventDefault();
            e.stopPropagation();

            Swal.fire({
                title: "Are you sure?",
                text: "You want to make this topic as default?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "green",
                cancelButtonColor: "red",
                confirmButtonText: "Yes",
                allowEscapeKey: false,
                allowOutsideClick: false
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    handleSetDefaultTopic();
                }
            });
        },
        [handleSetDefaultTopic]
    );

    const handleRemoveDefaultClick = useCallback(
        async (e: any) => {
            e.preventDefault();
            e.stopPropagation();

            Swal.fire({
                title: "Are you sure?",
                text: "You want to remove this topic from default?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "green",
                cancelButtonColor: "red",
                confirmButtonText: "Yes",
                allowEscapeKey: false,
                allowOutsideClick: false
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    handleSetDefaultTopic();
                }
            });
        },
        [handleSetDefaultTopic]
    );

    useEffect(() => {
        if (!isEmpty(topic_list)) {
            setTopic(topic_list.find((t) => t.topic_id === id));
        }
    }, [id, topic_list]);

    useEffect(() => {
        if (topic_default_status === SUCCESS) {
            dispatch(fetchTopics(userId));
            Swal.fire({
                title: "Successfully Updated Default Topic!",
                text: `Topic Label: ${topic?.topic_description}`,
                icon: "success",
                allowEscapeKey: false,
                allowOutsideClick: false
            }).then(({ isConfirmed }) => {
                if (isConfirmed) handleResetFlag();
            });
        }

        if (topic_default_status === FAILED) {
            Swal.fire({
                title: "OOPS!!!, Something went wrong",
                text: `Topic ID: ${topic?.topic_description}`,
                icon: "error",
                allowEscapeKey: false,
                allowOutsideClick: false
            }).then(({ isConfirmed }) => {
                if (isConfirmed) handleResetFlag();
            });
        }
    }, [topic_default_status, userId, topic?.topic_description, dispatch, handleResetFlag]);

    return (
        <div className="size-4" onClick={topic?.is_default_overview ? handleRemoveDefaultClick : handleSetDefaultClick}>
            {topic?.is_default_overview ? <FaStar /> : <FaRegStar />}
        </div>
    );
};
