import { useRouter } from "next/router";

import RecentQuestions from "./RecentQuestions";
import { dashboardState } from "@redux/slices";
import { useAppSelector } from "@redux/hooks";
import { AskAnything } from "./AskAnything";
import { SUCCESS } from "@constants";
import { Centered } from "@atoms";

export const RecentQuestionsRenderer = ({ userId }) => {
    const router = useRouter();
    const { topic_list_status, topic_list } = useAppSelector(dashboardState);
    const isFirstTopic = topic_list_status === SUCCESS && topic_list.length === 0;
    return (
        <div className="my-2 flex w-full flex-col justify-center">
            <AskAnything userId={userId} placeholder={"Ask me anything..."} title="What do you want to know?" />
            {!isFirstTopic && (
                <Centered>
                    <RecentQuestions questions={topic_list} onClickQuestion={(id) => router.push(`/c/${id}`, undefined, { shallow: true })} />
                </Centered>
            )}
        </div>
    );
};
