"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar } from "@/store/slices/systemSlice";
import {
  LayoutDashboard,
  AlertCircle,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronLeft,
  ShieldAlert,
  Shield,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Live Alerts", icon: AlertCircle, href: "/alerts" },
  { label: "Guests & Staff", icon: Users, href: "/people" },
  { label: "SMS Broadcast", icon: MessageSquare, href: "/sms" },
  { label: "Security Ops", icon: Shield, href: "/security" },
  { label: "Maintenance", icon: Wrench, href: "/maintenance" },
  { label: "Reports", icon: BarChart3, href: "/reports" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state) => state.system.isSidebarCollapsed);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-gray-100 z-50 flex flex-col transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "w-[64px]" : "w-56"
      )}
    >
      {/* Branding */}
      <div className="h-16 flex items-center px-4 border-b border-gray-50 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="shrink-0 p-1.5 bg-blue-600 rounded-full shadow-sm">
            <ShieldAlert size={20} className="text-white" />
          </div>
          {!isSidebarCollapsed && (
            <span className="text-[17px] font-bold text-gray-900 tracking-tight whitespace-nowrap overflow-hidden">
              Crisis<span className="text-blue-600">Command</span>
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isSidebarCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
                isSidebarCollapsed && "justify-center",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon
                className={cn(
                  "shrink-0 transition-colors",
                  isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                )}
                size={20}
              />
              {!isSidebarCollapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                </>
              )}
              {/* Active indicator for collapsed */}
              {isSidebarCollapsed && isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-l-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-gray-50 shrink-0">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className={cn(
            "w-full flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all cursor-pointer",
          )}
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            className={cn(
              "transition-transform duration-300",
              isSidebarCollapsed && "rotate-180"
            )}
            size={20}
          />
        </button>
      </div>
    </aside>
  );
}
