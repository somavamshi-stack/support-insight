import { copilotKitEndpoint, CopilotRuntime, copilotRuntimeNextJSPagesRouterEndpoint, OpenAIAdapter } from "@copilotkit/runtime";
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // Extract cookies from the request
    const originalCookies = Object.entries(req.cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join("; ");

    // Extract sAccessToken for x-access-token header
    const accessToken = req.cookies['sAccessToken'] || '';

    console.log("Original cookies captured:", originalCookies);
    console.log("Access token for x-access-token:", accessToken);

    // Store the original fetch function
    const originalFetch = global.fetch;
    global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = typeof input === "string" ? input : input.toString();

        // Add custom headers for requests to the /copilotkit endpoint
        if (url.includes(`${process.env.ADMIN_AGENT}/copilotkit`)) {
            const modifiedInit = {
                ...init,
                headers: {
                    ...init?.headers,
                    Cookie: originalCookies, // Retain original cookies
                    'x-access-token': accessToken // Add custom x-access-token header
                }
            };

            console.log("Adding cookies and x-access-token to request:", {
                cookies: originalCookies,
                'x-access-token': accessToken
            });
            console.log("Full fetch init:", JSON.stringify(modifiedInit, null, 2));
            return originalFetch(input, modifiedInit);
        }

        // Fallback to original fetch for other requests
        return originalFetch(input, init);
    };

    // Initialize CopilotRuntime with remote endpoint
    const runtime = new CopilotRuntime({
        remoteEndpoints: [
            copilotKitEndpoint({
                url: `${process.env.ADMIN_AGENT}/copilotkit`
            })
        ]
    });

    // Create the request handler
    const handleRequest = copilotRuntimeNextJSPagesRouterEndpoint({
        endpoint: "/api/copilotkit",
        runtime,
        serviceAdapter: new OpenAIAdapter({ openai: new OpenAI({ apiKey: "" }) })
    });

    try {
        return await handleRequest(req, res);
    } finally {
        // Restore original fetch function
        global.fetch = originalFetch;
    }
};

export default handler;
