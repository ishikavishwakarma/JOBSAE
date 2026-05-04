// utils/server.ts
import Cookies from "js-cookie";
import { encrypt } from "./encryption";
import { decryptResponse } from "../helpers/apiHelper";

const SERVER_VARS_COOKIE = "server_variables";
const COOKIE_DAYS = 1;

interface ServerVariables {
  [key: string]: any;
}

/**
 * Save server variables to cookie with encryption
 * @param data - Server variables data to save
 */
export const saveServerVariablesToCookie = (data: ServerVariables): void => {
  try {
    const key = import.meta.env.VITE_ENCRYPTION_KEY;
    if (!key) {
      console.error("Encryption key not found");
      return;
    }
    
    const encrypted = encrypt(JSON.stringify(data), key);
    Cookies.set(SERVER_VARS_COOKIE, encrypted, {
      expires: COOKIE_DAYS,
      secure: true,
      sameSite: "Strict",
      path: "/",
    });
    
  } catch (error) {
    console.error("❌ Failed to save server variables to cookie:", error);
  }
};

/**
 * Load server variables from cookie and decrypt
 * @returns Decrypted server variables or null if not found
 */
export const loadServerVariablesFromCookie = (): ServerVariables | null => {
  try {
    const encrypted = Cookies.get(SERVER_VARS_COOKIE);
    if (!encrypted) {
      console.log("No server variables found in cookie");
      return null;
    }
    
    const decrypted = decryptResponse(encrypted);
    return decrypted;
  } catch (err) {
    console.error("❌ Failed to load server variables from cookie:", err);
    return null;
  }
};

/**
 * Clear server variables from cookie
 */
export const clearServerVariablesFromCookie = (): void => {
  try {
    Cookies.remove(SERVER_VARS_COOKIE, { path: "/" });
  } catch (error) {
    console.error("❌ Failed to clear server variables from cookie:", error);
  }
};

/**
 * Get server variables with priority (cookie first, then API fallback)
 * @param fetchFromApi - Function to fetch from API if cookie is empty
 * @returns Server variables
 */
export const getServerVariablesWithFallback = async (
  fetchFromApi?: () => Promise<ServerVariables>
): Promise<ServerVariables | null> => {
  // Try to load from cookie first
  const fromCookie = loadServerVariablesFromCookie();
  if (fromCookie) {
    return fromCookie;
  }
  
  // If not in cookie and API function provided, fetch from API
  if (fetchFromApi) {
    try {
      const fromApi = await fetchFromApi();
      if (fromApi) {
        saveServerVariablesToCookie(fromApi);
        return fromApi;
      }
    } catch (error) {
      console.error("Failed to fetch server variables from API:", error);
    }
  }
  
  return null;
};