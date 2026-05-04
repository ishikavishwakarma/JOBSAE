// types/api.types.ts

// Base request structure
export interface BuildPayloadOptions {
  includeUser?: boolean;
  encryptEnabled?: boolean;
  isProfileCall?: boolean;
  extraPayload?: Record<string, any>;
  noEncrypt?:      Array<'setup' | 'request' | 'user'>;
}
export interface EncryptedPayload {
  setup: string;
  request: string;
  user?: string;
  [key: string]: any;
}

export interface ApiError {
  data?: any;
  status?: number;
  logout?: boolean;
}
export interface EncryptionOptions {
    excludeFields?: ('setup' | 'user' | 'request')[];
}

export interface CallOptions {
    meta?: {
        encryptionOptions?: EncryptionOptions;
    };
}
export interface QueryMeta {
  includeUser?: boolean;
  encryptEnabled?: boolean;
  isProfileCall?: boolean;
  decrypt?: boolean;
  extraPayload?: Record<string, unknown>;
  isFileUpload?: boolean;
  headers?: Record<string, string>;
  noEncrypt?: Array<'setup' | 'request' | 'user'>;  // ← new field
}