import { getDeviceFingerprint } from "@utils";
import { useEffect } from "react";

export const useFetchInterceptor = () => {
    useEffect(() => {
        const originalFetch = window.fetch;
        window.fetch = async (url, options = {}) => {
            const deviceId = await getDeviceFingerprint();

            const modifiedOptions = {
                ...options,
                headers: {
                    ...options.headers,
                    "device-id": deviceId
                }
            };
            return originalFetch(url, modifiedOptions);
        };

        return () => {
            window.fetch = originalFetch;
        };
    }, []);
};
