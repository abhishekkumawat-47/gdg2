"use client";

import { useAppSelector } from "@/store/hooks";
import { Badge } from "@/components/ui/badge";
import { Maximize2, RefreshCw, BarChart2, Map as MapIcon, History } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function LiveHeatmap() {
  const { heatmapPoints } = useAppSelector(state => state.alerts);
  const { currentFloor } = useAppSelector(state => state.system);
  const [activeTab, setActiveTab] = useState("live");

  const getIntensityColor = (intensity: "low" | "medium" | "high") => {
    switch (intensity) {
      case "high": return "bg-red-500 shadow-[0_0_30px_10px_rgba(239,68,68,0.4)]";
      case "medium": return "bg-amber-500 shadow-[0_0_20px_8px_rgba(245,158,11,0.3)]";
      case "low": return "bg-blue-500 shadow-[0_0_15px_6px_rgba(59,130,246,0.2)]";
      default: return "bg-slate-400";
    }
  };

  const tabs = [
    { id: "live", label: "Live State", icon: MapIcon },
    { id: "hour", label: "Last Hour", icon: BarChart2 },
    { id: "history", label: "Incident History", icon: History },
  ];

  return (
    <div className="card-premium col-span-full xl:col-span-2 overflow-hidden flex flex-col">
      {/* Header with Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-b border-slate-100 gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Environmental Intel</h3>
          <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold px-2 rounded-lg">
            {currentFloor}
          </Badge>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer",
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="relative w-full aspect-[21/9] bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-inner group/map">
          <Image 
            src="/floor-plan.png" 
            alt="Floor Plan" 
            fill 
            className="object-cover opacity-80 transition-opacity group-hover/map:opacity-100 duration-500"
            priority
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none" />

          {heatmapPoints.map((point) => (
            <div
              key={point.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/node z-10"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
            >
              <div className={`w-4 h-4 rounded-full ${getIntensityColor(point.intensity)} heatmap-node animate-in zoom-in group-hover/node:scale-150 transition-transform`} />
              
              {/* Tooltip */}
              <div className="absolute opacity-0 group-hover/node:opacity-100 transition-all duration-200 translate-y-2 group-hover/node:translate-y-0 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1.5 rounded-lg bottom-full mb-3 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none shadow-xl border border-white/10">
                {point.label} • {point.intensity.toUpperCase()} INTENSITY
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
              </div>
            </div>
          ))}

          {/* Map Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <button className="p-2 bg-white/90 backdrop-blur shadow-lg rounded-xl text-slate-600 hover:text-blue-600 transition-colors cursor-pointer border border-white/50" title="Refresh">
              <RefreshCw size={18} />
            </button>
            <button className="p-2 bg-white/90 backdrop-blur shadow-lg rounded-xl text-slate-600 hover:text-blue-600 transition-colors cursor-pointer border border-white/50" title="Expand">
              <Maximize2 size={18} />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-end gap-6 mt-6">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-200" />
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Minimal</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg shadow-amber-200" />
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Elevated</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-200" />
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Critical Alert</span>
          </div>
        </div>
      </div>
    </div>
  );
}
