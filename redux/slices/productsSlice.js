import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (
    {
      page = 1,
      search = "",
      category = "",
      ratingMin = "",
      ratingMax = "",
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const params = new URLSearchParams({ page, limit: 10 });

      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (ratingMin) params.set("rating_min", ratingMin);
      if (ratingMax) params.set("rating_max", ratingMax);

      const res = await fetch(`${baseUrl}/product?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const initialState = {
  products: [],
  pagination: {
    totalRecords: 0,
    currentPage: 1,
    totalPages: 0,
    limit: 10,
  },
  filters: {
    search: "",
    category: "",
    ratingMin: "",
    ratingMax: "",
  },
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setPage(state, action) {
      state.pagination.currentPage = action.payload;
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1;
    },
    resetFilters(state) {
      state.filters = {
        search: "",
        category: "",
        ratingMin: "",
        ratingMax: "",
      };
      state.pagination.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setFilters, resetFilters } = productsSlice.actions;
export default productsSlice.reducer;
