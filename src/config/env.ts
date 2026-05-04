// types.ts or you can define inline
interface EnvironmentConfig {
  BASE_URL: string | undefined;
  IMAGE_URL: string | undefined;
  APPLICATION_ID: string | undefined;
}

interface EnvironmentMap {
  LOCAL: EnvironmentConfig;
  DEVELOPMENT: EnvironmentConfig;
  PRODUCTION: EnvironmentConfig;
}

interface AppConfig {
  BRAND: string | undefined;
  BASE_URL: string | undefined;
  IMAGE_URL: string | undefined;
  APPLICATION_ID: number | undefined;
  GOOGLE_CLIENT_ID: string | undefined;
  FACEBOOK_APP_ID: string | undefined;
  STRIPE_KEY: string | undefined;
  STRIPE_MERCHANT_ID: string | undefined;
  STRIPE_MERCHANT_NAME: string | undefined;
  ENCRYPTION_KEY: string | undefined;
  START_ENCRYPTION_KEY: string | undefined;
}

const PROCESS: string = import.meta.env.VITE_PROCESS || "LOCAL";

const ENV: EnvironmentMap = {
  LOCAL: {
    BASE_URL: import.meta.env.VITE_LOCAL_BASE_URI,
    IMAGE_URL: import.meta.env.VITE_LOCAL_IMAGE_BASE_URL,
    APPLICATION_ID: import.meta.env.VITE_LOCAL_APPLICATION_ID,
  },
  DEVELOPMENT: {
    BASE_URL: import.meta.env.VITE_DEV_BASE_URI,
    IMAGE_URL: import.meta.env.VITE_DEV_IMAGE_BASE_URL,
    APPLICATION_ID: import.meta.env.VITE_DEV_APPLICATION_ID, // change if needed
  },
  PRODUCTION: {
    BASE_URL: import.meta.env.VITE_PROD_BASE_URI,
    IMAGE_URL: import.meta.env.VITE_PROD_IMAGE_BASE_URL,
    APPLICATION_ID: import.meta.env.VITE_PROD_APPLICATION_ID,
  },
};

export const APP_CONFIG: AppConfig = {
  BRAND: import.meta.env.VITE_BRAND,
  BASE_URL: ENV[PROCESS as keyof EnvironmentMap]?.BASE_URL,
  IMAGE_URL: ENV[PROCESS as keyof EnvironmentMap]?.IMAGE_URL,
  APPLICATION_ID: Number(ENV[PROCESS as keyof EnvironmentMap]?.APPLICATION_ID),
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID,
  FACEBOOK_APP_ID: import.meta.env.VITE_FACEBOOK_AUTH_APP_ID,
  STRIPE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  STRIPE_MERCHANT_ID: import.meta.env.VITE_STRIPE_MERCHANT_ID,
  STRIPE_MERCHANT_NAME: import.meta.env.VITE_STRIPE_MERCHANT_NAME,
  ENCRYPTION_KEY: import.meta.env.VITE_ENCRYPTION_KEY,
  START_ENCRYPTION_KEY: import.meta.env.VITE_START_ENCRYPTION_KEY,
};