import { getDeviceFingerprint } from "../utils/fingerprint";
import axios from "axios";

const createApiService = (name: string, baseURL: string, withCredentials = true) => {
    const service = axios.create({
        baseURL,
        withCredentials
    });

    service.interceptors.request.use(
        async (config) => {
            const deviceId = await getDeviceFingerprint();
            config.headers["device-id"] = deviceId;
            return config;
        },
        (error) => Promise.reject(error)
    );
    return service;
};

export const AuthApiService = createApiService("auth", "");

export const DashboardApiService = createApiService("dashboard", "");

export const AdminApiService = createApiService("threads", "");

export const TopicApiService = createApiService("topic", "");

export const AdminDevApiService = createApiService("admin", "");
