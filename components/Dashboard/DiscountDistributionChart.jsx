"use client";

import { memo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const DiscountDistributionChart = memo(
  function DiscountDistributionChart({ data }) {
    const COLORS = [
      "#a855f7",
      "#d946ef",
      "#ec4899",
      "#f43f5e",
      "#fb7185",
      "#fca5a5",
    ];

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Discount Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ range }) => range}
              outerRadius={100}
              fill="#8884d8"
              dataKey="count">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  },
);
