import { decryptResponse } from "../helpers/apiHelper";
import { 
  setDynamicKey, 
  setStripePublishableKey, 
  setImageUrlRoot, 
  setLogoImg, 
  setCarouselImgs 
} from "./cryptoUtils";
import { markAppProfileReady } from "./appInit";
import { authApi } from "../../services/redux/apis/authApi";

/**
 * Helper to safely parse JSON strings or return the value
 */
const ForApplication = (val: any) => {
  try {
    return typeof val === "string" ? JSON.parse(val) : val;
  } catch (err) {
    return val;
  }
};

/**
 * Thunk to load application profile if not already in sessionStorage.
 * This prevents multiple API calls on every page refresh.
 */
export const loadApplicationProfileIfNeeded = () => async (dispatch: any) => {
  const existing = sessionStorage.getItem("app_profile_encrypted");

  if (existing) {
    try {
      // console.log("📦 Restoring profile from sessionStorage...");
      const stringData = JSON.parse(existing);
      const dataOfApp = decryptResponse(stringData);
      
      // The decrypted response contains Return.Application_Profile
      const decryptedProfile = dataOfApp?.Return?.Application_Profile;
      
      if (decryptedProfile && Array.isArray(decryptedProfile)) {
        // 🗝️ Restore Dynamic Key
        const dkItem = decryptedProfile.find((item: any) => item.Key === "Dk");
        if (dkItem?.Value) setDynamicKey(dkItem.Value);

        // 💳 Restore Stripe Key
        const stripeItem = decryptedProfile.find(
          (item: any) => item.Key === "Stripe_HW_Publishable_Key"
        );
        if (stripeItem?.Value) setStripePublishableKey(stripeItem.Value);

        // 🖼️ Restore Image Root
        const imageRootItem = decryptedProfile.find(
          (item: any) => item.Key === "Image_Url_Root"
        );
        if (imageRootItem?.Value) setImageUrlRoot(imageRootItem.Value);

        // 🏷️ Restore Logo
        const logoItem = decryptedProfile.find((item: any) => item.Key === "Logo_Img");
        if (logoItem?.Value) {
          const parsedLogo = ForApplication(logoItem.Value);
          setLogoImg(parsedLogo);
        }

        // 🎞️ Restore Carousel
        const carouselItem = decryptedProfile.find(
          (item: any) => item.Key === "Carousel_Imgs"
        );
        if (carouselItem?.Value) {
          const parsedCarousel = ForApplication(carouselItem.Value);
          setCarouselImgs(parsedCarousel);
        }
        
        // console.log("✅ Profile restored successfully from cache");
      }

      // Unlock other API calls
      markAppProfileReady();
      return dataOfApp;
    } catch (err) {
      console.error("❌ Failed to restore profile from cache:", err);
      // If restore fails, clear cache and proceed to API call
      sessionStorage.removeItem("app_profile_encrypted");
    }
  }

  // 🌐 If no cache, trigger the API call via the mutation endpoint
  // console.log("🌐 No cached profile found. Fetching from API...");
  try {
    const result = await dispatch(
      authApi.endpoints.call.initiate({
        Call: "Application_Profile_Get",
        Details: { Action: "Get", Include: null, Key: null },
        meta: { isProfileCall: true },
      })
    ).unwrap();
    
    return result;
  } catch (err) {
    console.error("❌ Failed to fetch profile from API:", err);
    throw err;
  }
};
