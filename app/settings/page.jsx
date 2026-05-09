'use client';

import { DashboardLayout } from '@/components/Layout/DashboardLayout.jsx';
import { SettingsPageContent } from '@/components/Pages/Settings.jsx';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <SettingsPageContent />
    </DashboardLayout>
  );
}
