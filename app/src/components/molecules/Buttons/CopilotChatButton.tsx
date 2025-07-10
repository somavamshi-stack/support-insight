import { IoChatboxSharp } from "react-icons/io5";
import { Tooltip } from "@molecules";
import { useFigAgent } from "@hooks";

export const CopilotChatButton = () => {
    const { isChatOpen, setOpenChat } = useFigAgent();
    if (isChatOpen) return null;
    return (
        <div className="absolute right-12 bottom-12 z-50">
            <Tooltip Tooltip title="Fig CoAgent" placement="bottom" arrow>
                <button
                    onClick={() => setOpenChat(true)}
                    className="text-color-600 hover:bg-color-100 border-color-300 hover:border-color-600 cursor-pointer rounded-full border bg-white p-3 text-2xl shadow-lg transition duration-300 ease-in-out"
                >
                    <IoChatboxSharp size={20} />
                </button>
            </Tooltip>
        </div>
    );
};
