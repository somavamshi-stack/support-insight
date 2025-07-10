import { barlow } from "../../../assets/fonts/barlow";
import { useAppDispatch } from "@redux/hooks";
import { useCallback, useState } from "react";
import { resetLogin } from "@redux/slices";
import { logout } from "@redux/actions";
import { useRouter } from "next/router";
import { clearCookies } from "@utils";

export const LogoutButton = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = useCallback(async () => {
        setIsLoading(true);
        try {
            dispatch(resetLogin());
            dispatch(logout()).then((res) => {
                if(res?.payload)
                clearCookies();
            })
        } catch (e) {
            console.error("Logout failed:", e);
        } finally {
            setIsLoading(false);
            router.push("/login");
        }
    }, [dispatch, router]);

    return (
        <button
            data-testid="logout-button"
            id="logout-button"
            onClick={handleLogout}
            className={`${barlow.className} flex items-center justify-center rounded bg-[#AE3020] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#F8513C]`}
        >
            {isLoading ? <div data-testid="spinner" className="size-4 animate-spin rounded-full border-t-2 border-white" /> : "Logout"}
        </button>
    );
};
