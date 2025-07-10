import { SuperTokensWrapper } from "supertokens-auth-react";
import PlausibleProvider from "next-plausible";
import type { AppProps } from "next/app";

import { getUserId, initAuth, PlausibleWrapper, useFetchInterceptor } from "@utils";

import StoreProvider from "../redux/StoreProvider";

import { CopilotKit } from "@copilotkit/react-core";
import { ADMIN_AGENT_NAME } from "@constants";
import "../styles/chatbox-styles.css";
import isEmpty from "lodash/isEmpty";
import "../styles/grid-layout.css";
import "../styles/index.css";

initAuth();

// Toggle for event tracking - set to true to enable, false to disable
const ENABLE_EVENT_TRACKING = !isEmpty(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN);

function MyApp({ Component, pageProps }: AppProps) {
    useFetchInterceptor();
    const scriptProps = {
        src: "/assets/analytics.js",
        "data-api": "/api/event"
    };

    return (
        <StoreProvider>
            <PlausibleProvider
                domain={typeof window !== "undefined" ? window.location.hostname : ""}
                enabled={ENABLE_EVENT_TRACKING}
                trackLocalhost={true}
                customDomain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
                selfHosted={true}
                manualPageviews={true}
                scriptProps={scriptProps}
            >
                <PlausibleWrapper userId={getUserId()}>
                    <SuperTokensWrapper>
                        <CopilotKit runtimeUrl="/api/copilotkit" agent={ADMIN_AGENT_NAME}>
                            <Component {...pageProps} />
                        </CopilotKit>
                    </SuperTokensWrapper>
                </PlausibleWrapper>
            </PlausibleProvider>
        </StoreProvider>
    );
}

export default MyApp;
