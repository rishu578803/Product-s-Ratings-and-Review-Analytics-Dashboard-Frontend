"use client";

import { memo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, setPage } from "../../redux/slices/productsSlice.js";
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
} from "lucide-react";

const topCategory = (cat = "") => cat.split("|")[0];

const formatINR = (val) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);

export const ProductsPageContent = memo(function ProductsPageContent() {
  const dispatch = useDispatch();

  const {
    totalProducts,
    averageRating,
    avgDiscount,
    loading: statsLoading,
  } = useSelector((state) => state.stats);

  const { products, pagination, loading, error } = useSelector(
    (state) => state.products,
  );

  useEffect(() => {
    if (totalProducts === 0) {
      dispatch(fetchStats());
    }
  }, [dispatch, totalProducts]);

  useEffect(() => {
    dispatch(fetchProducts(pagination.currentPage));
  }, [dispatch, pagination.currentPage]);

  const handlePage = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    dispatch(setPage(newPage));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Products</h2>

      {/*  Stat Cards */}
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

      {/*  Product Table  */}
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
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Product ID
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Category
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Actual Price
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Sale Price
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Discount
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Rating
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Reviews
                </th>
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
