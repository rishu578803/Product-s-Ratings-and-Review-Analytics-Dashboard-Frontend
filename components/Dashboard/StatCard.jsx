"use client";

import { memo } from "react";
import { ArrowDown, Star } from "lucide-react";

export const StatCard = memo(function StatCard({
  title,
  value,
  icon,
  trend,
  trendLabel,
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
            {value}
          </p>
        </div>
        <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
          {icon}
        </div>
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-4">
          <ArrowDown size={16} className="text-green-600" />
          <span className="text-sm text-gray-600">
            <span className="font-semibold text-green-600">{trend}%</span>
            {trendLabel}
          </span>
        </div>
      )}
    </div>
  );
});
