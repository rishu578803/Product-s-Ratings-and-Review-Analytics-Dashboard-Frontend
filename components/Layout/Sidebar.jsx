"use client";

import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "@/redux/slices/uiSlice.js";
import {
  Menu,
  X,
  BarChart3,
  Grid,
  Package,
  TrendingUp,
  Upload,
  Filter,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, memo } from "react";
import { usePathname } from "next/navigation";

const SidebarContent = memo(function SidebarContent() {
  const dispatch = useDispatch();
  const sidebarCollapsed = useSelector((state) => state.ui.sidebarCollapsed);
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const menuItems = [
    { icon: Grid, label: "Dashboard", href: "/" },
    { icon: Package, label: "Products", href: "/products" },
    { icon: Upload, label: "Upload Data", href: "/upload-data" },
  ];

  return (
    <aside
      className={`fixed md:relative top-0 left-0 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 z-50 ${
        sidebarCollapsed ? "w-20" : "w-64"
      } ${isMobile && !sidebarCollapsed ? "w-64" : ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div
          className={`flex items-center gap-2 ${sidebarCollapsed ? "justify-center w-full" : ""}`}>
          <div className="bg-purple-600 p-2 rounded-lg">
            <BarChart3 size={20} />
          </div>
          {!sidebarCollapsed && (
            <h1 className="font-bold text-lg">Analytics</h1>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="pt-4">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`flex items-center gap-4 px-4 py-3 transition-colors hover:bg-slate-700 ${
              pathname === item.href
                ? "bg-purple-600 border-r-4 border-purple-400"
                : ""
            } ${sidebarCollapsed ? "justify-center" : ""}`}>
            <item.icon size={20} />
            {!sidebarCollapsed && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* Toggle Button - Mobile */}
      {isMobile && (
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="absolute top-4 right-4 md:hidden">
          {sidebarCollapsed ? <Menu size={24} /> : <X size={24} />}
        </button>
      )}
    </aside>
  );
});

export function Sidebar() {
  return <SidebarContent />;
}
