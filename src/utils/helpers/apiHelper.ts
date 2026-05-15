import { getDynamicKey } from "../Security/cryptoUtils";
import { decrypt } from "../Security/encryption";

export function deepDecrypt(data) {
  if (data == null) return data;

  // If array → decrypt each element
  if (Array.isArray(data)) {
    return data.map((item) => deepDecrypt(item));
  }

  // If object → decrypt fields
  if (typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([key, val]) => [key, decryptValue(val)])
    );
  }
  return decryptValue(data);
}

export function decryptValue(value) {
  const dynamicKey = getDynamicKey();
  const MASTER_KEY =dynamicKey || import.meta.env.VITE_ENCRYPTION_KEY;
  if (typeof value !== "string") return safeDeepParse(value);

  const looksEncrypted = value.length > 60 || /^[A-Za-z0-9+/=]+$/.test(value);

  if (looksEncrypted) {
    try {
      const decrypted = decrypt(value, MASTER_KEY);
      return safeDeepParse(decrypted);
    } catch {
      return safeDeepParse(value);
    }
  }

  return safeDeepParse(value);
}
export function safeDeepParse(value) {
  try {
    if (typeof value === "string") {
      const parsed = JSON.parse(value);
      return typeof parsed === "object" ? safeDeepParse(parsed) : parsed;
    }

    if (typeof value === "object" && value !== null) {
      return Array.isArray(value)
        ? value.map(safeDeepParse)
        : Object.fromEntries(
            Object.entries(value).map(([k, v]) => [k, safeDeepParse(v)])
          );
    }
    return value;
  } catch {
    return value;
  }
}

export function decryptResponse(raw, decryptEnabled = true) {
  if (!decryptEnabled) return safeDeepParse(raw);
  return deepDecrypt(raw);
}
export function cleanApiReturn(returnObj) {
  if (!returnObj || typeof returnObj !== "object") return returnObj;
  const cleaned = {};

  for (const [key, value] of Object.entries(returnObj)) {
    if (value === null || value === undefined) continue; // skip null fields
    if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0
    )
      continue;

    // Skip empty arrays: []
    if (Array.isArray(value) && value.length === 0) continue;

    cleaned[key] = value; // keep only non-empty values
  }

  return cleaned;
}

export const formatSocialData = (userInfo, tokenResponse = {}, loginType = "") => {
  const iat = Math.floor(Date.now() / 1000);
  const expiresIn =
    tokenResponse?.expires_in ||
    tokenResponse?.expiresIn ||
    userInfo?.expiresIn ||
    3600;
  const exp = iat + expiresIn;

  const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "");

  switch (loginType) {
    case "Google":
      return {
        iss: "https://accounts.google.com",
        sub: userInfo?.sub || userInfo?.id || null,
        aud: tokenResponse?.clientId || null,
        azp: tokenResponse?.clientId || null,
        email: userInfo?.email || null,
        email_verified: userInfo.email_verified || null,
        name: userInfo?.name || null,
        given_name: userInfo?.given_name || null,
        family_name: userInfo?.family_name || null,
        picture: userInfo?.picture || null,
        locale: userInfo?.locale || null,
        hd: userInfo?.hd || null,
        iat,
        exp,
        auth_code: null,
        token: userInfo.access_token || tokenResponse?.access_token || null,
      };
    case "Facebook": {
      let firstName = userInfo?.first_name || null;
      let lastName = userInfo?.last_name || null;

      if ((!firstName || !lastName) && userInfo?.name) {
        const parts = userInfo.name.trim().split(" ");
        if (parts.length > 1) {
          firstName = parts[0];
          lastName = parts.slice(1).join(" ");
        } else {
          firstName = parts[0] || null;
          lastName = null;
        }
      }
      return {
        id: userInfo?.id || null,
        email: userInfo?.email || null,
        name: userInfo?.name || null,
        first_name: firstName,
        last_name: lastName,
        gender: userInfo?.gender || null,
        birthday: userInfo?.birthday || null,
        location: userInfo?.location?.name || null,
        age_range: userInfo?.age_range?.min || null,
        link: userInfo?.link || null,
        locale: userInfo?.locale || null,
        timezone: userInfo?.timezone || null,
        verified: userInfo.verified || null,
        picture: userInfo?.picture?.data?.url || userInfo?.picture || null,
        iat,
        exp,
        token: typeof tokenResponse === "string" ? tokenResponse : (tokenResponse?.accessToken || userInfo?.accessToken || null),
      };
    }
    case "Apple":
      return {
        user: userInfo?.sub || null,
        email: userInfo?.email || null,
        full_name: {
          given_name: capitalize(userInfo?.first_name || userInfo?.given_name),
          family_name: capitalize(userInfo?.last_name || userInfo?.family_name),
        },
        sub: userInfo?.sub || null,
        email_verified: userInfo?.email_verified || null,
        is_private_email: userInfo?.is_private_email || null,
        auth_time: userInfo?.auth_time || iat,
        iss: userInfo.iss || "https://appleid.apple.com/",
        aud: tokenResponse?.clientId || userInfo?.aud || null,
        exp: userInfo?.exp || null,
        iat: userInfo?.iat || null,
        token: typeof tokenResponse === "string" ? tokenResponse : (tokenResponse?.token || userInfo?.token || null),
      };
    default:
      return {
        email: userInfo?.email || null,
        name: userInfo?.name || null,
        token: tokenResponse?.accessToken || null,
        iat,
        exp,
      };
  }
};