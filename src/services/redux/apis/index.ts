import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { encryptedBaseQuery } from "../../lib/rtk-base-query";

export const api = createApi({
    reducerPath: "api",
    baseQuery: encryptedBaseQuery,
    tagTypes: ["Visits", "Auth", "Accounts", "Templates","ServerVariables"],
    endpoints: (_) => ({}),
});

// baseQuery: fetchBaseQuery({
//     baseUrl: API_BASE_URL,
//     prepareHeaders: async (headers: Headers) => {
//         // const token = await authUtils.getToken();
//         // if (token) {
//         //     headers.set("Authorization", `Bearer ${token}`);
//         // }
//         return headers;
//     },
// }),
// tagTypes: ["Visits", "Auth", "Accounts"],