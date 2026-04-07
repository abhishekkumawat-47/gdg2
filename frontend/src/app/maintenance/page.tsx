"use client";

import { useMemo, useState } from "react";
import { Activity, CalendarClock, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

type TaskStatus = "pending" | "in-progress" | "blocked" | "completed";

interface Task {
  id: string;
  title: string;
  area: string;
  assignedTo: string;
  due: string;
  status: TaskStatus;
}

const tasks: Task[] = [
  { id: "MNT-200", title: "Sprinkler pressure test", area: "Floor 3", assignedTo: "Dev Kumar", due: "Today 15:00", status: "in-progress" },
  { id: "MNT-199", title: "HVAC filter replacement", area: "Server room", assignedTo: "Mina Joshi", due: "Today 17:00", status: "pending" },
  { id: "MNT-198", title: "Emergency light check", area: "Floor 2", assignedTo: "Sunita Rao", due: "Tomorrow", status: "completed" },
  { id: "MNT-197", title: "Water leakage fix", area: "Corridor B", assignedTo: "Mina Joshi", due: "Today 14:00", status: "blocked" },
  { id: "MNT-196", title: "Camera lens cleaning", area: "Gate B", assignedTo: "Aman Singh", due: "This week", status: "pending" },
];

const statusClass = {
  pending: "bg-gray-100 text-gray-700",
  "in-progress": "bg-blue-50 text-blue-700",
  blocked: "bg-gray-900 text-white",
  completed: "bg-gray-50 text-gray-600",
} as const;

export default function MaintenancePage() {
  const [status, setStatus] = useState<TaskStatus | "all">("all");

  const data = useMemo(() => tasks.filter((task) => status === "all" || task.status === status), [status]);

  return (
    <div className="mx-auto max-w-[1320px] space-y-5 pb-20">
      <section className="surface-card p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Maintenance</p>
        <h1 className="mt-1 text-2xl font-semibold text-gray-900">Maintenance Control</h1>
        <p className="mt-2 text-sm text-gray-600">Manage scheduled tasks, system health, and service logs.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="surface-card p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-gray-500">Open Tasks</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{tasks.filter((item) => item.status !== "completed").length}</p>
        </article>
        <article className="surface-card p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-gray-500">System Health</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">96%</p>
          <p className="mt-1 text-xs text-gray-500">8 checks completed today</p>
        </article>
        <article className="surface-card p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-gray-500">Crew Availability</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">4 / 5</p>
          <p className="mt-1 text-xs text-gray-500">One technician offline</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-12">
        <article className="surface-card p-4 lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-gray-900">Scheduled Tasks</h2>
            <div className="flex gap-2">
              {(["all", "pending", "in-progress", "blocked", "completed"] as const).map((s) => (
                <button key={s} onClick={() => setStatus(s)} className={cn("h-8 rounded-lg border px-2 text-xs font-semibold capitalize", status === s ? "border-gray-900 bg-gray-900 text-white" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100")}>{s}</button>
              ))}
            </div>
          </div>
          <div className="mt-3 divide-y divide-gray-100 rounded-lg border border-gray-200">
            {data.map((task) => (
              <div key={task.id} className="flex flex-col gap-2 p-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{task.title}</p>
                  <p className="mt-1 text-xs text-gray-500">{task.id} | {task.area} | {task.assignedTo}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-600"><CalendarClock size={12} /> {task.due}</span>
                  <span className={cn("rounded-md px-2 py-1 text-xs font-semibold capitalize", statusClass[task.status])}>{task.status}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <div className="space-y-4 lg:col-span-4">
          <article className="surface-card p-4">
            <h2 className="text-sm font-semibold text-gray-900">System Health Indicators</h2>
            <div className="mt-3 space-y-3">
              {[
                { label: "Fire systems", value: 94 },
                { label: "HVAC", value: 97 },
                { label: "Power backup", value: 99 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-xs text-gray-600"><span>{item.label}</span><span>{item.value}%</span></div>
                  <div className="h-1.5 rounded-full bg-gray-100"><div className="h-1.5 rounded-full bg-blue-700" style={{ width: `${item.value}%` }} /></div>
                </div>
              ))}
            </div>
          </article>

          <article className="surface-card p-4 text-sm text-gray-700">
            <p className="inline-flex items-center gap-2"><Activity size={15} className="text-gray-500" /> Last sync: 2 minutes ago</p>
            <p className="mt-2 inline-flex items-center gap-2"><Wrench size={15} className="text-gray-500" /> 3 maintenance logs awaiting review</p>
          </article>
        </div>
      </section>
    </div>
  );
}
