"use client";

import { memo } from "react";
import { useSelector } from "react-redux";
import {
  StatCard,
  ProductCategoryChart,
  TopReviewedChart,
  DiscountDistributionChart,
  CategoryRatingChart,
} from "@/components/Dashboard/index.js";
import { Package, MessageSquare, Star, Layers } from "lucide-react";

export const DashboardContent = memo(function DashboardContent() {
  const metrics = useSelector((state) => state.dashboard.metrics);
  const categoryCounts = useSelector((state) => state.products.categoryCounts);
  const topReviewedProducts = useSelector(
    (state) => state.products.topReviewedProducts,
  );
  const discountDistribution = useSelector(
    (state) => state.analytics.discountDistribution,
  );
  const categoryRatings = useSelector(
    (state) => state.analytics.categoryRatings,
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Products"
          value={metrics.totalProducts.toLocaleString()}
          icon={<Package size={24} />}
        />
        <StatCard
          title="Total Reviews"
          value={metrics.totalReviews.toLocaleString()}
          icon={<MessageSquare size={24} />}
        />
        <StatCard
          title="Average Rating"
          value={metrics.averageRating.toFixed(2)}
          icon={<Star size={24} />}
        />
        <StatCard
          title="Categories"
          value={metrics.categories}
          icon={<Layers size={24} />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductCategoryChart data={categoryCounts} />
        <TopReviewedChart products={topReviewedProducts} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DiscountDistributionChart data={discountDistribution} />
        <CategoryRatingChart data={categoryRatings} />
      </div>
    </div>
  );
});
