import { useCallback } from "react";
import { useCallMutation } from "./authApi";

export const useGetKeywordSuggestionList = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();

    const getKeywordSuggestions = useCallback(async (requestData: any) => {
        const basePayload = {
            Action: requestData.action || "Suggest",
            Group: requestData.group || null,
            Caller: requestData.caller || null,
            Type: requestData.type || null,
            Like: requestData.like || null,
            Where: requestData.where || null,
            Include: requestData.include || null,
            Hidden: null,
            Status: "Active",
            PageNumber: requestData.pageNumber || 1,
            PageSize: requestData.pageSize || 10,
        };
        return await call({
            Call: "Keyword_Lst",
            Details: basePayload
        }).unwrap();
    }, [call]);

    return { getKeywordSuggestions, isLoading, error, data, isSuccess, isError, reset };
};

export const useGetKeywordResponsibilityList = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();

    const getKeywordResponsibilities = useCallback(async (requestData: any) => {
        const payload = {
            Action: requestData.action || "List",
            Keyword: requestData.keyword || "",
            Caller: requestData.caller || null,
            Type: requestData.type || null,
            Like: requestData.like || null,
            Where: requestData.where || null,
            Include: requestData.include || null,
            Hidden: null,
            Status: "Active",
            PageNumber: requestData.pageNumber || 1,
            PageSize: requestData.pageSize || 10,
        };
        return await call({
            Call: "Keyword_Responsibility_Lst",
            Details: payload
        }).unwrap();
    }, [call]);

    return { getKeywordResponsibilities, isLoading, error, data, isSuccess, isError, reset };
};

export const useGetLocationSuggestions = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();

    const getLocationSuggestions = useCallback(async (requestData: any) => {
        const listType = requestData.listType;
        const basePayload = {
            Action: "Get",
            List_Type: listType,
            Location_String: requestData.locationString || "",
            Country_Id: requestData?.countryIds || null,
            Geo_Country_Id: requestData?.countryIds || null,
            Country: requestData.country || null,
            Region_Id: requestData.regionIds || null,
            Geo_Region_Id: requestData.regionIds || null,
            Region_Cd: null,
            Region: null,
            City_Id: null,
            Geo_City_Id: null,
            City: null,
            Geo_Continent_Id: null,
            Hidden: null,
            Status: "Active",
            PageNumber: requestData.pageNumber || 1,
            PageSize: requestData.pageSize || 10,
        };
        return await call({
            Call: "Location_Lst",
            Details: basePayload
        }).unwrap();
    }, [call]);

    return { getLocationSuggestions, isLoading, error, data, isSuccess, isError, reset };
};

export const useGeoLocationGet = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();

    const getGeoLocation = useCallback(async (payload: any) => {
        return await call({
            Call: "Geo_Location_Get",
            Details: payload,
            meta: {
                encrypt: true,
                addPayload: true,
                extraPayload: {
                    geo_Location: null,
                },
            }
        }).unwrap();
    }, [call]);

    return { getGeoLocation, isLoading, error, data, isSuccess, isError, reset };
};

export const useSearchJobList = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();
    const { getGeoLocation } = useGeoLocationGet();

    const searchJobs = useCallback(async (data: any) => {
        const normalizeArray = (arr: any) => Array.isArray(arr) ? arr : (arr ? [arr] : null);

        const requestData: any = {
            Method: data.method || "Search",
            Keywords: data.method === "Visit" ? null : normalizeArray(data.keyword),
            Locations: data.method === "Visit" ? null : normalizeArray(data.location),
            Zips: data.zips ?? null,
            Companies: normalizeArray(data.companies),
            Job_Types: normalizeArray(data.jobTypes),
            Industries: normalizeArray(data.industries),
            Job_Titles: normalizeArray(data.jobTitles),
            Benefits: normalizeArray(data.benefits),
            Salary: normalizeArray(data.salary),
            Radius: data.radius ?? null,
            Age: data.age ?? 5,
            PageNumber: data.pageNum || 1,
            PageSize: data.pageSize || 10,
        };

        const noLocation = !data.location || normalizeArray(data.location)?.length === 0;
        if (noLocation && data.method !== "Visit") {
            try {
                const geoGetResponse = await getGeoLocation({ Action: "Check" });
                const parsedGeoGet = geoGetResponse?.Return?.Geo_Location;
                if (parsedGeoGet?.mapLocation) {
                    requestData.Locations = [parsedGeoGet.mapLocation];
                }
            } catch (err) {
                console.error("GeoLocation fetch failed during job search", err);
            }
        }

        return await call({
            Call: "Job_Search",
            Details: requestData
        }).unwrap();
    }, [call, getGeoLocation]);

    return { searchJobs, isLoading, error, data, isSuccess, isError, reset };
};

export const useSingleJobDetail = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();

    const getSingleJobDetail = useCallback(async (jobId: string | number) => {
        const data = { Job_Id: jobId, Caller: "US", Hash: "" };
        return await call({
            Call: "Job_View",
            Details: data
        }).unwrap();
    }, [call]);

    return { getSingleJobDetail, isLoading, error, data, isSuccess, isError, reset };
};

export const useApplyJob = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();

    const applyJob = useCallback(async (hash: string) => {
        const data = { Hash: hash || "" };
        return await call({
            Call: "Job_Click",
            Details: data
        }).unwrap();
    }, [call]);

    return { applyJob, isLoading, error, data, isSuccess, isError, reset };
};

export const useAddJob = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();

    const addJob = useCallback(async (requestData: any) => {
        return await call({
            Call: "Job_Add_Upd",
            Details: requestData
        }).unwrap();
    }, [call]);

    return { addJob, isLoading, error, data, isSuccess, isError, reset };
};

export const useGetJobDetails = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();

    const getJobDetails = useCallback(async (jobId: string | number) => {
        const requestData = {
            Action: "Get",
            Section: "Basic",
            Part: "All",
            Job_Id: jobId,
        };
        return await call({
            Call: "Job_Get",
            Details: requestData
        }).unwrap();
    }, [call]);

    return { getJobDetails, isLoading, error, data, isSuccess, isError, reset };
};

export const useReferenceList = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();

    const getReferenceList = useCallback(async (table: string) => {
        const basePayload = {
            Action: "List",
            Table: table,
        };
        return await call({
            Call: "Reference_Lst",
            Details: basePayload
        }).unwrap();
    }, [call]);

    return { getReferenceList, isLoading, error, data, isSuccess, isError, reset };
};

export const useStatusList = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();

    const getStatusList = useCallback(async (statusType: string) => {
        const basePayload = {
            Action: "Get",
            Status_Type: statusType,
            Include: null,
            PageNumber: 1,
            PageSize: 10,
        };
        return await call({
            Call: "Status_Lst",
            Details: basePayload
        }).unwrap();
    }, [call]);

    return { getStatusList, isLoading, error, data, isSuccess, isError, reset };
};

export const useJobList = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();

    const getJobList = useCallback(async (data: any) => {
        const requestData = {
            Job_Id: null,
            Hidden: data.visibility && data.visibility.length > 0 ? data.visibility : [0, 1],
            Statuses: data.status && data.status.length > 0 ? data.status : null,
            Users: data.user && data.user.length > 0 ? data.user : null,
            PageNumber: data.page || 1,
            PageSize: 10,
        };
        return await call({
            Call: "Job_Lst",
            Details: requestData
        }).unwrap();
    }, [call]);

    return { getJobList, isLoading, error, data, isSuccess, isError, reset };
};
