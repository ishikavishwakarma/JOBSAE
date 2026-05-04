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