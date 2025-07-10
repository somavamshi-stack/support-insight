import { CookieValueTypes, deleteCookie, getCookie } from "cookies-next/client";
import Session from "supertokens-auth-react/recipe/session";
import { AuthApiService } from "@utils";
import axios from "axios";

export const validateAndRefreshSession = () => {
    return new Promise(async (resolve) => {
        const userId = getUserId();
        const doesSessionExist = await Session.doesSessionExist();
        if (doesSessionExist) {
            try {
                if (userId) {
                    const response = await AuthApiService.post("/api/auth/validate-session", { userId });
                    if (response.status === 200) {
                        return resolve({
                            userId
                        });
                    }
                }
            } catch (error) {
                if (error.code === "ERR_NETWORK") return resolve(false);
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    try {
                        const refreshResponse = await AuthApiService.post("/api/auth/session/refresh", {});
                        return resolve(refreshResponse.status === 200);
                    } catch (error) {
                        console.warn("Session refresh failed:", error);
                    }
                }
                console.warn("Session validation failed:", error);
            }
        }
        return resolve({
            userId
        });
    });
};

export const getJWT = () => {
    return new Promise(async (resolve) => {
        if (await Session.doesSessionExist()) {
            const jwt = await Session.getAccessToken();
            return resolve(jwt);
        }
        resolve(null);
    });
};

export const getSessionId = (): CookieValueTypes => {
    return getCookie("sessionId");
};

export const getUserId = (): CookieValueTypes => {
    return getCookie("userId");
};

export const clearCookies = () => {
    deleteCookie("userId");
    deleteCookie("sAccessToken");
    deleteCookie("sessionId");
    deleteCookie("st-last-access-token-update");
};
