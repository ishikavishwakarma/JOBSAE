import { useCallback } from "react";
import { useCallMutation } from "./authApi";

/**
 * Fetches user info from Google using an access token.
 * Note: This is a direct fetch call because it hits a non-encrypted external endpoint.
 */
export const googleAuthApi = async (accessToken: string) => {
    const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );
    return await response.json();
};

export const useLogin = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();

    const login = useCallback(async (data: any) => {
        const details = {
            Action: "Login",
            Login_Type: data.loginType || "EMail",
            User_Id: data.userId || 0,
            EMail_Address: data.email,
            Password: data.password,

            EMail_User: {
                EMail_Address: data.email,
                Salutation_Cd: data.salutation,
                First_Name: data.firstName,
                Middle_Name: data.middleName,
                Last_Name: data.lastName,
                Full_Name: data.fullName,
                Suffix_Cd: null,
            },

            Google_User: data.loginType === "Google" ? data.googleJson : null,
            Facebook_User: data.loginType === "Facebook" ? data.facebookJson : null,
            Apple_User: data.loginType === "Apple" ? data.appleJson : null,
        };

        return await call({
            Call: "User_Login",
            Details: details,
            meta: { decrypt: false }
        }).unwrap();
    }, [call]);

    return { login, isLoading, error, data, isSuccess, isError, reset };
};

export const useRegister = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();

    const register = useCallback(async (userDataPayload: any) => {
        const {
            UserType,
            CompanyNm,
            loginType,
            userJson,
            googleJson = {},
            facebookJson = {},
            appleJson = {},
            microsoftJson = {},
        } = userDataPayload;

        const requestData = {
            Action: "Register",
            Login_Type: loginType || "EMail",
            User_Type: UserType || "",
            Company_Id: null,
            Company_Nm: CompanyNm || null,
            EMail_User: userJson || null,
            Google_User: loginType === "Google" ? googleJson : null,
            Facebook_User: loginType === "Facebook" ? facebookJson : null,
            Apple_User: loginType === "Apple" ? appleJson : null,
            Microsoft_User: loginType === "Microsoft" ? microsoftJson : null,
        };

        return await call({
            Call: "User_Register",
            Details: requestData,
            meta: { decrypt: false }
        }).unwrap();
    }, [call]);

    return { register, isLoading, error, data, isSuccess, isError, reset };
};

export const useCheckUserExist = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();

    const checkUserExist = useCallback(async (email: string) => {
        return await call({
            Call: "User_Exists",
            Details: {
                Action: "Get",
                User_Id: null,
                EMail_Address: email,
            }
        }).unwrap();
    }, [call]);

    return { checkUserExist, isLoading, error, data, isSuccess, isError, reset };
};

export const useVerifyUserAction = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();

    const verifyUserAction = useCallback(async (input: any = {}) => {
        const {
            Action = null,
            UserId = null,
            EMail = null,
            PassCu = null,
            PassNew = null,
            ActiveCd = null,
            Reason = null,
            note = null,
        } = input;

        const requestData = {
            Action,
            User_Id: UserId || null,
            EMail_Address: EMail || null,
            Password_Current: PassCu,
            Password_New: PassNew,
            Activation_Cd: ActiveCd,
            User_Delete_Reason: Reason,
            Notes: note,
        };

        return await call({
            Call: "User_Action",
            Details: requestData
        }).unwrap();
    }, [call]);

    return { verifyUserAction, isLoading, error, data, isSuccess, isError, reset };
};

export const useUserList = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();

    const getUserList = useCallback(async (data: any) => {
        const requestData = {
            Action: "List",
            User_Id: data.userId,
            Role: null,
            Company_Id: data.companyId,
        };

        return await call({
            Call: "User_Lst",
            Details: requestData
        }).unwrap();
    }, [call]);

    return { getUserList, isLoading, error, data, isSuccess, isError, reset };
};

export const useTicketData = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();

    const addTicketData = useCallback(async (data: any) => {
        const requestData = {
            Action: "Add",
            Ticket_Type: data?.ticket,
            Notes: data?.notes || "These are the notes",
        };

        return await call({
            Call: "Ticket_Add_Upd",
            Details: requestData
        }).unwrap();
    }, [call]);

    return { addTicketData, isLoading, error, data, isSuccess, isError, reset };
};

export const useEmailShare = () => {
    const [call, { isLoading, error, data, isSuccess, isError, reset }] = useCallMutation();

    const emailShare = useCallback(async (requestData: any) => {
        const data: any = {
            Send: requestData.send || null,
            For: requestData.for || null,
        };

        ["Purchase_Id", "Transaction_Id", "Job_Id"].forEach((key) => {
            if (requestData[key] !== undefined) {
                data[key] = requestData[key];
            }
        });

        return await call({
            Call: "EMail_Send",
            Details: data
        }).unwrap();
    }, [call]);

    return { emailShare, isLoading, error, data, isSuccess, isError, reset };
};
