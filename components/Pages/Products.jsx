"use client";

import { memo, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  setPage,
  setFilters,
  resetFilters,
} from "../../redux/slices/productsSlice.js";
import { fetchStats } from "../../redux/slices/statsSlice.js";
import { StatCard } from "@/components/Dashboard/index.js";
import {
  Package,
  DollarSign,
  Star,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Search,
  X,
} from "lucide-react";

const CATEGORIES = [
  "",
  "Electronics",
  "Clothing",
  "Home & Kitchen",
  "Books",
  "Sports",
];

const RATING_RANGES = [
  { label: "All Ratings", min: "", max: "" },
  { label: "4 - 5", min: "4", max: "5" },
  { label: "3 - 4", min: "3", max: "4" },
  { label: "2 - 3", min: "2", max: "3" },
  { label: "Below 2", min: "0", max: "2" },
];

const topCategory = (cat = "") => cat.split("|")[0];
const formatINR = (val) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);

export const ProductsPageContent = memo(function ProductsPageContent() {
  const dispatch = useDispatch();
  const debounceRef = useRef(null);

  const {
    totalProducts,
    averageRating,
    avgDiscount,
    loading: statsLoading,
  } = useSelector((s) => s.stats);
  const { products, pagination, filters, loading, error } = useSelector(
    (s) => s.products,
  );

  useEffect(() => {
    if (totalProducts === 0) dispatch(fetchStats());
  }, [dispatch, totalProducts]);

  useEffect(() => {
    dispatch(
      fetchProducts({
        page: pagination.currentPage,
        search: filters.search,
        category: filters.category,
        ratingMin: filters.ratingMin,
        ratingMax: filters.ratingMax,
      }),
    );
  }, [dispatch, pagination.currentPage, filters]);

  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        dispatch(setFilters({ search: value }));
      }, 400);
    },
    [dispatch],
  );

  const handleCategoryChange = (e) =>
    dispatch(setFilters({ category: e.target.value }));

  const handleRatingChange = (e) => {
    const range = RATING_RANGES[e.target.value];
    dispatch(setFilters({ ratingMin: range.min, ratingMax: range.max }));
  };

  const handleReset = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    document.getElementById("product-search").value = "";
    dispatch(resetFilters());
  };

  const hasActiveFilters =
    filters.search || filters.category || filters.ratingMin;

  const handlePage = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    dispatch(setPage(newPage));
  };

  const selectedRatingIndex = RATING_RANGES.findIndex(
    (r) => r.min === filters.ratingMin && r.max === filters.ratingMax,
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Products</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={statsLoading ? "…" : totalProducts.toLocaleString()}
          icon={<Package className="text-purple-500" />}
        />
        <StatCard
          title="Total Pages"
          value={pagination.totalPages.toLocaleString()}
          icon={<Package className="text-blue-500" />}
        />
        <StatCard
          title="Avg Rating"
          value={statsLoading ? "…" : Number(averageRating).toFixed(2)}
          icon={<Star className="text-yellow-500" />}
        />
        <StatCard
          title="Avg Discount"
          value={statsLoading ? "…" : `${avgDiscount}%`}
          icon={<DollarSign className="text-green-500" />}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            id="product-search"
            type="search"
            placeholder="Search by product name…"
            defaultValue={filters.search}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>

        {/* Category */}
        <select
          value={filters.category}
          onChange={handleCategoryChange}
          className="py-2 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white text-gray-700">
          <option value="">All Categories</option>
          {CATEGORIES.filter(Boolean).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Rating range */}
        <select
          value={selectedRatingIndex < 0 ? 0 : selectedRatingIndex}
          onChange={handleRatingChange}
          className="py-2 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white text-gray-700">
          {RATING_RANGES.map((r, i) => (
            <option key={i} value={i}>
              {r.label}
            </option>
          ))}
        </select>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Product List</h3>
          {loading && (
            <Loader2 size={18} className="animate-spin text-purple-500" />
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  "Product ID",
                  "Name",
                  "Category",
                  "Actual Price",
                  "Sale Price",
                  "Discount",
                  "Rating",
                  "Reviews",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-semibold text-gray-600">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2" />
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                      {product.product_id}
                    </td>
                    <td
                      className="px-4 py-3 font-medium text-gray-900 max-w-[220px] truncate"
                      title={product.product_name}>
                      {product.product_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {topCategory(product.category)}
                    </td>
                    <td className="px-4 py-3 text-gray-500 line-through">
                      {formatINR(product.actual_price)}
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-semibold">
                      {formatINR(product.discounted_price)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        {Math.round(product.discount_percentage * 100)}% off
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-yellow-600 font-semibold">
                        ★ {product.rating}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {Number(product.rating_count).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 text-sm text-gray-600">
            <span>
              Page <strong>{pagination.currentPage}</strong> of{" "}
              <strong>{pagination.totalPages}</strong> ·{" "}
              {pagination.totalRecords.toLocaleString()} total records
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePage(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1 || loading}
                className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft size={16} />
              </button>
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  const start = Math.max(
                    1,
                    Math.min(
                      pagination.currentPage - 2,
                      pagination.totalPages - 4,
                    ),
                  );
                  const p = start + i;
                  return (
                    <button
                      key={p}
                      onClick={() => handlePage(p)}
                      disabled={loading}
                      className={`w-8 h-8 cursor-pointer rounded-md text-xs font-medium transition-colors ${
                        p === pagination.currentPage
                          ? "bg-purple-600 text-white"
                          : "border border-gray-200 hover:bg-gray-50 text-gray-600"
                      }`}>
                      {p}
                    </button>
                  );
                },
              )}
              <button
                onClick={() => handlePage(pagination.currentPage + 1)}
                disabled={
                  pagination.currentPage === pagination.totalPages || loading
                }
                className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
