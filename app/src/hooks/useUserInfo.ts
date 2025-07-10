import { useAppSelector } from "@redux/hooks";
import { loginState } from "@redux/slices";
import { useEffect } from "react";

export function useUserinfo() {
    //const dispatch = useAppDispatch();
    const { user } = useAppSelector(loginState);
    useEffect(() => {
        //if (!user) dispatch(fetchUserInfo());
    }, []);

    return user; //in the end, return the current ref value.
}
