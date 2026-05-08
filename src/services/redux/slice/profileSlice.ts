import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  HomeData: any;
  Helmet: any;
  Footer: any;
  Message: any;
  Result: any;
  Script: any;
}

const initialState: ProfileState = {
  HomeData: null,
  Helmet: null,
  Footer: null,
  Message: null,
  Result: null,
  Script: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setHomeData: (state, action: PayloadAction<any>) => {
      // action.payload is the normalized API response
      state.HomeData = action.payload;
      if (action.payload?.Helmet) state.Helmet = action.payload.Helmet;
      if (action.payload?.Footer) state.Footer = action.payload.Footer;
      if (action.payload?.Message) state.Message = action.payload.Message;
      if (action.payload?.Result) state.Result = action.payload.Result;
      if (action.payload?.Script) state.Script = action.payload.Script;
    },
  },
});

export const { setHomeData } = profileSlice.actions;
export default profileSlice.reducer;
