"use client";

import { useAppSelector } from "@/store/hooks";
import { ListTodo, Download, History, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export function AlertTimeline() {
  const { timeline } = useAppSelector(state => state.alerts);
  const { isEmergencySimulated } = useAppSelector(state => state.system);

  if (!isEmergencySimulated) {
    return (
      <div className="card-premium col-span-full p-12 flex flex-col items-center justify-center text-center gap-4 bg-gray-50/30 border-dashed border-2">
        <div className="p-4 bg-white rounded-full text-gray-200 shadow-sm">
          <History size={40} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Protocol Dormant</h3>
          <p className="text-xs font-medium text-gray-400 mt-1">System is monitoring for incident signals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-premium col-span-full overflow-hidden flex flex-col group animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between px-8 py-5 border-b border-gray-50 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <ListTodo size={18}/>
          </div>
          <h3 className="text-sm font-bold text-gray-900 tracking-tight">Active Incident Protocol</h3>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-gray-500 hover:bg-gray-50 rounded-lg transition-all border border-gray-100 uppercase tracking-widest">
            <Filter size={12} /> Filter
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-blue-600 border border-blue-100 bg-blue-50/50 hover:bg-blue-50 rounded-lg transition-all uppercase tracking-widest">
            <Download size={12} /> Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">Time Signature</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">Event Sequence</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">Actor Entity</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 text-right">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {timeline.slice(0, 10).map((event, index) => (
              <tr key={event.id} className="group/row hover:bg-gray-50/50 transition-colors animate-in fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <td className="px-8 py-4">
                  <span className="text-[11px] font-bold text-gray-500 font-mono">{event.time}</span>
                </td>
                <td className="px-8 py-4">
                  <span className="text-sm font-semibold text-gray-900">{event.event}</span>
                </td>
                <td className="px-8 py-4">
                  <div className="flex items-center gap-2 opacity-70 group-hover/row:opacity-100 transition-opacity">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span className="text-xs font-bold text-gray-600">{event.role}</span>
                  </div>
                </td>
                <td className="px-8 py-4 text-right">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white border border-gray-100 shadow-sm transition-transform group-hover/row:scale-105">
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      event.status === 'success' ? 'bg-emerald-500 ring-2 ring-emerald-100' :
                      event.status === 'failed' ? 'bg-red-500 ring-2 ring-red-100' : 'bg-amber-500 ring-2 ring-amber-100'
                    )} />
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      event.status === 'success' ? 'text-emerald-600' :
                      event.status === 'failed' ? 'text-red-600' : 'text-amber-600'
                    )}>
                      {event.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
