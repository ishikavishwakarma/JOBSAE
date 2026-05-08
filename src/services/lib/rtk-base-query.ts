import {
  BaseQueryFn,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { getStore } from "../redux/storeAccessor";
import { APP_CONFIG } from "../../config/env";
import { getDynamicKey, setDynamicKey } from "../../utils/Security/cryptoUtils";
import { decrypt, encrypt } from "../../utils/Security/encryption";
import { decryptResponse } from "../../utils/helpers/apiHelper";
import {
  BuildPayloadOptions,
  EncryptedPayload,
  ApiError,
  QueryMeta,
} from "../redux/apis/types/api.types";
import { appProfileReady, markAppProfileReady } from "../../utils/Security/appInit";
// ─── Types ────────────────────────────────────────────────────────────────────
interface LocationData {
  Latitude: number | null;
  Longitude: number | null;
  Timestamp: string;
  Accuracy: number | null;
  Altitude: number | null;
  AltitudeAccuracy: number | null;
  Heading: number | null;
  Speed: number | null;
  Location_Shared: boolean | null;
}
interface SetupBlock {
  Application_Id: number | string | undefined;
  Installation_Id: number;
  Session_Id: string;
  Place_Id: number;
  Location: LocationData | null;
  Location_Shared: boolean | null;
  Client_Variable: ClientVariable;
  Server_Variable: Record<string, string> | null;
  IPAddress: string | null;
  UserAgent: string;
  CallerURL: string;
  RefererURL: string;
  Caller: string;
}
interface ClientVariable {
  HTTP_USER_AGENT: string;
  HTTP_REFERER: string;
  QUERY_STRING: string;
  HTTPS: string;
  PATH_INFO: string;
  HTTP_HOST: string;
}
interface UserBlock {
  User_Id: number;
  User_Type_Id: number;
  Company_Id: number;
}
interface UserRaw {
  User_Id?: number;
  User_Type_Id?: number;
  Company_Id?: number;
}

interface DecryptedResponse {
  Call?: string;
  Return?: {
    Application_Profile?: Array<{ Key: string; Value: string }>;
  };
  Result?: {
    Session_Id?: string | number;
    Action_Items?: {
      Logout?: number;
      Ask_Location_Share?: null;
    };
  };
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface QueryArgs {
  url: string;
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, unknown>;
  meta?: QueryMeta;
}



// ─── Constants ────────────────────────────────────────────────────────────────

const PROFILE_KEY = import.meta.env.VITE_START_ENCRYPTION_KEY as string;

/**
 * Default headers sent with every API request.
 * Extend this object to add more global headers (e.g. app version, locale).
 */
const DEFAULT_HEADERS: Record<string, string> = {
  "X-App-Id": APP_CONFIG.APPLICATION_ID?.toString() ?? "",
  "X-Platform": "Web",
  "X-App-Version": (import.meta.env.VITE_APP_VERSION as string) ?? "1.0.0",
  "Accept-Language": navigator.language ?? "en-US",
};

// ─── Logger ───────────────────────────────────────────────────────────────────

const log = {
  info: (msg: string, ...args: unknown[]) => console.log(`%c${msg}`, "color:#3498db;font-weight:bold", ...args),
  success: (msg: string, ...args: unknown[]) => console.log(`%c${msg}`, "color:#2ecc71;font-weight:bold", ...args),
  warn: (msg: string, ...args: unknown[]) => console.warn(`%c${msg}`, "color:#feca57;font-weight:bold", ...args),
  error: (msg: string, ...args: unknown[]) => console.error(`%c${msg}`, "color:#e74c3c;font-weight:bold", ...args),
  encrypted: (msg: string, ...args: unknown[]) => console.log(`%c${msg}`, "color:#a29bfe;font-weight:bold", ...args),
  decrypted: (msg: string, ...args: unknown[]) => console.log(`%c${msg}`, "color:#00cec9;font-weight:bold", ...args),
  raw: (msg: string, ...args: unknown[]) => console.log(`%c${msg}`, "color:#fd79a8;font-weight:bold", ...args),
  group: (msg: string) => console.groupCollapsed(`%c${msg}`, "color:#6c5ce7;font-weight:bold;font-size:12px"),
  groupEnd: () => console.groupEnd(),
};
// ─── Axios-style full request logger ─────────────────────────────────────────

function logApiCall(params: {
  method: string;
  url: string;
  fullUrl: string;
  headers: Record<string, string>;
  meta: QueryMeta;
  rawBody: unknown;
  encryptedPayload: EncryptedPayload;
  startTime: number;
}) {
  const { method, url, fullUrl, headers, meta, rawBody, encryptedPayload, startTime } = params;

  // console.info(
  //   `%c⬆ ${method} %c${url}`,
  //   'color:#fff; background:#1D9E75; padding:2px 6px; border-radius:3px; font-weight:600;',
  //   'color:#378ADD; font-weight:600; font-size:12px;'
  // );

  // ── General ──────────────────────────────────────────────────────────────
 

  // ── Request headers ───────────────────────────────────────────────────────
  // console.log('%cRequest Headers', 'color:#888; font-size:11px; text-transform:uppercase;');
  // console.table(headers);

  // ── Meta / options ────────────────────────────────────────────────────────
  // console.log('%cMeta / Options', 'color:#888; font-size:11px; text-transform:uppercase;');
  // console.table({
  //   includeUser: meta.includeUser ?? true,
  //   encryptEnabled: meta.encryptEnabled ?? true,
  //   isProfileCall: meta.isProfileCall ?? false,
  //   shouldDecrypt: meta.decrypt ?? true,
  //   isFileUpload: meta.isFileUpload ?? false,
  //   noEncrypt: JSON.stringify(meta.noEncrypt ?? []),
  //   extraPayload: meta.extraPayload ? JSON.stringify(meta.extraPayload) : 'null',
  // });

  // ── Raw body (what you actually sent before encryption) ───────────────────
  // console.log('%cRaw Body (before encryption)', 'color:#888; font-size:11px; text-transform:uppercase;');
  // console.log(rawBody);

  // // ── Encrypted payload fields ──────────────────────────────────────────────
  // console.log('%cEncrypted Payload Fields Sent', 'color:#888; font-size:11px; text-transform:uppercase;');
  // const payloadSummary: Record<string, string> = {};
  // for (const [key, val] of Object.entries(encryptedPayload)) {
  //   payloadSummary[key] = typeof val === 'string'
  //     ? `[encrypted — ${val.length} chars] ${val.slice(0, 40)}...`
  //     : String(val);
  // }
  // console.table(payloadSummary);

  console.groupEnd();
}
// ─── Replacement function for encrypted values ───────────────────────────────

/**
 * Replaces special characters in encrypted string with placeholder strings
 * to ensure safe transmission in URLs and forms.
 * 
 * Replacement mapping:
 * '/' -> 'abcd'
 * '+' -> 'efgh'
 * '&' -> 'ijkl'
 * '?' -> 'mnop'
 * ' ' -> 'qrst'
 * '=' -> 'uvwx'
 */
const replaceSpecialChars = (value: string): string => {
  if (!value) return value;

  let fixed = value;
  fixed = fixed.replace(/\//g, 'abcd');  // Replace '/' with 'abcd'
  fixed = fixed.replace(/\+/g, 'efgh');  // Replace '+' with 'efgh'
  fixed = fixed.replace(/&/g, 'ijkl');   // Replace '&' with 'ijkl'
  fixed = fixed.replace(/\?/g, 'mnop');  // Replace '?' with 'mnop'
  fixed = fixed.replace(/ /g, 'qrst');   // Replace space with 'qrst'
  fixed = fixed.replace(/=/g, 'uvwx');   // Replace '=' with 'uvwx'

  return fixed;
};

// ─── Small utilities ──────────────────────────────────────────────────────────

const getMasterKey = (isProfileCall: boolean): string =>
  isProfileCall ? PROFILE_KEY : getDynamicKey() ?? PROFILE_KEY;

const getSessionId = (): string => Cookies.get("sessionId") ?? "0";

const getReferrer = (): string => document.referrer || "";

const getCallerUrl = (caller?: string): string =>
  caller?.startsWith("http")
    ? caller
    : caller
      ? `${window.location.origin}${caller}`
      : window.location.href;

const buildClientVariable = (): ClientVariable => ({
  HTTP_USER_AGENT: navigator.userAgent,
  HTTP_REFERER: getReferrer(),
  QUERY_STRING: window.location.search,
  HTTPS: window.location.protocol,
  PATH_INFO: window.location.pathname,
  HTTP_HOST: window.location.host,
});

/**
 * Merge DEFAULT_HEADERS + per-call extras + Content-Type.
 * Content-Type is omitted for FormData so the browser sets the boundary automatically.
 */
const buildHeaders = (
  extra: Record<string, string> = {},
  isFileUpload = false
): Record<string, string> => ({
  ...DEFAULT_HEADERS,
  ...extra,
  ...(!isFileUpload ? { "Content-Type": "application/json" } : {}),
});

// ─── Location helper ──────────────────────────────────────────────────────────

const getLocationData = (): LocationData => {
  try {
    const state = getStore().getState() as { auth?: { locationData?: Partial<LocationData> } };
    const loc = state.auth?.locationData ?? {};
    return {
      Latitude: loc.Latitude ?? null,
      Longitude: loc.Longitude ?? null,
      Timestamp: loc.Timestamp ?? new Date().toISOString(),
      Accuracy: loc.Accuracy ?? null,
      Altitude: loc.Altitude ?? null,
      AltitudeAccuracy: loc.AltitudeAccuracy ?? null,
      Heading: loc.Heading ?? null,
      Speed: loc.Speed ?? null,
      Location_Shared: loc.Location_Shared ?? null,
    };
  } catch {
    return {
      Latitude: null, Longitude: null,
      Timestamp: new Date().toISOString(),
      Accuracy: null, Altitude: null,
      AltitudeAccuracy: null, Heading: null,
      Speed: null, Location_Shared: null,
    };
  }
};

// ─── Server variables ─────────────────────────────────────────────────────────

const getServerVars = (): Record<string, string> | null => {
  const raw = Cookies.get("server_variables");
  if (!raw) return null;
  try {
    return decryptResponse(raw) as Record<string, string>;
  } catch {
    return null;
  }
};

// ─── User data ────────────────────────────────────────────────────────────────

const getUserRaw = (masterKey: string): UserRaw | null => {
  try {
    const state = getStore().getState() as {
      auth?: {
        userData?: { Return?: string };
        verifyData?: { Return?: string };
      };
    };
    const userData = state.auth?.userData ?? {};
    const verifyData = state.auth?.verifyData ?? {};

    const fromUser = userData.Return
      ? (decrypt(userData.Return, masterKey) as { User?: { tblUser?: UserRaw[] } })
      : (userData as { User?: { tblUser?: UserRaw[] } });

    const fromVerify = verifyData.Return
      ? (decrypt(verifyData.Return, masterKey) as { User?: { tblUser?: UserRaw[] } })
      : (verifyData as { User?: { tblUser?: UserRaw[] } });

    return fromUser?.User?.tblUser?.[0] ?? fromVerify?.User?.tblUser?.[0] ?? null;
  } catch {
    return null;
  }
};

// ─── Setup block ─────────────────────────────────────────────────────────────

const buildSetup = (): SetupBlock => {
  const loc = getLocationData();
  const serverVars = getServerVars();
  return {
    Application_Id: APP_CONFIG.APPLICATION_ID,
    Installation_Id: 0,
    Session_Id: getSessionId(),
    Place_Id: 0,
    Location: loc.Latitude && loc.Longitude ? loc : null,
    Location_Shared: loc.Location_Shared,
    Client_Variable: buildClientVariable(),
    Server_Variable: serverVars,
    IPAddress: (serverVars?.["CF-Connecting-IP"]) ?? null,
    UserAgent: navigator.userAgent,
    CallerURL: getCallerUrl(),
    RefererURL: getReferrer(),
    Caller: "Web",
  };
};

// ─── Payload builder ──────────────────────────────────────────────────────────

async function buildEncryptedPayload(
  data: unknown,
  options: BuildPayloadOptions = {}
): Promise<EncryptedPayload> {
  const {
    includeUser = true,
    encryptEnabled = true,
    isProfileCall = false,
    extraPayload = null,
    noEncrypt = [],
  } = options;

  // console.log(noEncrypt)
  const masterKey = getMasterKey(isProfileCall);

  // ── Build raw blocks ──────────────────────────────────────────────────────
  const setupObj: SetupBlock = buildSetup();
  const requestObj: unknown = data ?? {};
  const userRaw: UserRaw | null = includeUser ? getUserRaw(masterKey) : null;
  const userObj: UserBlock | null = includeUser
    ? {
      User_Id: userRaw?.User_Id ?? 1,
      User_Type_Id: userRaw?.User_Type_Id ?? 0,
      Company_Id: userRaw?.Company_Id ?? 1,
    }
    : null;

  // ── Log raw values ────────────────────────────────────────────────────────
  log.raw("📦 RAW Setup:", JSON.stringify(setupObj));
  log.raw("📨 RAW Request:", JSON.stringify(requestObj));
  if (userObj) log.raw("👤 RAW User:", JSON.stringify(userObj));

  const setupStr: string = JSON.stringify(setupObj);
  const requestStr: string = JSON.stringify(requestObj);
  const userStr: string | null = userObj ? JSON.stringify(userObj) : null;

  // ── Plain-text path ───────────────────────────────────────────────────────
  if (!encryptEnabled) {
    log.warn("⚠️ Encryption disabled — sending plaintext");
    // log.groupEnd();
    return {
      setup: setupStr,
      request: requestStr,
      ...(userStr ? { user: userStr } : {}),
    };
  }
  // ── Per-field encryption — skip fields listed in noEncrypt ──────────
  const encryptField = (str: string, fieldName: 'setup' | 'request' | 'user'): string => {
    if (noEncrypt.includes(fieldName)) {
      log.warn(`⚠️ Skipping encryption for field: "${fieldName}"`);
      return str;   // plain text
    }
    return encrypt(str, masterKey);
  };
  // ── Encrypted path ────────────────────────────────────────────────────────
  // let encSetup:   string = encrypt(setupStr,   masterKey);
  // let encRequest: string = encrypt(requestStr, masterKey);
  // // let encRequest: string = requestStr;
  // let encUser:    string | null = userStr ? encrypt(userStr, masterKey) : null;
  const encSetup = encryptField(setupStr, 'setup');
  const encRequest = encryptField(requestStr, 'request');
  const encUser = userStr ? encryptField(userStr, 'user') : null;
  // Apply replacement to encrypted values
  log.encrypted("🔐 Original Encrypted Setup (before replacement):", encSetup);
  log.encrypted("🔐 Original Encrypted Request (before replacement):", encRequest);
  if (encUser) log.encrypted("🔐 Original Encrypted User (before replacement):", encUser);

  // encSetup = replaceSpecialChars(encSetup);
  // encRequest = replaceSpecialChars(encRequest);
  // if (encUser) encUser = replaceSpecialChars(encUser);

  // log.encrypted("🔐 Encrypted Setup After Replacement:", encSetup);
  // log.encrypted("🔐 Encrypted Request After Replacement:", encRequest);
  // if (encUser) log.encrypted("🔐 Encrypted User After Replacement:", encUser);

  const result: EncryptedPayload = {
    setup: encSetup,
    request: encRequest,
    ...(encUser ? { user: encUser } : {}),
  };

  if (extraPayload) {
    for (const [key, val] of Object.entries(extraPayload)) {
      let encVal = encrypt(JSON.stringify(val), masterKey);
      log.encrypted(`🔐 Original Encrypted Extra "${key}" (before replacement):`, encVal);
      encVal = replaceSpecialChars(encVal);
      result[key] = encVal;
      log.encrypted(`🔐 Encrypted Extra "${key}" After Replacement:`, encVal);
    }
  }

  // log.success("✅ Payload built successfully");
  log.groupEnd();
  return result;
}

async function buildFileUploadBody(
  body: FormData,
  options: BuildPayloadOptions
): Promise<FormData> {
  const call = body.get("Call") as string | null;
  const eo = body.get("EO") as string | null;
  const rawDets = body.get("Details") as string | null;
  const files = body.getAll("Files");
  const details = rawDets ? (JSON.parse(rawDets) as Record<string, unknown>) : {};

  console.log(" Extracted Data: ");
  console.log("  - Call:", call);
  console.log("  - EO:", eo);
  console.log("  - Files count:", files.length);
  const encrypted = await buildEncryptedPayload(
    { Call: call, EO: Number(eo), Details: details },
    options
  );
  console.log("  - Details:", encrypted);

  const fd = new FormData();
  fd.append("Setup", encrypted.setup);
  fd.append("Request", encrypted.request);
  if (encrypted.user) fd.append("User", encrypted.user);
  files.forEach((file, idx) => {
    if (file instanceof File) {
      fd.append("Files", file);
      // console.log(`  File ${idx + 1}:`, {
      //   name: file.name,
      //   type: file.type,
      //   size: `${(file.size / 1024).toFixed(2)} KB`,
      //   lastModified: new Date(file.lastModified).toISOString()
      // });
    }
  });
  console.log("📦 Final FormData contents:");
  for (const [key, value] of fd.entries()) {
    if (value instanceof File) {
      console.log(`${key}:`, {
        name: value.name,
        type: value.type,
        size: `${(value.size / 1024).toFixed(2)} KB`,
      });
    } else {
      console.log(`${key}:`, value);
    }
  }
  return fd;
}

// ─── Side-effect handlers ─────────────────────────────────────────────────────

function handleSpecialResponses(decrypted: DecryptedResponse, requestBody: any, rawData?: any): void {
  if (requestBody && requestBody.Call) {
    log.raw( requestBody.Call);
  }
  // console.log("handleSpecialResponses", decrypted);
  // Dynamic key and Unlock logic
  if (decrypted?.Call === "Application_Profile_Get" || requestBody?.Call === "Application_Profile_Get") {
    const profile = decrypted?.Return?.Application_Profile ?? [];
    const dk = profile.find((i) => i.Key === "Dk")?.Value;
    if (dk) {
      setDynamicKey(dk);
      log.success("🗝️ Dynamic key updated");
    }

    // 🔥 CACHE: Store the raw encrypted response for future sessions
    if (rawData) {
      sessionStorage.setItem("app_profile_encrypted", JSON.stringify(rawData));
      log.info("💾 Profile encrypted data cached in sessionStorage");
    }

    markAppProfileReady();
  }
  // Session ID rotation
  const newSession = decrypted?.Result?.Session_Id;
  if (newSession && Cookies.get("sessionId") !== String(newSession)) {
    Cookies.set("sessionId", String(newSession), {
      secure: true, sameSite: "Strict", expires: 1,
    });
    log.info("🍪 Session ID rotated");
  }
  // Location prompt
  if (decrypted?.Result?.Action_Items?.Ask_Location_Share === null) {
    window.dispatchEvent(
      new CustomEvent("showLocationModal", {
        detail: {
          title: "Share Your Location",
          message: "We'd like to access your location to improve your experience.",
          type: "confirm",
        },
      })
    );
  }
}

function handleLogout(): void {
  Cookies.remove("sessionId");
  localStorage.removeItem("userData");
  window.dispatchEvent(
    new CustomEvent("showLogoutModal", {
      detail: {
        title: "Session Expired",
        message: "Your session has expired. Redirecting to sign-in page...",
        duration: 2000,
        redirectTo: "/signin",
      },
    })
  );
}

// ─── Base-query factory ───────────────────────────────────────────────────────

const makeBaseQuery = (headers: Record<string, string>) =>
  fetchBaseQuery({
    baseUrl: APP_CONFIG.BASE_URL,
    prepareHeaders: (h) => {
      Object.entries(headers).forEach(([k, v]) => h.set(k, v));
      return h;
    },
  });

// ─── Main encrypted base query ────────────────────────────────────────────────

export const encryptedBaseQuery: BaseQueryFn<
  QueryArgs,
  unknown,
  ApiError
> = async (args, api, extraOptions) => {
  const {
    url,
    method = "POST",
    body,
    params,
    headers: argHeaders = {},
    meta = {},
  } = args;

  const {
    includeUser = true,
    encryptEnabled = true,
    isProfileCall = false,
    decrypt: shouldDecrypt = true,
    extraPayload = null,
    isFileUpload = false,
    headers: metaHeaders = {},
    noEncrypt = [],
  } = meta;

  const extraHeaders: Record<string, string> = { ...argHeaders, ...metaHeaders };

  // 🔥 BLOCKING LOGIC: Wait for profile data before any other API call
  if (!isProfileCall) {
    await appProfileReady;
  }
  // ── GET — no encryption ───────────────────────────────────────────────────
  if (method.toUpperCase() === "GET") {
    log.info(`📡 GET ${url}`);
    const result = await makeBaseQuery(buildHeaders(extraHeaders))(
      { url, method, params },
      api,
      extraOptions
    );
    if (result.error) log.error(`❌ GET failed [${url}]`, result.error);
    return result;
  }

  // ── POST / encrypted ──────────────────────────────────────────────────────
  // log.group(`🚀 API Call — ${method} ${url}`);

  try {
    const payloadOptions: BuildPayloadOptions = {
      includeUser,
      encryptEnabled,
      isProfileCall,
      extraPayload, noEncrypt,

    };
    const startTime = performance.now();
    // console.log("res", isFileUpload, isFileUpload && body instanceof FormData)
    const requestBody =
      isFileUpload && body instanceof FormData
        ? await buildFileUploadBody(body, payloadOptions)
        : await buildEncryptedPayload(body, payloadOptions);
    if (!isFileUpload) {
      logApiCall({
        method,
        url,
        fullUrl: `${APP_CONFIG.BASE_URL}${url}`,
        headers: buildHeaders(extraHeaders, isFileUpload),
        meta: {
          includeUser, encryptEnabled, isProfileCall,
          decrypt: shouldDecrypt, extraPayload, isFileUpload,
          noEncrypt,
        },
        rawBody: body,
        encryptedPayload: requestBody as EncryptedPayload,
        startTime,
      });
    }
    const result = await makeBaseQuery(buildHeaders(extraHeaders, isFileUpload))(
      { url, method, body: requestBody, params },
      api,
      extraOptions
    );

    // ── Error path ────────────────────────────────────────────────────────────
    if (result.error) {
      log.error(`❌ API error [${url}] status=${result.error.status}`);
      if (result.error.data && shouldDecrypt) {
        try {
          const decryptedErr = await decryptResponse(result.error.data) as DecryptedResponse;
          result.error.data = decryptedErr;
          log.decrypted("🔓 Decrypted Error Response:", decryptedErr);
          if (decryptedErr?.Result?.Action_Items?.Logout === 1) handleLogout();
        } catch {
          log.warn("⚠️ Could not decrypt error response — keeping raw");
        }
      }
      if (isProfileCall) {
        log.error("❌ Profile call failed - Unblocking app anyway to avoid freeze");
        markAppProfileReady();
      }
      log.groupEnd();
      return result;
    }

    // ── Success — decrypt response ────────────────────────────────────────────
    if (result.data && shouldDecrypt) {
      try {
        const decrypted = await decryptResponse(result.data) as any;
        
        // Normalize response: many APIs return [ { Return, Footer, Helmet, etc. } ]
        // We unwrap the first element to provide a consistent object structure
        const normalizedData = Array.isArray(decrypted) && decrypted.length > 0 ? decrypted[0] : decrypted;
        
        result.data = normalizedData;
        log.decrypted("🔓 Decrypted API Response:", normalizedData);
        handleSpecialResponses(normalizedData, body, result.data);
        if (decrypted?.Result?.Action_Items?.Logout === 1) {
          log.error("🚪 Session expired — logging out");
          handleLogout();
          log.groupEnd();
          return { error: { status: 401, data: { message: "Session expired" } } as ApiError };
        }
      } catch (err) {
        log.error("❌ Failed to decrypt response", err);
      }
    }

    // log.success(`✅ ${url} completed`);
    log.groupEnd();
    return result;
  } catch (err) {
    log.error("❌ Unexpected error", err);
    log.groupEnd();
    return { error: { status: 500, data: err } as ApiError };
  }
};