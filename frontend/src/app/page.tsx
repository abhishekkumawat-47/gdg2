"use client";

import { useEffect, useState } from "react";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { KPICards } from "@/components/dashboard/KPICards";
import { RealTimeChart } from "@/components/dashboard/RealTimeChart";
import { EvacuationHeatmap } from "@/components/dashboard/EvacuationHeatmap";
import { SMSPanel } from "@/components/dashboard/SMSPanel";
import { AlertTimeline } from "@/components/dashboard/AlertTimeline";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Share2, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="max-w-[1600px] mx-auto space-y-8 pb-20">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-9 w-28 rounded-lg" />
            <Skeleton className="h-9 w-28 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="col-span-2 h-[400px] rounded-xl" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-7 pb-20 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Crisis Intelligence Dashboard</h1>
          <p className="text-sm font-medium text-gray-400 mt-0.5">Real-time facility monitoring and emergency coordination.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/reports"
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg text-sm font-semibold shadow-sm transition-all cursor-pointer"
          >
            <FileText size={15} /> Reports
          </Link>
          <Link
            href="/sms"
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg text-sm font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Share2 size={15} /> Broadcast
          </Link>
          <button className="p-2 bg-white border border-gray-100 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg shadow-sm transition-all cursor-pointer">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Emergency Banner */}
      <AlertBanner />

      {/* KPI Cards */}
      <KPICards />

      {/* Primary Grid: Chart + Heatmap */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3">
          <RealTimeChart />
        </div>
        <div className="xl:col-span-2">
          <EvacuationHeatmap />
        </div>
      </div>

      {/* Secondary Grid: Alert Timeline + Right Column */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <AlertTimeline />
        </div>
        <div className="space-y-6">
          <SMSPanel />
        </div>
      </div>
    </div>
  );
}
