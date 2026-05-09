'use client';

import { DashboardLayout } from '@/components/Layout/DashboardLayout.jsx';
import { FiltersPageContent } from '@/components/Pages/Filters.jsx';

export default function FiltersPage() {
  return (
    <DashboardLayout>
      <FiltersPageContent />
    </DashboardLayout>
  );
}
