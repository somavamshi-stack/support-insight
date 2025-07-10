import type { AppProps } from "next/app";

import { initAuth, useFetchInterceptor } from "@utils";

import StoreProvider from "../redux/StoreProvider";

import { CopilotKit } from "@copilotkit/react-core";
import { ADMIN_AGENT_NAME } from "@constants";
import "../styles/chatbox-styles.css";
import "../styles/grid-layout.css";
import "../styles/index.css";

initAuth();

function MyApp({ Component, pageProps }: AppProps) {
    useFetchInterceptor();
    return (
        <StoreProvider>
            <CopilotKit runtimeUrl="/api/copilotkit" agent={ADMIN_AGENT_NAME}>
                <Component {...pageProps} />
            </CopilotKit>
        </StoreProvider>
    );
}

export default MyApp;
