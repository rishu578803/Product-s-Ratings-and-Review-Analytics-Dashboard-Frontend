import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchUploadHistory = createAsyncThunk(
  "uploadHistory/fetchUploadHistory",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${baseUrl}/product/upload-history?page=${page}&limit=${limit}`,
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
      return json;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const uploadFile = createAsyncThunk(
  "uploadHistory/uploadFile",
  async (file, { dispatch, rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${baseUrl}/product/upload`, {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);

      dispatch(fetchUploadHistory({ page: 1 }));
      return json;
    } catch (err) {
      dispatch(fetchUploadHistory({ page: 1 }));
      return rejectWithValue(err.message);
    }
  },
);

const initialState = {
  history: [],
  pagination: {
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  },
  historyLoading: false,
  historyError: null,
  uploading: false,
  uploadError: null,
};

const uploadHistorySlice = createSlice({
  name: "uploadHistory",
  initialState,
  reducers: {
    clearUploadError(state) {
      state.uploadError = null;
    },
  },
  extraReducers: (builder) => {
    // fetchUploadHistory
    builder
      .addCase(fetchUploadHistory.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(fetchUploadHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.history = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUploadHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload;
      });

    //  uploadFile
    builder
      .addCase(uploadFile.pending, (state) => {
        state.uploading = true;
        state.uploadError = null;
      })
      .addCase(uploadFile.fulfilled, (state) => {
        state.uploading = false;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.uploading = false;
        state.uploadError = action.payload;
      });
  },
});

export const { clearUploadError } = uploadHistorySlice.actions;
export default uploadHistorySlice.reducer;
