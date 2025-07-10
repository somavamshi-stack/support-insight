import { trackApiError, trackApiRequest, trackApiResponse } from "./analytics";
import { getDeviceFingerprint } from "../utils/fingerprint";
import axios from "axios";

const ENABLE_ANALYTICS = false; // process.env.PLAUSIBLE_DOMAIN != undefined;

const createApiService = (name: string, baseURL: string, withCredentials = true) => {
    const service = axios.create({
        baseURL,
        withCredentials
    });

    service.interceptors.request.use(
        async (config) => {
            const deviceId = await getDeviceFingerprint();
            config.headers["device-id"] = deviceId;

            if (ENABLE_ANALYTICS) {
                trackApiRequest(name, config);
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    if (ENABLE_ANALYTICS) {
        service.interceptors.response.use(
            async (response) => {
                trackApiResponse(name, response);
                return response;
            },
            async (error) => {
                trackApiError(name, error);
                return Promise.reject(error);
            }
        );
    }

    return service;
};

export const AuthApiService = createApiService("auth", "");

export const DashboardApiService = createApiService("dashboard", "");

export const AdminApiService = createApiService("threads", "");

export const TopicApiService = createApiService("topic", "");

export const AdminDevApiService = createApiService("admin", "");
