"use client";

import { Bell, Bookmark, User } from "lucide-react";
import { memo } from "react";

export const TopBar = memo(function TopBar() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between md:sticky md:top-0 z-40">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition">
          <Bookmark size={20} className="text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition">
          <Bell size={20} className="text-gray-600" />
        </button>
        <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
          <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
});
