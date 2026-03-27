"use client";

import { BarChart3, TrendingUp, FileText, Download } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-400 mt-0.5">Incident history, response metrics, and exportable reports.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all cursor-pointer shadow-sm shadow-blue-100">
          <Download size={15} /> Export PDF
        </button>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {[
          { label: "Incidents This Month", value: "24", trend: "+3 from last month", color: "blue" },
          { label: "Avg Response Time",    value: "4.2m", trend: "-18% improvement",   color: "emerald" },
          { label: "SMS Broadcasts",       value: "38", trend: "180 avg recipients",    color: "indigo" },
        ].map((k) => (
          <div key={k.label} className="card-premium p-6">
            <div className="text-3xl font-bold text-gray-900 mb-1">{k.value}</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{k.label}</div>
            <div className={`text-xs font-semibold text-${k.color}-500 flex items-center gap-1`}>
              <TrendingUp size={12} />{k.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="card-premium p-12 flex flex-col items-center justify-center text-center gap-4 bg-gray-50/30 border-dashed border-2 min-h-[400px]">
        <div className="p-4 bg-white rounded-full shadow-sm">
          <FileText size={32} className="text-gray-300" />
        </div>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Full Reporting Module</h3>
        <p className="text-xs font-medium text-gray-400 max-w-sm">
          Detailed incident timelines, evacuation heat maps, staff response logs, and compliance exports coming soon.
        </p>
        <button className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all cursor-pointer">
          Request Access
        </button>
      </div>
    </div>
  );
}
