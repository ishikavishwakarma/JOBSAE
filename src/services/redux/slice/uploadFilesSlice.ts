import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FileDetails {
  File_No: number;
  Action: string;
  File_Id: number;
  Original_File_Nm: string;
  File_Extension: string;
  File_Size_Bytes: number;
  Width_Px: number | null;
  Height_Px: number | null;
  Duration_Sec: number | null;
  File_Category: string;
  File_Type: string;
  File_Caption: string;
  Job_Id: number | null;
  Ticket_Id: string | null;
  URL?: string;
  url?: string;
  mimeType?: string;
}

interface UploadFilesState {
  fileList: FileDetails[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UploadFilesState = {
  fileList: [],
  isLoading: false,
  error: null,
};

const uploadFilesSlice = createSlice({
  name: "uploadFiles",
  initialState,
  reducers: {
    SET_FILE_LIST: (state, action: PayloadAction<FileDetails[]>) => {
      state.fileList = action.payload;
    },
    SET_LOADING: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    SET_ERROR: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { SET_FILE_LIST, SET_LOADING, SET_ERROR } = uploadFilesSlice.actions;

export const selectUploadedFiles = (state: { uploadFiles: UploadFilesState }) => state.uploadFiles.fileList;
export const selectIsLoadingFiles = (state: { uploadFiles: UploadFilesState }) => state.uploadFiles.isLoading;

export default uploadFilesSlice.reducer;
