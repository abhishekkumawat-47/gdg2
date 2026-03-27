"use client";

import { useState } from "react";
import {
  AlertCircle, CheckCircle2, Clock, Flame, Users, ShieldAlert,
  Stethoscope, Filter, Download, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert } from "@/types";

// Mock enriched alerts
const allAlerts: Alert[] = [
  { id: "1", type: "fire",      severity: "critical", location: "Room 305",     floor: "Floor 3", status: "active",       message: "Smoke detector triggered. Possible fire in server room area.", timestamp: new Date(Date.now() - 2 * 60000).toISOString(),  actionRequired: "Evacuate floor, alert fire dept.", acknowledgedBy: undefined },
  { id: "2", type: "crowd",     severity: "high",     location: "Main Lobby",   floor: "Floor 1", status: "acknowledged", message: "Crowd density exceeded safe threshold (>90% capacity).",     timestamp: new Date(Date.now() - 8 * 60000).toISOString(),  actionRequired: "Deploy crowd control staff.",     acknowledgedBy: "John (Security)" },
  { id: "3", type: "security",  severity: "medium",   location: "Gate B",       floor: "Ground",  status: "resolved",     message: "Unauthorized access attempt detected at Gate B.",            timestamp: new Date(Date.now() - 22 * 60000).toISOString(), actionRequired: "Review CCTV, log incident.",       acknowledgedBy: "Sarah (Security)" },
  { id: "4", type: "medical",   severity: "high",     location: "Canteen",      floor: "Floor 2", status: "active",       message: "Guest reported unconscious near canteen seating area.",       timestamp: new Date(Date.now() - 4 * 60000).toISOString(),  actionRequired: "First aid team dispatched.",       acknowledgedBy: undefined },
  { id: "5", type: "evacuation",severity: "critical", location: "Hall A",       floor: "Floor 3", status: "active",       message: "Evacuation order in effect for Hall A.",                     timestamp: new Date(Date.now() - 1 * 60000).toISOString(),  actionRequired: "Guide guests to EXIT A.",          acknowledgedBy: undefined },
  { id: "6", type: "fire",      severity: "low",      location: "Break Room",   floor: "Floor 2", status: "resolved",     message: "Minor smoke from microwave — false alarm.",                  timestamp: new Date(Date.now() - 45 * 60000).toISOString(), actionRequired: "Ventilate area, reset detector.",  acknowledgedBy: "Mike (Maintenance)" },
];

const SEVERITY_CONFIG = {
  critical: { label: "Critical", cls: "bg-red-600 text-white" },
  high:     { label: "High",     cls: "bg-red-100 text-red-700 border border-red-200" },
  medium:   { label: "Medium",   cls: "bg-amber-100 text-amber-700 border border-amber-200" },
  low:      { label: "Low",      cls: "bg-gray-100 text-gray-600 border border-gray-200" },
};

const STATUS_CONFIG = {
  active:       { icon: <AlertCircle size={13} />,  label: "Active",       cls: "text-red-600 bg-red-50 border-red-200" },
  acknowledged: { icon: <Clock size={13} />,         label: "Acknowledged", cls: "text-amber-700 bg-amber-50 border-amber-200" },
  resolved:     { icon: <CheckCircle2 size={13} />,  label: "Resolved",     cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
};

function timeAgo(ts: string): string {
  const diff = (Date.now() - new Date(ts).getTime()) / 1000;
  if (diff < 60) return `${Math.round(diff)}s ago`;
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  return `${Math.round(diff / 3600)}h ago`;
}

export default function AlertsPage() {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = allAlerts.filter((a) => {
    const typeOk = typeFilter === "all" || a.type === typeFilter;
    const statusOk = statusFilter === "all" || a.status === statusFilter;
    return typeOk && statusOk;
  });

  const active = allAlerts.filter((a) => a.status === "active").length;
  const acknowledged = allAlerts.filter((a) => a.status === "acknowledged").length;
  const resolved = allAlerts.filter((a) => a.status === "resolved").length;

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Alerts Center</h1>
          <p className="text-sm text-gray-400 mt-0.5">Real-time monitoring of all active incidents across the facility.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 bg-white border border-gray-100 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all cursor-pointer shadow-sm">
            <Download size={15} /> Export
          </button>
          <button className="p-2 text-gray-400 hover:text-blue-600 bg-white border border-gray-100 rounded-lg transition-all cursor-pointer shadow-sm">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-10">
        {[
          { label: "Active", value: active, icon: <AlertCircle size={18} className="text-red-600" />, color: "red" },
          { label: "Acknowledged", value: acknowledged, icon: <Clock size={18} className="text-amber-600" />, color: "amber" },
          { label: "Resolved Today", value: resolved, icon: <CheckCircle2 size={18} className="text-emerald-600" />, color: "emerald" },
        ].map((k) => (
          <div key={k.label} className="card-premium justify-center items-center p-5 flex gap-4">
              <div className="text-2xl font-bold text-gray-900">{k.value}</div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Filter size={14} className="text-gray-400" />
        <div className="flex gap-2">
          {["all", "fire", "crowd", "security", "medical", "evacuation"].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={cn(
                "px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer",
                typeFilter === t ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="h-5 w-[2px] bg-gray-400" />
        <div className="flex gap-2">
          {["all", "active", "acknowledged", "resolved"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer",
                statusFilter === s ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Feed */}
      <div className="space-y-3">
        {filtered.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              "card-premium p-5 flex gap-4 transition-all animate-in fade-in duration-300",
              alert.status === "active" && alert.severity === "critical" && "border-l-4 border-l-red-500"
            )}
          >
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={cn("text-[10px] font-bold italic px-2 py-0.5 rounded-md tracking-widest", SEVERITY_CONFIG[alert.severity].cls)}>
                  {SEVERITY_CONFIG[alert.severity].label}
                </span>
                <span className="text-sm font-bold text-gray-900">{alert.location}</span>
                <span className="text-xs text-gray-400">{alert.floor}</span>
                <span className="ml-auto text-[10px] font-medium text-gray-400">{timeAgo(alert.timestamp)}</span>
              </div>
              <p className="text-sm text-gray-700 font-medium mb-1.5">{alert.message}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="font-semibold">Action:</span>
                <span className="italic">{alert.actionRequired}</span>
                {alert.acknowledgedBy && (
                  <span className="text-blue-600 font-semibold">Ack by: {alert.acknowledgedBy}</span>
                )}
              </div>
            </div>

            <div className="shrink-0 flex flex-col items-end gap-2">
              <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider", STATUS_CONFIG[alert.status].cls)}>
                {STATUS_CONFIG[alert.status].icon}
                {STATUS_CONFIG[alert.status].label}
              </div>
              {alert.status === "active" && (
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition-all cursor-pointer">
                    Acknowledge
                  </button>
                  <button className="px-3 py-1.5 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-all cursor-pointer">
                    Resolve
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
