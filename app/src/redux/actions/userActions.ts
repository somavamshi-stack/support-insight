import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthApiService } from "@utils"; // Import your custom axios instance

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        const response = await AuthApiService.post("/api/auth/logout");

        const state: any = {
            success: false,
            error: null,
            loading: false
        };

        if (response.status === 200) {
            state.success = true;
        }

        return state;
    } catch (error: any) {
        const state: any = {
            success: false,
            error: error.response?.data?.message || "Logout failed",
            loading: false
        };

        return rejectWithValue(state);
    }
});

export const fetchUserInfo = createAsyncThunk("auth/fetchUserInfo", async (_, { rejectWithValue }) => {
    try {
        const response = await AuthApiService.get("/api/auth/user-info");

        const state: any = {
            success: false,
            error: null,
            loading: false
        };

        if (response.status === 200) {
            state.success = true;
        }

        return response.data;
    } catch (error: any) {
        const state: any = {
            success: false,
            error: error.response?.data?.message || "Logout failed",
            loading: false
        };

        return rejectWithValue(state);
    }
});
