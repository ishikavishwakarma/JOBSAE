import { useCallMutation } from "./authApi";

export const useProductList = () => {
    const [call, status] = useCallMutation();

    const getProductList = async () => {
        const data = {
            Action: "List",
            Product_Id: null,
            Product_Category: null,
            Product_Type: null,
            Hidden: 0,
            Status: "Active",
            PageNumber: 1,
            PageSize: 10,
        };
        return await call({
            Call: "Product_Lst",
            Details: data
        }).unwrap();
    };

    return { getProductList, ...status };
};

export const useProductAddUpdate = () => {
    const [call, status] = useCallMutation();

    const addUpdateProduct = async (requestData: any) => {
        const data = {
            Action: requestData.action || null,
            Product_Id: requestData.id || null,
            Shopping_Cart_Id: requestData.cartId || null,
            Count: requestData.Count || null,
        };
        return await call({
            Call: "Shopping_Cart_Add_Upd",
            Details: data
        }).unwrap();
    };

    return { addUpdateProduct, ...status };
};

export const useProductGetDetails = () => {
    const [call, status] = useCallMutation();

    const getProductDetails = async (purchaseId: string | number) => {
        const data = {
            Action: "Get",
            Purchase_Id: purchaseId || null,
        };
        return await call({
            Call: "Shopping_Cart_Get",
            Details: data
        }).unwrap();
    };

    return { getProductDetails, ...status };
};

export const usePurchaseGet = () => {
    const [call, status] = useCallMutation();

    const getPurchase = async (cartId: string | number) => {
        const data = {
            Action: "Get",
            Shopping_Cart_Id: cartId || null,
        };
        return await call({
            Call: "Purchase_Get",
            Details: data
        }).unwrap();
    };

    return { getPurchase, ...status };
};

export const useCustomerPaymentProfileAddUpd = () => {
    const [call, status] = useCallMutation();

    const addUpdatePaymentProfile = async (requestData: any) => {
        const getLast4Digits = (num: string) => num ? num.slice(-4) : null;

        const data = {
            Action: requestData.Action || "Add",
            Payment_Gateway_Id: requestData.Payment_Gateway_Id || null,
            Payment_Gateway_Customer_Payment_Profile_Id: requestData.Payment_Gateway_Customer_Payment_Profile_Id || null,
            Customer_Profile_Id: requestData.profile_id || null,
            Credit_Card_Type_Id: requestData.credit_card_type_id || null,
            Customer_Type: requestData.customer_type || null,
            Card_No: getLast4Digits(requestData.cardNumber) || null,
            CCV: requestData.cvv || null,
            Last_Digits: requestData.Last_Digits || null,
            Expiration_Dt: requestData.expiry || null,
            Validated: requestData.Validated || null,
            First_Nm: requestData.firstName || null,
            Last_Nm: requestData.lastName || null,
            Company_Nm: requestData.Company_Nm || null,
            Billing_Address: {
                Billing_Address_Id: requestData?.Billing_Address_Id || null,
                Address_1: requestData?.address1 || null,
                Address_2: requestData?.address2 || null,
                City: requestData?.city || null,
                Region_Cd: requestData?.Region_Cd || null,
                Region: requestData?.Region || null,
                Zip: requestData?.zipCode || null,
                Country: requestData?.country || null,
            },
        };
        return await call({
            Call: "Customer_Payment_Profile_Add_Upd",
            Details: data
        }).unwrap();
    };

    return { addUpdatePaymentProfile, ...status };
};

export const useStripeCall = () => {
    const [call, status] = useCallMutation();

    const stripeCall = async (requestData: any) => {
        let data: any;
        if (requestData.Object === "Customer") {
            data = {
                Action: "Create",
                Object: "Customer",
                Customer: {
                    email: requestData.email,
                    name: requestData.name,
                    description: requestData.description || null,
                },
                PaymentIntent: null,
            };
        } else if (requestData.Object === "PaymentIntentCreateConfirm") {
            data = {
                Action: "CreateConfirm",
                Object: "PaymentIntent",
                Customer: null,
                PaymentIntent: {
                    amount: requestData.amount,
                    currency: requestData.currency,
                    customer: requestData.customer,
                    description: requestData.desc || null,
                    payment_method: requestData.paymentMethodId,
                    confirm: "true",
                },
                PaymentMethod: null,
                SetupIntent: null,
                Purchase_Id: requestData.purchaseId || null,
                Shopping_Cart_Id: requestData.shoppingCartId || null,
            };
        } else if (requestData.Object === "PaymentIntentConfirm") {
            data = {
                Action: requestData.action || "Confirm",
                Object: "PaymentIntent",
                Customer: null,
                PaymentIntent: {
                    payment_intent: requestData.paymentIntentId,
                    payment_method: requestData.paymentMethodId,
                },
                PaymentMethod: null,
                SetupIntent: null,
                Purchase_Id: requestData.purchaseId || null,
                Shopping_Cart_Id: requestData.shoppingCartId || null,
            };
        } else if (requestData.Object === "PaymentIntentGet") {
            data = {
                Action: "Get",
                Object: "PaymentIntent",
                Customer: null,
                PaymentIntent: {
                    payment_intent: requestData.paymentIntentId,
                },
                PaymentMethod: null,
                SetupIntent: null,
                Purchase_Id: requestData.purchaseId || null,
                Shopping_Cart_Id: requestData.shoppingCartId || null,
            };
        } else if (requestData.Object === "PaymentIntent") {
            data = {
                Action: "Create",
                Object: "PaymentIntent",
                Customer: null,
                PaymentIntent: {
                    amount: requestData.amount,
                    currency: requestData.currency,
                    customer: requestData.customer,
                    description: requestData.desc || null,
                    setup_future_usage: requestData.setup_future_usage,
                },
                Purchase_Id: requestData.purchaseId || null,
                Shopping_Cart_Id: requestData.shoppingCartId || null,
                PaymentMethod: null,
                SetupIntent: null,
            };
        } else if (requestData.Object === "PaymentMethodBillingDetails") {
            data = {
                Action: "BillingDetails",
                Object: "PaymentMethod",
                Customer: null,
                PaymentIntent: null,
                PaymentMethod: {
                    payment_method: requestData.autoPaymentMethodId,
                    name: requestData.name,
                    email: requestData.email,
                    phone: requestData.phone || null,
                    line1: requestData.line1,
                    line2: requestData.line2 || null,
                    city: requestData.city,
                    state: requestData.state,
                    postal_code: requestData.zip,
                    country: requestData.country,
                },
                SetupIntent: null,
                Purchase_Id: requestData.purchaseId || null,
                Shopping_Cart_Id: requestData.shoppingCartId || null,
            };
        } else if (requestData.Object === "PaymentMethodAttach") {
            data = {
                Action: requestData?.action || "Attach",
                Object: "PaymentMethod",
                Customer: null,
                PaymentIntent: null,
                PaymentMethod: {
                    customer: requestData.customer,
                    payment_method: requestData.pmId,
                },
                SetupIntent: null,
            };
        } else if (requestData.Object === "PaymentMethod") {
            data = {
                Action: "List",
                Object: "PaymentMethod",
                Customer: null,
                PaymentIntent: null,
                PaymentMethod: {
                    customer: requestData.customerId,
                },
                SetupIntent: null,
            };
        } else {
            throw new Error("Invalid requestData.Object");
        }
        return await call({
            Call: "Stripe_Call",
            Details: data
        }).unwrap();
    };

    return { stripeCall, ...status };
};

export const usePurchaseAddUpd = () => {
    const [call, status] = useCallMutation();

    const addUpdatePurchase = async (requestData: any) => {
        const data = {
            Action: requestData.action || "Add",
            Purchase_Id: requestData.purchaseId ?? null,
            Shopping_Cart_Id: requestData.shoppingCartId,
            Purchase_Order_No: requestData.orderNo ?? null,
            Purchase_Nm: requestData.purchaseNm ?? null,
            Status: requestData.status || "Incomplete",
        };
        return await call({
            Call: "Purchase_Add_Upd",
            Details: data
        }).unwrap();
    };

    return { addUpdatePurchase, ...status };
};

export const usePurchaseLists = () => {
    const [call, status] = useCallMutation();

    const getPurchaseLists = async (requestData: any = {}) => {
        const data = {
            Action: requestData.action || "Lst",
            Purchase_Id: requestData.purchaseId ?? null,
            Status: requestData.status ?? null,
            User: requestData.user ?? null,
        };
        return await call({
            Call: "Purchase_Lst",
            Details: data
        }).unwrap();
    };

    return { getPurchaseLists, ...status };
};

export const useTransactionAddUpd = () => {
    const [call, status] = useCallMutation();

    const addUpdateTransaction = async (requestData: any = {}) => {
        const data = {
            Action: requestData.action || "Add",
            Shopping_Cart_Id: requestData.shoppingCartId ?? null,
            Transaction_Id: requestData.transactionId ?? null,
            Purchase_Id: requestData.purchaseId ?? null,
            Status: requestData.status ?? null,
            Error_Json: requestData.errorJson || null,
            Payment_Method_Type: requestData.type || "Cards",
            Transaction_Json: requestData.transactionJson || null,
        };
        return await call({
            Call: "Transaction_Add_Upd",
            Details: data
        }).unwrap();
    };

    return { addUpdateTransaction, ...status };
};
