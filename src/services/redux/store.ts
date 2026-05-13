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

import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import { combineReducers } from "@reduxjs/toolkit";

const persistConfig = {
    key: "root",
    storage: storageSession,
    whitelist: ["auth"], // persist only auth slice
};

const rootReducer = combineReducers({
    route: routeReducer,
    uploadFiles: uploadFilesReducer,
    profile: profileReducer,
    auth: authReducer,
    job: jobReducer,
    [api.reducerPath]: api.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(api.middleware),
});

export const persistor = persistStore(store);

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
