"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Users, LogIn, ShieldAlert, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const funnelSteps = [
  { id: "entry", label: "Entrance Scan", count: 180, icon: LogIn, color: "blue" },
  { id: "zone", label: "Zone Distribution", count: 142, icon: Users, color: "indigo" },
  { id: "alert", label: "Protocol Alerted", count: 121, icon: ShieldAlert, color: "red" },
  { id: "safe", label: "Safe Evacuation", count: 86, icon: CheckCircle2, color: "emerald" }
];

export function UserJourneyFunnel() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="card-premium p-6 h-[400px] flex flex-col">
        <Skeleton className="h-6 w-32 mb-8" />
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card-premium p-6 h-[400px] flex flex-col group animate-in fade-in duration-700">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          Protocol Funnel
        </h3>
        <p className="text-xs text-gray-400 font-medium font-sans tracking-wide">User journey tracking through emergency protocols</p>
      </div>

      <div className="flex-1 flex flex-col justify-between py-2">
        {funnelSteps.map((step, index) => {
          const percentage = (step.count / funnelSteps[0].count) * 100;
          return (
            <div key={step.id} className="relative flex items-center group/step">
              {/* Vertical Connector */}
              {index < funnelSteps.length - 1 && (
                <div className="absolute left-6 top-10 w-0.5 h-6 bg-gray-100 group-hover/step:bg-blue-100 transition-colors z-0" />
              )}

              <div className={cn(
                "relative z-10 p-3 rounded-xl bg-gray-50 border border-gray-100 group-hover/step:border-blue-200 transition-all cursor-pointer flex items-center gap-4 w-full h-[64px]",
                index === 2 && "bg-red-50/50 border-red-100"
              )}>
                <div className={cn(
                  "p-2 rounded-lg transition-transform duration-300 group-hover/step:scale-110 shadow-sm",
                  step.color === "blue" && "bg-blue-600 text-white",
                  step.color === "indigo" && "bg-indigo-600 text-white",
                  step.color === "red" && "bg-red-600 text-white",
                  step.color === "emerald" && "bg-emerald-600 text-white"
                )}>
                  <step.icon size={18} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-bold text-gray-900">{step.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400">{step.count} pax</span>
                      <span className="text-xs font-black text-blue-600">{Math.round(percentage)}%</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-gray-200/50 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-1000 ease-out",
                        step.color === "blue" && "bg-blue-600",
                        step.color === "indigo" && "bg-indigo-600",
                        step.color === "red" && "bg-red-600",
                        step.color === "emerald" && "bg-emerald-600"
                      )} 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
