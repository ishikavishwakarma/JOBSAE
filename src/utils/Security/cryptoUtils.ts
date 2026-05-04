// utils/security/cryptoUtils.ts

// Types for the stored values
type DynamicKey = string | null;
type StripeKey = string | null;
type ImageUrlRoot = string | null;
type LogoImg = any | null; // You can define a more specific type if needed
type CarouselImgs = any | null; // You can define a more specific type if needed

// Module-level variables (singleton pattern)
let dynamicKey: DynamicKey = null;
let stripePublishableKey: StripeKey = null;
let imageUrlRoot: ImageUrlRoot = null;
let logoImg: LogoImg = null;
let carouselImgs: CarouselImgs = null;

// Dynamic Key setters and getters
export const setDynamicKey = (key: string): void => {
  dynamicKey = key;
};

export const getDynamicKey = (): DynamicKey => {
  return dynamicKey;
};

// Stripe Publishable Key setters and getters
export const setStripePublishableKey = (key: string): void => {
  stripePublishableKey = key;
};

export const getStripePublishableKey = (): StripeKey => {
  return stripePublishableKey;
};

// Image URL Root setters and getters
export const setImageUrlRoot = (val: string): void => {
  imageUrlRoot = val;
};

export const getImageUrlRoot = (): ImageUrlRoot => {
  return imageUrlRoot;
};

// Logo Image setters and getters
export const setLogoImg = (val: any): void => {
  logoImg = val;
};

export const getLogoImg = (): LogoImg => {
  return logoImg;
};

// Carousel Images setters and getters
export const setCarouselImgs = (val: any): void => {
  carouselImgs = val;
};

export const getCarouselImgs = (): CarouselImgs => {
  return carouselImgs;
};

// Optional: Clear all stored values (useful for logout)
export const clearAllCryptoData = (): void => {
  dynamicKey = null;
  stripePublishableKey = null;
  imageUrlRoot = null;
  logoImg = null;
  carouselImgs = null;
};

// Optional: Check if dynamic key is available
export const isDynamicKeyAvailable = (): boolean => {
  return dynamicKey !== null && dynamicKey !== undefined && dynamicKey !== '';
};

// Optional: Get all crypto data at once
export const getAllCryptoData = (): {
  dynamicKey: DynamicKey;
  stripePublishableKey: StripeKey;
  imageUrlRoot: ImageUrlRoot;
  logoImg: LogoImg;
  carouselImgs: CarouselImgs;
} => {
  return {
    dynamicKey,
    stripePublishableKey,
    imageUrlRoot,
    logoImg,
    carouselImgs,
  };
};

// Optional: Set all crypto data at once (useful for restoring from storage)
export const setAllCryptoData = (data: {
  dynamicKey?: string;
  stripePublishableKey?: string;
  imageUrlRoot?: string;
  logoImg?: any;
  carouselImgs?: any;
}): void => {
  if (data.dynamicKey !== undefined) dynamicKey = data.dynamicKey;
  if (data.stripePublishableKey !== undefined) stripePublishableKey = data.stripePublishableKey;
  if (data.imageUrlRoot !== undefined) imageUrlRoot = data.imageUrlRoot;
  if (data.logoImg !== undefined) logoImg = data.logoImg;
  if (data.carouselImgs !== undefined) carouselImgs = data.carouselImgs;
};