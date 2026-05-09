"use client";

import { Sidebar, TopBar, MainContent } from "@/components/Layout/index.js";

export function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col md:flex-col">
        <TopBar />
        <MainContent>{children}</MainContent>
      </div>
    </div>
  );
}
