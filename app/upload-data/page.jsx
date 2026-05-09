'use client';

import { DashboardLayout } from '@/components/Layout/DashboardLayout.jsx';
import { UploadDataPageContent } from '@/components/Pages/UploadData.jsx';

export default function UploadDataPage() {
  return (
    <DashboardLayout>
      <UploadDataPageContent />
    </DashboardLayout>
  );
}
