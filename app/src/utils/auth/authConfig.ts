import ThirdParty, { Google } from "supertokens-auth-react/recipe/thirdparty";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";
import SuperTokens from "supertokens-auth-react";

import { COMPANY_NAME, AUTH_DOMAIN } from "@constants";

let websiteDomain = "http://localhost:3000";
if (typeof window !== "undefined") {
    websiteDomain = window.location.origin;
}

export const initAuth = () => {
    if (typeof window !== "undefined") {
        SuperTokens.init({
            enableDebugLogs: process.env.NEXT_PUBLIC_SUPERTOKENS_LOGGING_ENABLED == "true",
            defaultToSignUp: false,
            appInfo: {
                appName: process.env.NEXT_PUBLIC_APP_NAME || COMPANY_NAME,
                apiDomain: process.env.AUTH_DOMAIN || AUTH_DOMAIN,
                websiteDomain,
                apiBasePath: "/api/auth",
                websiteBasePath: "/login"
            },
            recipeList: [
                EmailPassword.init(),
                ThirdParty.init({
                    signInAndUpFeature: {
                        providers: [Google.init()]
                    }
                }),
                Session.init()
            ],
            getRedirectionURL: async (context) => {
                if (context.action === "SUCCESS" && context.newSessionCreated) {
                    if (context.redirectToPath !== undefined) {
                        // we are navigating back to where the user was before they authenticated
                        return context.redirectToPath;
                    }
                    return "/admin/dashboards";
                }
                if (context.action === "TO_AUTH") {
                    return "/login";
                }
                return undefined;
            }
        });
    }
};
