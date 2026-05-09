"use client";

import { useSelector } from "react-redux";

export function MainContent({ children }) {
  const sidebarCollapsed = useSelector((state) => state.ui.sidebarCollapsed);

  return (
    <main className="p-8 bg-gray-50 h-[calc(100vh-64px)] overflow-y-auto">
      {children}
    </main>
  );
}
