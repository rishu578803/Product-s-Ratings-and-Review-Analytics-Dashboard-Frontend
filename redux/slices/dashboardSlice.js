import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const metaRes = await fetch(`${baseUrl}/product?page=1&limit=1`);
      if (!metaRes.ok) throw new Error(`HTTP ${metaRes.status}`);
      const meta = await metaRes.json();
      const total = meta.pagination.totalRecords;

      const fullRes = await fetch(`${baseUrl}/product?page=1&limit=${total}`);
      if (!fullRes.ok) throw new Error(`HTTP ${fullRes.status}`);
      const full = await fullRes.json();
      return full.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const topLevel = (cat = "") => cat.split("|")[0];

function buildCategoryCounts(products) {
  return products.reduce((acc, p) => {
    const cat = topLevel(p.category);
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
}

function buildTopReviewed(products, n = 5) {
  return [...products]
    .sort((a, b) => Number(b.rating_count) - Number(a.rating_count))
    .slice(0, n)
    .map((p) => ({
      id: p.product_id,
      name:
        p.product_name.length > 30
          ? p.product_name.slice(0, 30) + "…"
          : p.product_name,
      category: topLevel(p.category),
      reviews: Number(p.rating_count),
      rating: Number(p.rating),
    }));
}

function buildDiscountDistribution(products) {
  const buckets = {
    "0-10%": 0,
    "11-20%": 0,
    "21-30%": 0,
    "31-50%": 0,
    "51%+": 0,
  };
  products.forEach((p) => {
    const d = Math.round(Number(p.discount_percentage) * 100);
    if (d <= 10) buckets["0-10%"]++;
    else if (d <= 20) buckets["11-20%"]++;
    else if (d <= 30) buckets["21-30%"]++;
    else if (d <= 50) buckets["31-50%"]++;
    else buckets["51%+"]++;
  });
  return Object.entries(buckets).map(([name, count]) => ({ name, count }));
}

function buildCategoryRatings(products) {
  const map = {};
  products.forEach((p) => {
    const cat = topLevel(p.category);
    if (!map[cat]) map[cat] = { sum: 0, count: 0 };
    map[cat].sum += Number(p.rating);
    map[cat].count += 1;
  });
  return Object.entries(map)
    .map(([category, { sum, count }]) => ({
      category,
      rating: parseFloat((sum / count).toFixed(2)),
    }))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8);
}

// slice

const initialState = {
  totalProducts: 0,
  totalReviews: 0,
  averageRating: 0,
  categoriesCount: 0,
  categoryCounts: {},
  topReviewedProducts: [],
  discountDistribution: [],
  categoryRatings: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        const products = action.payload;
        state.loading = false;

        state.totalProducts = products.length;
        state.totalReviews = products.reduce(
          (s, p) => s + Number(p.rating_count),
          0,
        );
        state.averageRating = parseFloat(
          (
            products.reduce((s, p) => s + Number(p.rating), 0) / products.length
          ).toFixed(2),
        );

        const counts = buildCategoryCounts(products);
        state.categoryCounts = counts;
        state.categoriesCount = Object.keys(counts).length;
        state.topReviewedProducts = buildTopReviewed(products);
        state.discountDistribution = buildDiscountDistribution(products);
        state.categoryRatings = buildCategoryRatings(products);
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
