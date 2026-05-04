import { api } from "./index";
import { QueryMeta } from "./types/api.types";

export interface ServerVariablesResponse {
    Result?: {
        Server_Variables?: {
            [key: string]: any;
        };
    };
    Return?: {
        Server_Variables?: {
            [key: string]: any;
        };
    };
    [key: string]: any;
}
export interface Call2MutationArgs {
    Call: string;
    Details?: any;
    EO?: number;
    headers?: Record<string, string>;
    meta?: QueryMeta;
    isFileUpload?: boolean;
    formData?: FormData; // For direct FormData upload
}
export const authApi = api.injectEndpoints({
    overrideExisting: true,
    endpoints: (build) => ({
        // GET Server Variables
        getServerVariables: build.query<ServerVariablesResponse, void>({
            query: () => ({
                url: "/api/Configuration/Server_Variables_List",
                method: "GET",
                meta: {
                    decrypt: true,
                },
            }),
            providesTags: ["ServerVariables"],
            transformResponse: (response: any) => {
                console.log("Server Variables Response:", response);
                const serverVars = response?.Result?.Server_Variables ||
                    response?.Return?.Server_Variables ||
                    response;
                return serverVars;
            },
        }),
        
        // Main endpoint for all POST calls
        call: build.mutation({
            query: ({ Call, Details, EO = 1, headers = {},meta = {} }: { Call: string; Details?: any; EO?: number; headers?: Record<string, string>,meta?: QueryMeta; }) => ({
                url: "/api/Configuration/Call",
                method: "POST",
                body: {
                    Call,
                    EO,
                    ...(Details && { Details }),
                },
                meta: {
                    includeUser: true,
                    encryptEnabled: true,
                    decrypt: true,
                     ...meta, 
                },
                 headers: {
                    "X-Custom-Header": "custom-value",
                    "X-Request-ID": Math.random().toString(36),
                    ...headers,
                },
            }),
            // Optional: Add tags for cache invalidation
            invalidatesTags: (result, error, { Call }) => {
                if (Call.includes("Delete") || Call.includes("Create") || Call.includes("Update")) {
                    return ["Templates", "Jobs", "Auth"];
                }
                return [];
            },
        }),
        
        // Second endpoint if needed
        // Second endpoint for file uploads
        call2: build.mutation({
            query: (args: Call2MutationArgs | FormData) => {
                // If args is FormData, send it directly
                if (args instanceof FormData) {
                    return {
                        url: "/api/Configuration/Call2",
                        method: "POST",
                        body: args,
                        meta: {
                            includeUser: true,
                            encryptEnabled: true,
                            decrypt: true,
                            isFileUpload: true,
                        },
                        headers: {
                            // No Content-Type header - browser will set with boundary
                        },
                    };
                }
                
                // Regular payload (not file upload)
                const { Call, Details, EO = 1, headers = {}, meta = {} } = args;
                
                return {
                    url: "/api/Configuration/Call2",
                    method: "POST",
                    body: {
                        Call,
                        EO,
                        ...(Details && { Details }),
                    },
                    meta: {
                        includeUser: true,
                        encryptEnabled: true,
                        decrypt: true,
                        ...meta,
                    },
                    headers: {
                        ...headers,
                    },
                };
            },
            invalidatesTags: (result, error, { Call }) => {
                if (Call?.includes("Delete") || Call?.includes("Create") || Call?.includes("Update")) {
                    return ["Templates", "Jobs", "Auth", "Files"];
                }
                return [];
            },
        }),
    }),
});
export const {
    useGetServerVariablesQuery,
    useCallMutation,
    useCall2Mutation,
} = authApi;