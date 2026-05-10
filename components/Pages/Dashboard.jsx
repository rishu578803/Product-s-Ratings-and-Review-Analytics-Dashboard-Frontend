"use client";

import { memo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDashboardData } from "../../redux/slices/dashboardSlice.js";
import { fetchStats } from "../../redux/slices/statsSlice.js";
import {
  StatCard,
  ProductCategoryChart,
  TopReviewedChart,
  DiscountDistributionChart,
  CategoryRatingChart,
} from "@/components/Dashboard/index.js";

import {
  Package,
  MessageSquare,
  Star,
  Layers,
  Loader2,
  AlertCircle,
} from "lucide-react";

export const DashboardPageContent = memo(function DashboardPageContent() {
  const dispatch = useDispatch();

  const {
    totalProducts,
    totalReviews,
    averageRating,
    categoriesCount,
    loading: statsLoading,
    error: statsError,
  } = useSelector((state) => state.stats);

  const {
    categoryCounts,
    topReviewedProducts,
    discountDistribution,
    categoryRatings,
    loading: chartsLoading,
    error: chartsError,
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    if (totalProducts === 0) {
      dispatch(fetchStats());
    }
  }, [dispatch, totalProducts]);

  useEffect(() => {
    if (!categoryCounts || Object.keys(categoryCounts).length === 0) {
      dispatch(fetchDashboardData());
    }
  }, [dispatch, categoryCounts]);

  if (statsLoading || chartsLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-500">
        <Loader2 size={36} className="animate-spin text-purple-500" />
        <p className="text-sm">Loading dashboard data…</p>
      </div>
    );
  }

  if (statsError || chartsError) {
    return (
      <div className="space-y-3">
        {statsError && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">
              Stats error: {statsError}
            </span>
          </div>
        )}
        {chartsError && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">
              Charts error: {chartsError}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={totalProducts.toLocaleString()}
          icon={<Package className="text-purple-500" />}
        />
        <StatCard
          title="Total Reviews"
          value={totalReviews.toLocaleString()}
          icon={<MessageSquare className="text-blue-500" />}
        />
        <StatCard
          title="Average Rating"
          value={Number(averageRating).toFixed(2)}
          icon={<Star className="text-yellow-500" />}
        />
        <StatCard
          title="Categories"
          value={categoriesCount}
          icon={<Layers className="text-green-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Products per Category</h3>
          <ProductCategoryChart data={categoryCounts} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Top Reviewed Products</h3>
          <TopReviewedChart products={topReviewedProducts} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Discount Distribution</h3>
          <DiscountDistributionChart data={discountDistribution} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Category Ratings</h3>
          <CategoryRatingChart data={categoryRatings} />
        </div>
      </div>
    </div>
  );
});
