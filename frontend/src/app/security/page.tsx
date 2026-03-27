"use client";

import { useState } from "react";
import { Shield, MapPin, Radio, CheckCircle2, Clock, AlertCircle, Filter, UserPlus, Phone, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { RolePersonnel, PersonnelStatus } from "@/types";

const securityPersonnel: RolePersonnel[] = [
  { id: "s1", name: "John Mercer",    role: "security", badge: "SEC-001", zone: "Main Entrance", floor: "Ground", status: "active",    lastSeen: "just now",  currentTask: "Crowd control at Gate A",                phone: "+91 98765 00001" },
  { id: "s2", name: "Sarah Okafor",   role: "security", badge: "SEC-002", zone: "Floor 3",       floor: "Floor 3", status: "responding",lastSeen: "2m ago",    currentTask: "Responding to fire alarm — Room 305",   phone: "+91 98765 00002" },
  { id: "s3", name: "Raj Sharma",     role: "security", badge: "SEC-003", zone: "Stairwell N",   floor: "Floor 3", status: "active",    lastSeen: "1m ago",    currentTask: "Monitoring evacuation stairwell",       phone: "+91 98765 00003" },
  { id: "s4", name: "Lisa Fontaine",  role: "security", badge: "SEC-004", zone: "CCTV Room",     floor: "Ground",  status: "active",    lastSeen: "just now",  currentTask: "Remote surveillance — Hall A & B",     phone: "+91 98765 00004" },
  { id: "s5", name: "Tom Hadley",     role: "security", badge: "SEC-005", zone: "Gate B",        floor: "Ground",  status: "idle",      lastSeen: "5m ago",    currentTask: undefined,                               phone: "+91 98765 00005" },
  { id: "s6", name: "Mei Lin",        role: "security", badge: "SEC-006", zone: "—",             floor: "—",       status: "offline",   lastSeen: "2h ago",    currentTask: undefined,                               phone: "+91 98765 00006" },
];

const patrolZones = [
  { zone: "Main Entrance", officer: "John Mercer",   status: "active",  lastCheck: "2m ago" },
  { zone: "Floor 3 Corridor", officer: "Sarah Okafor", status: "responding", lastCheck: "3m ago" },
  { zone: "Stairwell N/S",  officer: "Raj Sharma",   status: "active",  lastCheck: "1m ago" },
  { zone: "CCTV Monitor",   officer: "Lisa Fontaine", status: "active", lastCheck: "just now" },
  { zone: "Gate B",         officer: "Tom Hadley",   status: "idle",    lastCheck: "5m ago" },
  { zone: "Parking Level",  officer: "Unassigned",   status: "idle",    lastCheck: "—" },
];

const incidentLog = [
  { time: "14:22", description: "Unauthorized access at Gate B — logged", officer: "Lisa Fontaine", severity: "medium" },
  { time: "13:58", description: "Guest altercation near Hall A - de-escalated", officer: "John Mercer", severity: "high" },
  { time: "13:11", description: "Bag check anomaly — secondary screening applied", officer: "Tom Hadley", severity: "low" },
  { time: "12:45", description: "CCTV offline 10min in Server Room corridor — fixed", officer: "Lisa Fontaine", severity: "low" },
];

const STATUS_CONFIG: Record<PersonnelStatus, { label: string; cls: string; dot: string }> = {
  active:     { label: "Active",     cls: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  idle:       { label: "Idle",       cls: "bg-gray-100 text-gray-500 border-gray-200",         dot: "bg-gray-400" },
  offline:    { label: "Offline",    cls: "bg-red-50 text-red-500 border-red-200",              dot: "bg-red-400" },
  responding: { label: "Responding", cls: "bg-blue-50 text-blue-700 border-blue-200",           dot: "bg-blue-500 animate-ping" },
};

export default function SecurityPage() {
  const [selectedZone, setSelectedZone] = useState<string>("all");

  const filtered = selectedZone === "all"
    ? securityPersonnel
    : securityPersonnel.filter((p) => p.floor === selectedZone || p.zone.includes(selectedZone));

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-orange-500 mb-1">
            <Shield size={15} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Role Access / Security Operations</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Security Operations Panel</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage personnel, patrol zones, and incident reporting.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all cursor-pointer shadow-sm shadow-blue-100">
            <UserPlus size={15} /> Add Officer
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all cursor-pointer shadow-sm">
            <Download size={15} /> Export
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "On Duty",    value: securityPersonnel.filter(p => p.status !== "offline").length, icon: <Shield size={18} />,          color: "blue" },
          { label: "Responding", value: securityPersonnel.filter(p => p.status === "responding").length, icon: <Radio size={18} />,        color: "red" },
          { label: "Idle",       value: securityPersonnel.filter(p => p.status === "idle").length, icon: <Clock size={18} />,              color: "amber" },
          { label: "Offline",    value: securityPersonnel.filter(p => p.status === "offline").length, icon: <AlertCircle size={18} />,     color: "gray" },
        ].map((k) => (
          <div key={k.label} className={cn("card-premium p-5 flex items-center gap-4")}>
            <div className={cn("p-2.5 rounded-xl", `bg-${k.color}-50`, `text-${k.color}-600`)}>{k.icon}</div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{k.value}</div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Personnel Roster */}
        <div className="xl:col-span-2 card-premium overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900">Personnel Roster</h2>
            <div className="flex items-center gap-2">
              <Filter size={13} className="text-gray-400" />
              {["all", "Ground", "Floor 3", "Floor 2"].map((z) => (
                <button
                  key={z}
                  onClick={() => setSelectedZone(z)}
                  className={cn(
                    "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border transition-all cursor-pointer",
                    selectedZone === z ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
                  )}
                >
                  {z}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {filtered.map((p) => (
              <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group cursor-pointer">
                {/* Avatar + status */}
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                    {p.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className={cn("absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white", STATUS_CONFIG[p.status].dot)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">{p.name}</span>
                    <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{p.badge}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin size={10} />{p.zone}</span>
                    <span>{p.floor}</span>
                    <span className="text-gray-300">•</span>
                    <span>Last seen {p.lastSeen}</span>
                  </div>
                  {p.currentTask && (
                    <p className="text-[11px] text-blue-600 font-medium mt-0.5 truncate">{p.currentTask}</p>
                  )}
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <div className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider", STATUS_CONFIG[p.status].cls)}>
                    {STATUS_CONFIG[p.status].label}
                  </div>
                  {p.phone && (
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer" title={p.phone}>
                      <Phone size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Patrol Zone Status */}
          <div className="card-premium overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900">Patrol Zone Status</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {patrolZones.map((z) => (
                <div key={z.zone} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div>
                    <div className="text-[13px] font-semibold text-gray-800">{z.zone}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{z.officer} · {z.lastCheck}</div>
                  </div>
                  <div className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider",
                    z.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                    z.status === "responding" ? "bg-red-50 text-red-700 border-red-200 animate-pulse" :
                    "bg-gray-100 text-gray-500 border-gray-200"
                  )}>
                    {z.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incident Log */}
          <div className="card-premium overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900">Today's Incidents</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {incidentLog.map((inc, i) => (
                <div key={i} className="px-5 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold font-mono text-gray-400">{inc.time}</span>
                    <div className={cn("w-1.5 h-1.5 rounded-full shrink-0",
                      inc.severity === "high" ? "bg-red-500" : inc.severity === "medium" ? "bg-amber-500" : "bg-gray-300"
                    )} />
                  </div>
                  <p className="text-[12px] font-medium text-gray-700">{inc.description}</p>
                  <p className="text-[10px] text-blue-600 font-semibold mt-0.5">↳ {inc.officer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
