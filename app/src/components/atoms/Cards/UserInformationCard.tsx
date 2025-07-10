import { MdAlternateEmail } from "react-icons/md";
import { useUserinfo } from "@hooks";

export const UserInformationCard = () => {
    const user = useUserinfo();
    return (
        <div className="text-color-700 inline-flex w-full items-center justify-end space-x-2">
            {user?.emails?.length > 0 && (
                <div className="inline-flex w-full items-center space-x-1 rounded border px-2 shadow">
                    <MdAlternateEmail fontSize={14} />
                    <label className="text-[12px]">{user.emails[0]}</label>
                </div>
            )}
        </div>
    );
};
