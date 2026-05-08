import { useCallback } from "react";
import APIResponseHelper, { extractFromApi } from "../../../utils/apiResponseHelper";
import { useCall2Mutation, useCallMutation } from "./authApi";

export interface FileDetails {
    File_No: number;
    Action: string;
    File_Id: number;
    Original_File_Nm: string;
    File_Extension: string;
    File_Size_Bytes: number;
    Width_Px: number | null;
    Height_Px: number | null;
    Duration_Sec: number | null;
    File_Category: string;
    File_Type: string;
    File_Caption: string;
    Job_Id: number | null;
    Ticket_Id: string | null;
}

export interface UploadFileOptions {
    fileCategory: string;
    files: File | File[];
    fileType: string;
    fileCaption: string;
    jobId?: number | null;
    ticket?: string | null;
}

export interface UploadFileResponse {
    Result?: {
        Files?: Array<{
            File_Id: number;
            File_Url: string;
            File_Name: string;
            File_Size: number;
            File_Extension: string;
        }>;
    };
    Return?: {
        [key: string]: any;
    };
    [key: string]: any;
}

export interface UploadFileHookReturn {
    uploadFile: (options: UploadFileOptions) => Promise<UploadFileResponse>;
    isLoading: boolean;
    error: any;
    data: UploadFileResponse | undefined;
    isSuccess: boolean;
    isError: boolean;
    reset: () => void;
}

export interface UploadSingleFileOptions {
    file: File;
    fileType: string;
    fileCategory?: string;
    caption?: string;
    jobId?: number | null;
    ticket?: string | null;
}

export const useGetImageTemplate = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();

    const getImageTemplate = useCallback(async (templateId: number) => {
        try {
            const result = await call({
                Call: "BO_Image_Template_Get",
                Details: { Action: "Get", Image_Template_Id: templateId }
            }).unwrap();
            return result;
        } catch (err) {
            throw err;
        }
    }, [call]);

    return {
        getImageTemplate,
        isLoading,
        error,
        data,
        isSuccess,
        isError,
        reset
    };
};

export const useGetAllTemplates = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();

    const getAllTemplates = useCallback(async () => {
        try {
            const result = await call({
                Call: "BO_Image_Template_Lst",
                Details: { Action: "Lst", Image_Template_Id: null, Status: null, User: null },
            }).unwrap();
            const templateJson = extractFromApi(result, 'Image_Template_Json');
            const templateData = extractFromApi(result, 'Image_Template');

            return {
                raw: result,
                helper: new APIResponseHelper(result),
                template: templateJson,
                data: templateData,
                get: (key: string, options: any) => extractFromApi(result, key, options)
            };
        } catch (err) {
            throw err;
        }
    }, [call]);

    return {
        getAllTemplates,
        isLoading,
        error,
        data,
        isSuccess,
        isError,
        reset
    };
};

export const useGetProductTypeLst = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();

    const getProductTypes = useCallback(async () => {
        try {
            const result = await call({
                Call: "BO_Product_Type_Lst",
                Details: { Action: "Lst", PageNumber: 1, PageSize: 10 }
            }).unwrap();
            return result;
        } catch (err) {
            throw err;
        }
    }, [call]);

    return {
        getProductTypes,
        isLoading,
        error,
        data,
        isSuccess,
        isError,
        reset
    };
};

export const useCreateImageTemplate = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();

    const createImageTemplate = useCallback(async (data: any) => {
        try {
            const result = await call({
                Call: "BO_Image_Template_Add_Upd",
                Details: data,
            }).unwrap();
            return result;
        } catch (err) {
            throw err;
        }
    }, [call]);

    return {
        createImageTemplate,
        isLoading,
        error,
        data,
        isSuccess,
        isError,
        reset
    };
};

// Helper function to get image dimensions
const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve({ width: img.width, height: img.height });
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Could not load image"));
        };

        img.src = url;
    });
};

// Helper function to get media duration (video/audio)
const getMediaDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
        const media = document.createElement(file.type.startsWith("video/") ? "video" : "audio");
        const url = URL.createObjectURL(file);

        media.addEventListener("loadedmetadata", () => {
            URL.revokeObjectURL(url);
            resolve(media.duration);
        });

        media.addEventListener("error", () => {
            URL.revokeObjectURL(url);
            reject(new Error("Could not load media"));
        });

        media.src = url;
        media.load();
    });
};

export const useUploadFile = () => {
    const [call2, { isLoading, error, data, isSuccess, isError, reset }] = useCall2Mutation();

    const uploadFile = useCallback(async (options: UploadFileOptions): Promise<UploadFileResponse> => {
        const { fileCategory, files, fileType, fileCaption, jobId = null, ticket = null } = options;

        const fileArray = Array.isArray(files) ? files : [files];

        if (fileArray.length === 0) {
            throw new Error("No files provided");
        }

        const detailsArray: FileDetails[] = [];

        for (let i = 0; i < fileArray.length; i++) {
            const file = fileArray[i];
            if (!file) continue;

            const extension = file.name.split(".").pop()?.toLowerCase() || "";
            const isImage = ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension);
            const isVideo = ["mp4", "webm", "mov", "avi", "mkv"].includes(extension);
            const isAudio = ["mp3", "wav", "ogg", "aac", "m4a"].includes(extension);

            let width: number | null = null;
            let height: number | null = null;
            let duration: number | null = null;

            if (isImage && fileCategory !== "resume") {
                try {
                    const dimensions = await getImageDimensions(file);
                    width = dimensions.width;
                    height = dimensions.height;
                } catch (err) {
                    console.warn("Could not get image dimensions:", err);
                }
            }

            if (isVideo || isAudio) {
                try {
                    duration = await getMediaDuration(file);
                } catch (err) {
                    console.warn("Could not get media duration:", err);
                }
            }

            detailsArray.push({
                File_No: i + 1,
                Action: "Add",
                File_Id: 0,
                Original_File_Nm: file.name,
                File_Extension: extension,
                File_Size_Bytes: file.size,
                Width_Px: width,
                Height_Px: height,
                Duration_Sec: duration,
                File_Category: "Social",
                File_Type: fileType,
                File_Caption: fileCaption,
                Job_Id: jobId ?? null,
                Ticket_Id: ticket ?? null,
            });
        }

        const formData = new FormData();
        formData.append("Call", "Files_Add_Upd");
        formData.append("EO", "0");
        formData.append("Details", JSON.stringify(detailsArray));

        fileArray.forEach((file) => {
            formData.append("Files", file);
        });

        console.group("📁 File Upload - FormData being sent to call2");
        for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`  ${key}: [File] ${value.name} (${(value.size / 1024).toFixed(2)} KB)`);
            } else {
                console.log(`  ${key}: ${value}`);
            }
        }
        console.groupEnd();

        try {
            const result = await call2(formData).unwrap();
            return result as UploadFileResponse;
        } catch (err) {
            console.error("File upload failed:", err);
            throw err;
        }
    }, [call2]);

    return {
        uploadFile,
        isLoading,
        error,
        data: data as UploadFileResponse | undefined,
        isSuccess,
        isError,
        reset
    };
};

export const useGetFileLst = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();

    const getFiles = useCallback(async (data: any) => {
        try {
            const result = await call({
                Call: "File_Lst",
                Details: {
                    FileCategory: data.category,
                    PageNumber: 1,
                    PageSize: 10,
                    File_Id: null,
                    Visibility: null,
                    Statuses: null,
                    File_Categories: null,
                    Users: null,
                }
            }).unwrap();
            return result;
        } catch (err) {
            throw err;
        }
    }, [call]);

    return {
        getFiles,
        isLoading,
        error,
        data,
        isSuccess,
        isError,
        reset
    };
};
