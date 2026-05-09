import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchStats = createAsyncThunk(
  "stats/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseUrl}/product/stats`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
      return json.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const statsSlice = createSlice({
  name: "stats",
  initialState: {
    totalProducts: 0,
    totalReviews: 0,
    averageRating: 0,
    avgDiscount: 0,
    categoriesCount: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.totalProducts = action.payload.totalProducts;
        state.totalReviews = action.payload.totalReviews;
        state.averageRating = action.payload.averageRating;
        state.avgDiscount = action.payload.avgDiscount;
        state.categoriesCount = action.payload.categoriesCount;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default statsSlice.reducer;
