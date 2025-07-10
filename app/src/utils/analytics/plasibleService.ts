import { getSessionId, getUserId } from "../auth";

const getTracker = () => {
    if (typeof window !== "undefined" && window.plausible) {
        return window.plausible;
    }
    return null;
};

export const trackApiRequest = (serviceName, config) => {
    const tracker = getTracker();

    if (tracker) {
        tracker("api_request", {
            props: {
                service: serviceName,
                method: config.method,
                url: config.url,
                userId: getUserId() || "anonymous",
                sessionId: getSessionId() || "",
                timestamp: new Date().toISOString()
            }
        });
    }
};

export const trackApiResponse = (serviceName, response) => {
    const tracker = getTracker();

    if (tracker) {
        tracker("api_response", {
            props: {
                service: serviceName,
                method: response.config.method,
                url: response.config.url,
                status: response.status,
                success: true,
                userId: getUserId() || "anonymous",
                sessionId: getSessionId() || "",
                duration: response.headers["x-response-time"] || "unknown",
                timestamp: new Date().toISOString()
            }
        });
    }
};

export const trackApiError = (serviceName, error) => {
    const tracker = getTracker();

    if (error.config && tracker) {
        tracker("api_error", {
            props: {
                service: serviceName,
                method: error.config.method,
                url: error.config.url,
                status: error.response?.status || "unknown",
                message: error.message,
                userId: getUserId() || "anonymous",
                sessionId: getSessionId() || "",
                timestamp: new Date().toISOString()
            }
        });
    }
};
