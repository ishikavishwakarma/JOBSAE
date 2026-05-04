// import CryptoJS from "crypto-js";

// const constantTimeCompare = (a, b) => {
//   if (a.sigBytes !== b.sigBytes) return false;
//   let result = 0;
//   for (let i = 0; i < a.words.length; i++) {
//     result |= a.words[i] ^ b.words[i];
//   }
//   return result === 0;
// };

// /* ------------------- 🔐 SPLIT EXISTING MASTER KEY ------------------- */
// const splitMasterKey = (keyBase64) => {
//    if (!keyBase64 || typeof keyBase64 !== "string") {
//     throw new Error("Master key is missing or invalid");
//   }

//   const masterKey = CryptoJS.enc.Base64.parse(keyBase64);
//   if (masterKey.sigBytes !== 32)
//     throw new Error("Master key must be 256 bits (32 bytes)");
//   const encryptionKey = CryptoJS.lib.WordArray.create(
//     masterKey.words.slice(0, 4)
//   );
//   const macKey = CryptoJS.lib.WordArray.create(masterKey.words.slice(4, 8));
//   return { encryptionKey, macKey };
// };

// /* ----------------------- 🔐 ENCRYPT ------------------------ */
// export const encrypt = (plaintext, keyBase64) => {
//   const { encryptionKey, macKey } = splitMasterKey(keyBase64);
//   const iv = CryptoJS.lib.WordArray.random(16);
//   const ciphertextObj = CryptoJS.AES.encrypt(plaintext, encryptionKey, {
//     iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   });

//   const ciphertext = ciphertextObj.ciphertext;
//   const hmac = CryptoJS.HmacSHA256(iv.clone().concat(ciphertext), macKey);
//   const finalResult = iv.clone().concat(ciphertext).concat(hmac);
//   return CryptoJS.enc.Base64.stringify(finalResult);
// };
// const ENCRYPT_KEYS = [
//   "Footer",
//   "Helmet",
//   "Message",
//   "Result",
//   "Return",
//   "Script",
//   "Search",
// ];
// export const encryptValuesOnly = (data, encryptFn, masterKey) => {
//   const encryptedData = { ...data };
//   ENCRYPT_KEYS.forEach((key) => {
//     const value = encryptedData[key];
//     if (value !== null && value !== undefined) {
//       encryptedData[key] = encrypt(
//         JSON.stringify(value),
//         masterKey
//       );
//     }
//   });

//   return encryptedData;
// };


// /* ----------------------- 🔐 DECRYPT ------------------------ */
// export const decrypt = (encryptedBase64, keyBase64) => {
//   const { encryptionKey, macKey } = splitMasterKey(keyBase64);

//   const encryptedData = CryptoJS.enc.Base64.parse(encryptedBase64);

//   const IV_SIZE = 16;
//   const HMAC_SIZE = 32;

//   if (encryptedData.sigBytes < IV_SIZE + HMAC_SIZE)
//     throw new Error("Invalid encrypted payload");

//   const iv = CryptoJS.lib.WordArray.create(encryptedData.words.slice(0, 4), 16);

//   const ciphertextLength = encryptedData.sigBytes - IV_SIZE - HMAC_SIZE;
//   const ciphertext = CryptoJS.lib.WordArray.create(
//     encryptedData.words.slice(4, 4 + Math.ceil(ciphertextLength / 4)),
//     ciphertextLength
//   );

//   const receivedHmac = CryptoJS.lib.WordArray.create(
//     encryptedData.words.slice(-8),
//     32
//   );

//   const computedHmac = CryptoJS.HmacSHA256(
//     iv.clone().concat(ciphertext),
//     macKey
//   );

//   if (!constantTimeCompare(receivedHmac, computedHmac))
//     throw new Error("HMAC failed — tampered or corrupted");

//   const decrypted = CryptoJS.AES.decrypt({ ciphertext }, encryptionKey, {
//     iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   });

//   return decrypted.toString(CryptoJS.enc.Utf8);
// };
// utils/encryption.ts
import CryptoJS from "crypto-js";

// Type definitions
type WordArray = CryptoJS.lib.WordArray;
type CipherParams = CryptoJS.lib.CipherParams;

interface MasterKeyParts {
  encryptionKey: WordArray;
  macKey: WordArray;
}

interface EncryptedData {
  [key: string]: any;
}

// Constants
const IV_SIZE = 16;
const HMAC_SIZE = 32;
const ENCRYPT_KEYS = [
  "Footer",
  "Helmet",
  "Message",
  "Result",
  "Return",
  "Script",
  "Search",
] as const;

type EncryptKey = typeof ENCRYPT_KEYS[number];

/**
 * Constant time comparison to prevent timing attacks
 */
const constantTimeCompare = (a: WordArray, b: WordArray): boolean => {
  if (a.sigBytes !== b.sigBytes) return false;
  let result = 0;
  for (let i = 0; i < a.words.length; i++) {
    result |= a.words[i] ^ b.words[i];
  }
  return result === 0;
};

/**
 * Split master key into encryption key and HMAC key
 * @param keyBase64 - Base64 encoded master key (32 bytes)
 * @returns Object containing encryptionKey and macKey
 */
const splitMasterKey = (keyBase64: string): MasterKeyParts => {
  if (!keyBase64 || typeof keyBase64 !== "string") {
    throw new Error("Master key is missing or invalid");
  }

  const masterKey = CryptoJS.enc.Base64.parse(keyBase64);
  
  if (masterKey.sigBytes !== 32) {
    throw new Error("Master key must be 256 bits (32 bytes)");
  }
  
  // Split into two 16-byte keys (first half for encryption, second half for MAC)
  const encryptionKey = CryptoJS.lib.WordArray.create(
    masterKey.words.slice(0, 4)
  );
  const macKey = CryptoJS.lib.WordArray.create(
    masterKey.words.slice(4, 8)
  );
  
  return { encryptionKey, macKey };
};

/**
 * Encrypt plaintext using AES-256-CBC with HMAC authentication
 * @param plaintext - String to encrypt
 * @param keyBase64 - Base64 encoded master key
 * @returns Base64 encoded encrypted string (IV + Ciphertext + HMAC)
 */
export const encrypt = (plaintext: string, keyBase64: string): string => {
  const { encryptionKey, macKey } = splitMasterKey(keyBase64);
  
  // Generate random IV (16 bytes)
  const iv = CryptoJS.lib.WordArray.random(IV_SIZE);
  
  // Encrypt the plaintext
  const ciphertextObj: CipherParams = CryptoJS.AES.encrypt(plaintext, encryptionKey, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const ciphertext = ciphertextObj.ciphertext;
  
  // Create HMAC of IV + ciphertext
  const hmac = CryptoJS.HmacSHA256(iv.clone().concat(ciphertext), macKey);
  
  // Combine IV + ciphertext + HMAC
  const finalResult = iv.clone().concat(ciphertext).concat(hmac);
  
  // Return as Base64 string
  return CryptoJS.enc.Base64.stringify(finalResult);
};

/**
 * Decrypt encrypted Base64 string
 * @param encryptedBase64 - Base64 encoded encrypted string (IV + Ciphertext + HMAC)
 * @param keyBase64 - Base64 encoded master key
 * @returns Decrypted plaintext string
 */
export const decrypt = (encryptedBase64: string, keyBase64: string): string => {
  const { encryptionKey, macKey } = splitMasterKey(keyBase64);

  // Parse the Base64 encoded encrypted data
  const encryptedData = CryptoJS.enc.Base64.parse(encryptedBase64);

  // Validate minimum length (IV + HMAC)
  if (encryptedData.sigBytes < IV_SIZE + HMAC_SIZE) {
    throw new Error("Invalid encrypted payload: too short");
  }

  // Extract IV (first 16 bytes)
  const iv = CryptoJS.lib.WordArray.create(
    encryptedData.words.slice(0, 4),
    IV_SIZE
  );

  // Extract ciphertext (everything between IV and HMAC)
  const ciphertextLength = encryptedData.sigBytes - IV_SIZE - HMAC_SIZE;
  const ciphertext = CryptoJS.lib.WordArray.create(
    encryptedData.words.slice(4, 4 + Math.ceil(ciphertextLength / 4)),
    ciphertextLength
  );

  // Extract received HMAC (last 32 bytes)
  const receivedHmac = CryptoJS.lib.WordArray.create(
    encryptedData.words.slice(-8),
    HMAC_SIZE
  );

  // Compute HMAC of IV + ciphertext
  const computedHmac = CryptoJS.HmacSHA256(
    iv.clone().concat(ciphertext),
    macKey
  );

  // Constant time comparison to prevent timing attacks
  if (!constantTimeCompare(receivedHmac, computedHmac)) {
    throw new Error("HMAC verification failed — data may have been tampered with");
  }

  // Decrypt the ciphertext
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext } as CipherParams,
    encryptionKey,
    {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  // Return as UTF-8 string
  return decrypted.toString(CryptoJS.enc.Utf8);
};

/**
 * Encrypt only specific fields in an object
 * @param data - Object containing data to encrypt
 * @param encryptFn - Encryption function to use
 * @param masterKey - Master key for encryption
 * @returns Object with specified fields encrypted
 */
export const encryptValuesOnly = <T extends EncryptedData>(
  data: T,
  encryptFn: (plaintext: string, key: string) => string,
  masterKey: string
): T => {
  const encryptedData = { ...data } as T;
  
  ENCRYPT_KEYS.forEach((key) => {
    const value = encryptedData[key];
    if (value !== null && value !== undefined) {
      try {
        encryptedData[key] = encryptFn(
          JSON.stringify(value),
          masterKey
        ) as any;
      } catch (error) {
        console.error(`Failed to encrypt field "${key}":`, error);
        // Keep original value if encryption fails
        encryptedData[key] = value;
      }
    }
  });

  return encryptedData;
};

/**
 * Decrypt specific fields in an object
 * @param data - Object containing encrypted fields
 * @param decryptFn - Decryption function to use
 * @param masterKey - Master key for decryption
 * @returns Object with specified fields decrypted
 */
export const decryptValuesOnly = <T extends EncryptedData>(
  data: T,
  decryptFn: (encrypted: string, key: string) => string,
  masterKey: string
): T => {
  const decryptedData = { ...data } as T;
  
  ENCRYPT_KEYS.forEach((key) => {
    const value = decryptedData[key];
    if (typeof value === 'string' && value.length > 0) {
      try {
        const decrypted = decryptFn(value, masterKey);
        decryptedData[key] = JSON.parse(decrypted);
      } catch (error) {
        console.error(`Failed to decrypt field "${key}":`, error);
        // Keep original value if decryption fails
        decryptedData[key] = value;
      }
    }
  });

  return decryptedData;
};

/**
 * Check if a string is valid Base64
 */
const isValidBase64 = (str: string): boolean => {
  const base64Regex = /^[A-Za-z0-9+/]+=*$/;
  return base64Regex.test(str);
};

/**
 * Validate encrypted payload structure
 */
export const validateEncryptedPayload = (encryptedBase64: string): boolean => {
  try {
    if (!encryptedBase64 || typeof encryptedBase64 !== 'string') {
      return false;
    }
    
    if (!isValidBase64(encryptedBase64)) {
      return false;
    }
    
    const encryptedData = CryptoJS.enc.Base64.parse(encryptedBase64);
    return encryptedData.sigBytes >= IV_SIZE + HMAC_SIZE;
  } catch {
    return false;
  }
};

/**
 * Encrypt object (convenience wrapper)
 */
export const encryptObject = <T extends object>(
  obj: T,
  keyBase64: string
): string => {
  const jsonString = JSON.stringify(obj);
  return encrypt(jsonString, keyBase64);
};

/**
 * Decrypt to object (convenience wrapper)
 */
export const decryptObject = <T = any>(
  encryptedBase64: string,
  keyBase64: string
): T => {
  const decrypted = decrypt(encryptedBase64, keyBase64);
  return JSON.parse(decrypted) as T;
};

// Export types for external use
export type { MasterKeyParts, EncryptedData, EncryptKey };