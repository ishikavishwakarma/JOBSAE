import { useCallback } from "react";
import { useCallMutation } from "./authApi";

export const useGetProfileData = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();

    const getProfile = useCallback(async () => {
        try {
            const result = await call({
                Call: "Application_Profile_Get",
                Details: {
                    Action: "Get",
                    Include: null,
                    Key: null,
                },
                meta: { isProfileCall: true }
            }).unwrap();
            return result;
        } catch (err) {
            throw err;
        }
    }, [call]);

    return {
        getProfile,
        isLoading,
        error,
        data,
        isSuccess,
        isError,
        reset
    };
};

export const useUpdateProfile = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();
    const updateProfile = useCallback(async (requestData: any) => {
        return await call({
            Call: "User_Profile_Add_Upd",
            Details: requestData,
            meta: { isProfileCall: true }
        }).unwrap();
    }, [call]);
    return { updateProfile, isLoading, error, data, isSuccess, isError, reset };
};

export const useUpdateCompanyProfile = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();
    const updateCompanyProfile = useCallback(async (requestData: any) => {
        return await call({
            Call: "Company_Profile_Add_Upd",
            Details: requestData,
            meta: { isProfileCall: true }
        }).unwrap();
    }, [call]);
    return { updateCompanyProfile, isLoading, error, data, isSuccess, isError, reset };
};

export const useGetCompanyProfile = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();
    const getCompanyProfile = useCallback(async () => {
        const requestData = {
            Action: "Get",
            Profile_Id: null,
            Profile_Section_Type_Id: null,
        };
        return await call({
            Call: "Company_Profile_Get",
            Details: requestData,
            meta: { isProfileCall: true }
        }).unwrap();
    }, [call]);
    return { getCompanyProfile, isLoading, error, data, isSuccess, isError, reset };
};

export const useHomeList = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();
    const getHomeList = useCallback(async (requestData: any) => {
        const basePayload = {
            Action: "List",
            Company: requestData?.company || null,
            Industry: requestData?.industry || null,
            Keyword: requestData?.keyword || null,
            Location: requestData?.location || null,
            PageNumber: requestData?.page || 1,
            PageSize: requestData?.pages || 10,
        };
        return await call({
            Call: requestData?.type || "Home_Lst",
            Details: basePayload
        }).unwrap();
    }, [call]);
    return { getHomeList, isLoading, error, data, isSuccess, isError, reset };
};

export const useGetUserProfile = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();
    const getUserProfile = useCallback(async () => {
        const requestData = {
            Action: "Get",
            Profile_Id: null,
            Profile_Section_Type_Id: null,
        };
        return await call({
            Call: "User_Profile_Get",
            Details: requestData,
            meta: { isProfileCall: true }
        }).unwrap();
    }, [call]);
    return { getUserProfile, isLoading, error, data, isSuccess, isError, reset };
};

export const useUserGet = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();
    const userGet = useCallback(async (requestDataApi: any) => {
        const requestData = {
            Action: "Get",
            User_Id: requestDataApi?.userId || 0,
            EMail_Address: requestDataApi?.email || null,
        };
        return await call({
            Call: "User_Get",
            Details: requestData,
            meta: { decrypt: false }
        }).unwrap();
    }, [call]);
    return { userGet, isLoading, error, data, isSuccess, isError, reset };
};

export const useGetProfileFileList = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();
    const getProfileFileList = useCallback(async (requestData: any) => {
        const defaultRequestData = {
            FileCategory: requestData.category,
            PageNumber: 1,
            PageSize: 10,
            File_Id: null,
            Visibility: null,
            Statuses: null,
            File_Categories: null,
            Users: null,
        };
        return await call({
            Call: "File_Lst",
            Details: defaultRequestData
        }).unwrap();
    }, [call]);
    return { getProfileFileList, isLoading, error, data, isSuccess, isError, reset };
};

export const useSkillCategoryLst = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();
    const getSkillCategoryLst = useCallback(async () => {
        const defaultRequestData = {
            listType: "string",
        };
        return await call({
            Call: "Skill_Category_Lst",
            Details: defaultRequestData
        }).unwrap();
    }, [call]);
    return { getSkillCategoryLst, isLoading, error, data, isSuccess, isError, reset };
};

export const useSkillLst = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();
    const getSkillLst = useCallback(async (requestData: any) => {
        const defaultRequestData = {
            listType: "string",
            Skill_Category_Id: requestData?.categoryId,
        };
        return await call({
            Call: "Skill_Lst",
            Details: defaultRequestData
        }).unwrap();
    }, [call]);
    return { getSkillLst, isLoading, error, data, isSuccess, isError, reset };
};

export const useSitePageGet = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();
    const getSitePage = useCallback(async (requestData: any) => {
        const defaultRequestData = {
            Action: "Get",
            Page: requestData?.page,
            Include: null,
        };
        return await call({
            Call: "Site_Page_Get",
            Details: defaultRequestData
        }).unwrap();
    }, [call]);
    return { getSitePage, isLoading, error, data, isSuccess, isError, reset };
};