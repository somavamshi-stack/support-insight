import Session from "supertokens-auth-react/recipe/session";
import { setCookie } from "cookies-next/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";

import { getUserId, validateAndRefreshSession } from "@utils";
import { useUserinfo } from "@hooks";

export function withAuth<P>(WrappedComponent: React.ComponentType<P>): React.FC<P> {
    return (props: P) => {
        const router = useRouter();
        const [isAuthenticated, setIsAuthenticated] = useState(false);
        const user = useUserinfo();

        useEffect(() => {
            const { pathname } = router;
            async function checkSession() {
                const doesSessionExist = await Session.doesSessionExist();
                if (!doesSessionExist) {
                    await router.replace("/login");
                } else {
                    const token = await Session.getAccessToken();
                    if (!isEmpty(token)) setCookie("sAccessToken", token);
                    const id = await Session.getUserId();
                    const hasUser = !isEmpty(id);
                    if (hasUser) setCookie("userId", id);
                    setIsAuthenticated(hasUser);
                    const sessionObj: any = await validateAndRefreshSession();
                    setIsAuthenticated(!isEmpty(sessionObj) || sessionObj.userId == undefined);
                    if (sessionObj && pathname == "/") {
                        await router.push("/admin/dashboards", undefined, { shallow: true });
                    }
                }
            }
            checkSession();
        }, [router]);

        if (!isAuthenticated) return null;

        return <WrappedComponent {...props} userId={getUserId()} user={user} />;
    };
}
