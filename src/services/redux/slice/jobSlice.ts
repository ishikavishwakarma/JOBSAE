import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../apis/authApi";

export interface SearchJobState {
  loading: boolean;
  error: any;
  keywordData: {
    keyword: string;
    location: string;
    locKey: string;
    country: string;
    [key: string]: any;
  } | null;
  searchResult: any;
}

const initialState: SearchJobState = {
  loading: false,
  error: null,
  keywordData: null,
  searchResult: null,
};

// Real SearchJobList async thunk
export const SearchJobList = createAsyncThunk(
  "job/searchJobList",
  async (data: any, { dispatch, rejectWithValue }) => {
    try {
      const normalizeArray = (arr: any) => Array.isArray(arr) ? arr : (arr ? [arr] : null);

      const requestData: any = {
        Method: data.method || "Search",
        Keywords: data.method === "Visit" ? null : normalizeArray(data.keyword),
        Locations: data.method === "Visit" ? null : normalizeArray(data.location),
        Zips: data.zips ?? null,
        Companies: normalizeArray(data.companies || data.company),
        Job_Types: normalizeArray(data.jobTypes),
        Industries: normalizeArray(data.industries),
        Job_Titles: normalizeArray(data.jobTitles),
        Benefits: normalizeArray(data.benefits),
        Salary: normalizeArray(data.salary),
        Radius: data.radius ?? null,
        Age: data.age ?? 5,
        PageNumber: data.pageNum || 1,
        PageSize: data.pageSize || 10,
      };

      // We use the initiate action to trigger the mutation from the thunk
      const result = await dispatch(
        authApi.endpoints.call.initiate({
          Call: "Job_Search",
          Details: requestData,
        })
      ).unwrap();

      return result;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    request: (state) => {
      state.loading = true;
      state.error = null;
    },
    success: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.keywordData = {
        keyword: action.payload.keyword,
        location: action.payload.location,
        locKey: action.payload.locKey,
        country: action.payload.country,
      };
      state.searchResult = action.payload;
      
      // Save to localStorage as requested
      localStorage.setItem("search_keyword_data", JSON.stringify(state.keywordData));
    },
    failure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    appendJobs: (state, action: PayloadAction<any>) => {
      state.loading = false;
      const newJobs = action.payload.data;
      if (state.searchResult?.Return?.Jobs?.Jobs) {
        state.searchResult.Return.Jobs.Jobs = [...state.searchResult.Return.Jobs.Jobs, ...newJobs];
      }
      if (state.keywordData) {
        state.keywordData.currentPage = action.payload.currentPage;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SearchJobList.pending, (state) => {
        state.loading = true;
      })
      .addCase(SearchJobList.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResult = action.payload;
      })
      .addCase(SearchJobList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const searchJob = jobSlice.actions;
export const selectKeywordData = (state: { job: SearchJobState }) => state.job.keywordData;
export const selectSearchResult = (state: { job: SearchJobState }) => state.job.searchResult;

export default jobSlice.reducer;
