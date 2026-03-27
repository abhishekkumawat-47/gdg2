"use client";

import { useState } from "react";
import { Wrench, CheckCircle2, Clock, AlertTriangle, Zap, Droplets, Wind, Shield, HardHat, Plus, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { MaintenanceTask, RolePersonnel } from "@/types";

const tasks: MaintenanceTask[] = [
  { id: "m1", title: "Fire sprinkler inspection — Floor 3",         zone: "Floor 3",     floor: "Floor 3", priority: "critical", status: "in-progress", assignedTo: "Dev Kumar",    dueDate: "Today 15:00",  category: "safety" },
  { id: "m2", title: "HVAC filter replacement — Server Room",       zone: "Server Room", floor: "Floor 3", priority: "high",     status: "pending",     assignedTo: "Mina Joshi",   dueDate: "Today 17:00",  category: "hvac" },
  { id: "m3", title: "Elevator B routine inspection",               zone: "Central",     floor: "All",     priority: "medium",   status: "pending",     assignedTo: "Dev Kumar",    dueDate: "Tomorrow",     category: "general" },
  { id: "m4", title: "Emergency lighting battery check",            zone: "Corridor",    floor: "Floor 2", priority: "high",     status: "completed",   assignedTo: "Sunita Rao",   dueDate: "09:00",        category: "electrical" },
  { id: "m5", title: "Water leak repair — Corridor B",              zone: "Corridor B",  floor: "Floor 1", priority: "high",     status: "in-progress", assignedTo: "Mina Joshi",   dueDate: "Today 14:00",  category: "plumbing" },
  { id: "m6", title: "CCTV camera lens cleaning — Gate B",          zone: "Gate B",      floor: "Ground",  priority: "low",      status: "pending",     assignedTo: "Dev Kumar",    dueDate: "This week",    category: "safety" },
  { id: "m7", title: "Fire extinguisher re-certification",          zone: "All Floors",  floor: "All",     priority: "medium",   status: "completed",   assignedTo: "Sunita Rao",   dueDate: "08:30",        category: "safety" },
  { id: "m8", title: "Air conditioning noise — Conference 302",     zone: "Conf. 302",   floor: "Floor 3", priority: "low",      status: "blocked",     assignedTo: "Mina Joshi",   dueDate: "Tomorrow",     category: "hvac" },
];

const maintenanceCrew: RolePersonnel[] = [
  { id: "mn1", name: "Dev Kumar",    role: "maintenance", badge: "MNT-01", zone: "Floor 3", floor: "Floor 3", status: "active",    lastSeen: "2m ago", currentTask: "Fire sprinkler inspection" },
  { id: "mn2", name: "Mina Joshi",   role: "maintenance", badge: "MNT-02", zone: "Floor 1", floor: "Floor 1", status: "active",    lastSeen: "5m ago", currentTask: "Water leak repair" },
  { id: "mn3", name: "Sunita Rao",   role: "maintenance", badge: "MNT-03", zone: "Floor 2", floor: "Floor 2", status: "idle",      lastSeen: "15m ago", currentTask: undefined },
  { id: "mn4", name: "Aman Singh",   role: "maintenance", badge: "MNT-04", zone: "—",       floor: "—",       status: "offline",   lastSeen: "3h ago", currentTask: undefined },
];

const PRIORITY_CONFIG = {
  critical: { cls: "bg-red-600 text-white",           label: "Critical" },
  high:     { cls: "bg-red-100 text-red-700 border border-red-200", label: "High" },
  medium:   { cls: "bg-amber-100 text-amber-700 border border-amber-200", label: "Medium" },
  low:      { cls: "bg-gray-100 text-gray-600 border border-gray-200", label: "Low" },
};

const STATUS_CONFIG = {
  "in-progress": { cls: "bg-blue-50 text-blue-700 border-blue-200",    label: "In Progress", icon: <Clock size={11} /> },
  "pending":     { cls: "bg-amber-50 text-amber-700 border-amber-200", label: "Pending",     icon: <AlertTriangle size={11} /> },
  "completed":   { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Done",  icon: <CheckCircle2 size={11} /> },
  "blocked":     { cls: "bg-red-50 text-red-700 border-red-200",       label: "Blocked",     icon: <AlertTriangle size={11} /> },
};

export default function MaintenancePage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const filtered = tasks.filter((t) => {
    const sOk = statusFilter === "all" || t.status === statusFilter;
    const pOk = priorityFilter === "all" || t.priority === priorityFilter;
    return sOk && pOk;
  });

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Operations</h1>
          <p className="text-sm text-gray-400 mt-0.5">Task queue, crew status, and equipment inspection tracking.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all cursor-pointer shadow-sm shadow-blue-100">
          <Plus size={15} /> Add Task
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Open Tasks",    value: tasks.filter(t => t.status === "pending").length },
          { label: "In Progress",   value: tasks.filter(t => t.status === "in-progress").length },
          { label: "Blocked",       value: tasks.filter(t => t.status === "blocked").length },
          { label: "Completed Today", value: tasks.filter(t => t.status === "completed").length },
        ].map((k) => (
          <div key={k.label} className="card-premium p-5">
            <div className="text-2xl font-bold">{k.value}</div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Task Queue */}
        <div className="xl:col-span-2 card-premium overflow-hidden flex flex-col">
          <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900 mr-2">Task Queue</h2>
            <Filter size={13} className="text-gray-400" />
            {["all", "pending", "in-progress", "blocked", "completed"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border transition-all cursor-pointer",
                  statusFilter === s ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
                )}
              >
                {s}
              </button>
            ))}
            <div className="h-4 w-px bg-gray-200 hidden md:block" />
            {["all", "critical", "high", "medium", "low"].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={cn(
                  "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border transition-all cursor-pointer",
                  priorityFilter === p
                    ? p === "critical" ? "bg-red-600 text-white border-red-600"
                      : p === "high" ? "bg-red-100 text-red-700 border-red-300"
                      : "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
                )}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="divide-y divide-gray-50 overflow-auto flex-1 custom-scrollbar">
            {filtered.map((task) => (
              <div key={task.id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group cursor-pointer">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md italic tracking-widest", PRIORITY_CONFIG[task.priority].cls)}>
                      {PRIORITY_CONFIG[task.priority].label}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">{task.title}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 font-medium">
                    <span className="flex items-center gap-1"><HardHat size={10} />{task.assignedTo}</span>
                    <span>{task.zone}</span>
                    <span className="text-gray-300">·</span>
                    <span className={cn(task.priority === "critical" || task.priority === "high" ? "text-red-500 font-bold" : "")}>
                      Due: {task.dueDate}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <div className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider", STATUS_CONFIG[task.status].cls)}>
                    {STATUS_CONFIG[task.status].label}
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 px-2.5 py-1 text-[10px] font-bold text-blue-600 border border-blue-100 bg-blue-50 hover:bg-blue-100 rounded-md transition-all cursor-pointer">
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Crew Status */}
        <div className="card-premium overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900">Maintenance Crew</h2>
          </div>
          <div className="flex-1 divide-y divide-gray-50">
            {maintenanceCrew.map((m) => (
              <div key={m.id} className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white text-sm font-bold">
                    {m.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className={cn("absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white",
                    m.status === "active" ? "bg-emerald-500" :
                    m.status === "idle" ? "bg-gray-400" : "bg-red-400"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-gray-900">{m.name}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{m.badge} · {m.zone}</div>
                  {m.currentTask && (
                    <p className="text-[10px] text-blue-600 font-medium mt-0.5 truncate">{m.currentTask}</p>
                  )}
                </div>
                <div className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider",
                  m.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                  m.status === "idle" ? "bg-gray-100 text-gray-500 border-gray-200" :
                  "bg-red-50 text-red-500 border-red-200"
                )}>
                  {m.status}
                </div>
              </div>
            ))}
          </div>

          {/* Equipment summary */}
          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Equipment Status</h3>
            <div className="space-y-2">
              {[
                { label: "Fire Suppressors", ok: 28, total: 30 },
                { label: "Emergency Lights",  ok: 45, total: 48 },
                { label: "CCTV Cameras",      ok: 22, total: 24 },
              ].map((e) => (
                <div key={e.label}>
                  <div className="flex justify-between text-[11px] font-medium text-gray-600 mb-1">
                    <span>{e.label}</span>
                    <span className="font-bold">{e.ok}/{e.total}</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full",
                        e.ok / e.total < 0.9 ? "bg-amber-500" : "bg-emerald-500"
                      )}
                      style={{ width: `${Math.round((e.ok / e.total) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
