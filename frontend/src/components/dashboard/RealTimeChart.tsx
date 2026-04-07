"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { TrendingUp, Activity } from "lucide-react";

const data = [
  { time: "00:00", activity: 400 },
  { time: "04:00", activity: 300 },
  { time: "08:00", activity: 800 },
  { time: "12:00", activity: 600 },
  { time: "16:00", activity: 900 },
  { time: "20:00", activity: 500 },
  { time: "23:59", activity: 700 },
];

export function RealTimeChart() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="card-premium p-6 h-[400px] flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="flex-1 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="card-premium p-6 h-[400px] flex flex-col group animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Activity size={18} className="text-blue-600" />
            System Activity Monitor
          </h3>
          <p className="text-xs text-gray-400 font-medium">Real-time throughput and incident signals</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100">
          <TrendingUp size={14} />
          +12.5%
        </div>
      </div>

      <div className="flex-1 w-full -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                fontSize: '12px',
                fontWeight: '600'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="activity" 
              stroke="#2563eb" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorActivity)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
