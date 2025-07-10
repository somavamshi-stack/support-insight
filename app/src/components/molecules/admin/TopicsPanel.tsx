import { barlow } from "../../../assets/fonts/barlow";
import { Topic } from "@types";

interface TopicsPanelProps {
    topics: Topic[];
    selectedTopicId: string | null;
    onSetTopics: (newTopics: Topic[]) => void;
    onSetSelectedTopicId: (topicId: string) => void;
}

export function TopicsPanel({ topics, selectedTopicId, onSetTopics, onSetSelectedTopicId }: TopicsPanelProps) {
    function handleToggleVerified(topicId: string, checked: boolean) {
        const updated = topics.map((t) => (t.topic_id === topicId ? { ...t, is_verified: checked } : t));
        onSetTopics(updated);
    }

    return (
        <div className="mb-4">
            <h2 className={`${barlow.className} mt-5 mb-4 text-[32px] font-semibold text-[#000000]`}>Topics</h2>

            {/* {topics.length === 0 ? ( */}
            {(topics?.length ?? 0) === 0 ? (
                <div className="mt-3 text-gray-600">No topics yet</div>
            ) : (
                <table className="mt-3 min-w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2 text-left">Select</th>
                            <th className="border p-2 text-left">Name</th>
                            <th className="border p-2 text-left">Verified?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topics.map((topic) => (
                            <tr key={topic.topic_id}>
                                {/* Radio button for selection */}
                                <td className="border p-2">
                                    <input
                                        type="radio"
                                        name="selectedTopic"
                                        value={topic.topic_id}
                                        checked={selectedTopicId === topic.topic_id}
                                        onChange={() => onSetSelectedTopicId(topic.topic_id)}
                                    />
                                </td>
                                <td className="border p-2">{topic.name}</td>
                                <td className="border p-2">
                                    <label className="inline-flex items-center space-x-1">
                                        <input
                                            type="checkbox"
                                            checked={topic.is_verified}
                                            onChange={(e) => handleToggleVerified(topic.topic_id, e.target.checked)}
                                        />
                                        <span>{String(topic.is_verified)}</span>
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
