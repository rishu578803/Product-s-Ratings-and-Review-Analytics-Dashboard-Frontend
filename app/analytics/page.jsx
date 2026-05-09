"use client";

import { DashboardLayout } from "@/components/Layout/DashboardLayout.jsx";
import { AnalyticsPageContent } from "@/components/Pages/Analytics.jsx";

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <AnalyticsPageContent />
    </DashboardLayout>
  );
}
