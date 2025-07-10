import { createSlice } from "@reduxjs/toolkit";

import { fetchUserInfo, logout } from "@redux/actions";
import { RootState } from "@redux/store";

interface ILoginState {
    success: boolean;
    error?: any;
    loading: boolean;
    user?: any;
}

const initialState: ILoginState = {
    loading: false,
    success: false
};

export const loginStore = createSlice({
    name: "loginStore",
    initialState,
    reducers: {
        resetLogin: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.loading = false;
                state.user = null;
                state.error = action.payload.error;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchUserInfo.pending, (state) => {
                state.user = null;
            })
            .addCase(fetchUserInfo.fulfilled, (state, action) => {
                state.user = action.payload.user;
            })
            .addCase(fetchUserInfo.rejected, (state) => {
                state.user = null;
            });
    }
});

export const loginState = (state: RootState): ILoginState => state.login;
export const { resetLogin } = loginStore.actions;
export default loginStore.reducer;
