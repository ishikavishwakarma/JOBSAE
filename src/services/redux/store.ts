// services/redux/store.ts
import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import routeReducer from "./slice/routeSlice";
import uploadFilesReducer from "./slice/uploadFilesSlice";
import profileReducer from "./slice/profileSlice";
import authReducer from "./slice/authSlice";
import jobReducer from "./slice/jobSlice";
import { setStore } from "./storeAccessor"; // Import setStore
import { api } from "./apis";

export const store = configureStore({
    reducer: {
        route: routeReducer,
        uploadFiles: uploadFilesReducer,
        profile: profileReducer,
        auth: authReducer,
        job: jobReducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});

// ✅ Set the store instance for accessor
setStore(store);

setupListeners(store.dispatch);

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
    ThunkReturnType,
    RootState,
    unknown,
    Action
>;
