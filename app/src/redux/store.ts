import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import adminDashboard from "./slices/adminSlice";
import dashboard from "./slices/dashboardSlice";
import login from "./slices/userSlice";

export const store = configureStore({
    reducer: {
        dashboard,
        login,
        adminDashboard
    }
});

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
