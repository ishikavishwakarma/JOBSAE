import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LocationData {
  Latitude: number | null;
  Longitude: number | null;
  Timestamp: string | null;
  Accuracy: number | null;
  Altitude: number | null;
  AltitudeAccuracy: number | null;
  Heading: number | null;
  Speed: number | null;
  Location_Shared: boolean | null;
}

export interface AuthState {
  locationData: LocationData;
  userData: any;
  verifyData: any;
  onboardingData: any;
  token: string | null;
  loading: boolean;
  error: string | null;
  loginType: string | null;
}

const getInitialLocation = (): LocationData => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("user_location");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse stored location", e);
      }
    }
  }
  return {
    Latitude: null,
    Longitude: null,
    Timestamp: new Date().toISOString(),
    Accuracy: null,
    Altitude: null,
    AltitudeAccuracy: null,
    Heading: null,
    Speed: null,
    Location_Shared: null,
  };
};

const initialState: AuthState = {
  locationData: getInitialLocation(),
  userData: null,
  verifyData: null,
  onboardingData: {},
  token: null,
  loading: false,
  error: null,
  loginType: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    locationData: (state, action: PayloadAction<Partial<LocationData> | undefined>) => {
      // If action.payload is provided, update with it. 
      // Otherwise, or as a fallback, check localStorage.
      const incomingData = action.payload || {};
      
      // Merge: Current state < LocalStorage < Incoming Payload
      let finalData = { ...state.locationData };

      // If current state is mostly null, try loading from localStorage first
      if (!finalData.Latitude && typeof window !== "undefined") {
        const stored = localStorage.getItem("user_location");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            finalData = { ...finalData, ...parsed };
          } catch (e) {}
        }
      }

      // Finally apply the incoming update
      state.locationData = {
        ...finalData,
        ...incomingData,
        // Update Location_Shared based on Latitude existence (either incoming or merged)
        Location_Shared: (incomingData.Latitude !== undefined ? incomingData.Latitude : finalData.Latitude) !== null,
      };

      // Save back to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user_location", JSON.stringify(state.locationData));
      }
    },
    authRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action: PayloadAction<{ userData: any; token?: string; loginType?: string }>) => {
      state.userData = action.payload.userData;
      state.token = action.payload.token || null;
      state.loginType = action.payload.loginType || null;
      state.loading = false;
      state.error = null;
    },
    authFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setUserData: (state, action: PayloadAction<any>) => {
      state.userData = action.payload;
    },
    setVerifyData: (state, action: PayloadAction<any>) => {
      state.verifyData = action.payload;
    },
    updateUserData: (state, action: PayloadAction<any>) => {
      state.userData = {
        ...state.userData,
        ...action.payload
      };
    },
    updateOnboardingData: (state, action: PayloadAction<any>) => {
      state.onboardingData = {
        ...state.onboardingData,
        ...action.payload
      };
    },
    resetAuth: (state) => {
      state.userData = null;
      state.verifyData = null;
      state.onboardingData = {};
      state.token = null;
      state.loading = false;
      state.error = null;
      state.loginType = null;
      // Note: locationData is preserved
    }
  },
});

export const { 
  locationData, 
  authRequest, 
  authSuccess, 
  authFailure, 
  setUserData, 
  setVerifyData,
  updateUserData,
  updateOnboardingData,
  resetAuth
} = authSlice.actions;
export default authSlice.reducer;
