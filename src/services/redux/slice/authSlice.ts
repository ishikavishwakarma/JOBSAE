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
}

const initialState: AuthState = {
  locationData: {
    Latitude: null,
    Longitude: null,
    Timestamp: new Date().toISOString(),
    Accuracy: null,
    Altitude: null,
    AltitudeAccuracy: null,
    Heading: null,
    Speed: null,
    Location_Shared: null,
  },
  userData: null,
  verifyData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    locationData: (state, action: PayloadAction<Partial<LocationData>>) => {
      state.locationData = {
        ...state.locationData,
        ...action.payload,
        Location_Shared: action.payload.Latitude !== null,
      };
      // Save to localStorage as requested
      localStorage.setItem("user_location", JSON.stringify(state.locationData));
    },
    setUserData: (state, action: PayloadAction<any>) => {
      state.userData = action.payload;
    },
    setVerifyData: (state, action: PayloadAction<any>) => {
      state.verifyData = action.payload;
    },
  },
});

export const { locationData, setUserData, setVerifyData } = authSlice.actions;
export default authSlice.reducer;
