'use client';

import { DashboardLayout } from '@/components/Layout/DashboardLayout.jsx';
import { DashboardPageContent } from '@/components/Pages/Dashboard.jsx';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardPageContent />
    </DashboardLayout>
  );
}
