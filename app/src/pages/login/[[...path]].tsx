import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import { ThirdPartyPreBuiltUI } from "supertokens-auth-react/recipe/thirdparty/prebuiltui";
import SuperTokens from "supertokens-auth-react/ui";
import { LoginPageLayout } from "@templates";
import { useEffect, useState } from "react";

export const PreBuiltUIList = [ThirdPartyPreBuiltUI, EmailPasswordPreBuiltUI];

export default function Login() {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        if (SuperTokens.canHandleRoute(PreBuiltUIList) === true) {
            setLoaded(true);
        }
    }, []);

    if (loaded) {
        return <LoginPageLayout>{SuperTokens.getRoutingComponent(PreBuiltUIList)}</LoginPageLayout>;
    }

    return null;
}
