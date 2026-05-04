// services/redux/slices/routeSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types
export interface ServerVariables {
  [key: string]: any;
}

export interface RouteState {
  serverVariables: ServerVariables | null;
  serverVarFetchCount: number;
  serverVarLastFetched: string | null;
  // Add other route-related state here
  currentPath?: string;
  previousPath?: string;
}

const initialState: RouteState = {
  serverVariables: null,
  serverVarFetchCount: 0,
  serverVarLastFetched: null,
  currentPath: window.location.pathname,
//   previousPath: null,
};

const routeSlice = createSlice({
  name: "route",
  initialState,
  reducers: {
    // ✅ Server variables handling
    SET_SERVER_VARIABLES: (state, action: PayloadAction<ServerVariables>) => {
      state.serverVariables = action.payload;
      state.serverVarFetchCount = 0; // reset after update
      state.serverVarLastFetched = new Date().toISOString();
    },
    
    INCREMENT_SERVER_FETCH_COUNT: (state) => {
      state.serverVarFetchCount += 1;
    },
    
    RESET_SERVER_VARIABLES: (state) => {
      state.serverVariables = null;
      state.serverVarFetchCount = 0;
      state.serverVarLastFetched = null;
    },
    
    // Additional useful reducers
    UPDATE_SERVER_VARIABLE: (
      state,
      action: PayloadAction<{ key: string; value: any }>
    ) => {
      if (state.serverVariables) {
        state.serverVariables[action.payload.key] = action.payload.value;
      }
    },
    
    SET_CURRENT_PATH: (state, action: PayloadAction<string>) => {
      state.previousPath = state.currentPath;
      state.currentPath = action.payload;
    },
    
    // Reset specific server variable
    RESET_SERVER_VARIABLE: (state, action: PayloadAction<string>) => {
      if (state.serverVariables) {
        delete state.serverVariables[action.payload];
      }
    },
  },
});

// Export actions
export const {
  SET_SERVER_VARIABLES,
  INCREMENT_SERVER_FETCH_COUNT,
  RESET_SERVER_VARIABLES,
  UPDATE_SERVER_VARIABLE,
  SET_CURRENT_PATH,
  RESET_SERVER_VARIABLE,
} = routeSlice.actions;

// Export selectors
export const selectServerVariables = (state: { route: RouteState }) => 
  state.route.serverVariables;

export const selectServerVarFetchCount = (state: { route: RouteState }) => 
  state.route.serverVarFetchCount;

export const selectServerVarLastFetched = (state: { route: RouteState }) => 
  state.route.serverVarLastFetched;

export const selectSpecificServerVariable = (key: string) => 
  (state: { route: RouteState }) => 
    state.route.serverVariables?.[key];

export default routeSlice.reducer;