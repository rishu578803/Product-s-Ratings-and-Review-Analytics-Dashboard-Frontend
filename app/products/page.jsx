'use client';

import { DashboardLayout } from '@/components/Layout/DashboardLayout.jsx';
import { ProductsPageContent } from '@/components/Pages/Products.jsx';

export default function ProductsPage() {
  return (
    <DashboardLayout>
      <ProductsPageContent />
    </DashboardLayout>
  );
}
