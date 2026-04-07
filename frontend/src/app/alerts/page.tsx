"use client";

import { Fragment, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Filter, Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

type Severity = "low" | "medium" | "high" | "critical";
type Status = "active" | "acknowledged" | "resolved";

interface AlertRow {
  id: string;
  title: string;
  severity: Severity;
  status: Status;
  location: string;
  createdAt: string;
  details: string;
}

const rows: AlertRow[] = [
  { id: "A-103", title: "Smoke sensor triggered", severity: "critical", status: "active", location: "Floor 3 - Room 305", createdAt: "14:22", details: "Immediate evacuation protocol activated for adjacent zones." },
  { id: "A-102", title: "Crowd density threshold exceeded", severity: "high", status: "acknowledged", location: "Main Lobby", createdAt: "14:10", details: "Security deployed to redistribute entry lines." },
  { id: "A-101", title: "Unauthorized badge attempt", severity: "medium", status: "resolved", location: "Gate B", createdAt: "13:58", details: "Attempt blocked and incident logged to audit trail." },
  { id: "A-100", title: "CCTV signal intermittent", severity: "low", status: "resolved", location: "Parking Level", createdAt: "13:31", details: "Connectivity normalized after network failover." },
];

const badge = {
  critical: "bg-gray-900 text-white",
  high: "bg-gray-100 text-gray-800",
  medium: "bg-blue-50 text-blue-700",
  low: "bg-gray-50 text-gray-600",
  active: "bg-blue-50 text-blue-700",
  acknowledged: "bg-gray-100 text-gray-700",
  resolved: "bg-gray-50 text-gray-600",
} as const;

export default function AlertsPage() {
  const [severity, setSeverity] = useState<Severity | "all">("all");
  const [status, setStatus] = useState<Status | "all">("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "severity">("newest");
  const [expanded, setExpanded] = useState<string | null>(null);

  const data = useMemo(() => {
    const result = rows.filter((row) => {
      const severityOk = severity === "all" || row.severity === severity;
      const statusOk = status === "all" || row.status === status;
      const text = `${row.title} ${row.location} ${row.id}`.toLowerCase();
      return severityOk && statusOk && text.includes(search.toLowerCase());
    });

    if (sort === "severity") {
      const rank: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
      return [...result].sort((a, b) => rank[a.severity] - rank[b.severity]);
    }
    return result;
  }, [search, severity, sort, status]);

  return (
    <div className="mx-auto max-w-[1320px] space-y-5 pb-20">
      <section className="surface-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Alerts</p>
            <h1 className="mt-1 text-2xl font-semibold text-gray-900">Incident Feed</h1>
            <p className="mt-2 text-sm text-gray-600">Filter, prioritize, and inspect all alerts in one compact view.</p>
          </div>
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:w-auto lg:grid-cols-4">
            <label className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or id" className="h-9 w-full rounded-lg border border-gray-300 pl-9 pr-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none" />
            </label>
            <select value={severity} onChange={(e) => setSeverity(e.target.value as Severity | "all")} className="h-9 rounded-lg border border-gray-300 px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none">
              <option value="all">All severity</option><option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value as Status | "all")} className="h-9 rounded-lg border border-gray-300 px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none">
              <option value="all">All status</option><option value="active">Active</option><option value="acknowledged">Acknowledged</option><option value="resolved">Resolved</option>
            </select>
            <button onClick={() => setSort((v) => (v === "newest" ? "severity" : "newest"))} className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-100">
              <SlidersHorizontal size={14} /> Sort: {sort}
            </button>
          </div>
        </div>
      </section>

      <section className="surface-card overflow-hidden">
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Alert</th>
                <th className="px-4 py-3 text-left">Severity</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">Time</th>
                <th className="px-4 py-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <Fragment key={row.id}>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{row.title}</p>
                      <p className="text-xs text-gray-500">{row.id}</p>
                    </td>
                    <td className="px-4 py-3"><span className={cn("rounded-md px-2 py-1 text-xs font-semibold capitalize", badge[row.severity])}>{row.severity}</span></td>
                    <td className="px-4 py-3"><span className={cn("rounded-md px-2 py-1 text-xs font-semibold capitalize", badge[row.status])}>{row.status}</span></td>
                    <td className="px-4 py-3 text-gray-700">{row.location}</td>
                    <td className="px-4 py-3 text-gray-600">{row.createdAt}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setExpanded((v) => (v === row.id ? null : row.id))} className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-800">
                        {expanded === row.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />} View
                      </button>
                    </td>
                  </tr>
                  {expanded === row.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="px-4 py-3 text-sm text-gray-700">{row.details}</td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-3 md:hidden">
          {data.map((row) => (
            <article key={row.id} className="rounded-lg border border-gray-200 p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{row.title}</p>
                  <p className="text-xs text-gray-500">{row.id}</p>
                </div>
                <span className="text-xs text-gray-500">{row.createdAt}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className={cn("rounded-md px-2 py-1 font-semibold capitalize", badge[row.severity])}>{row.severity}</span>
                <span className={cn("rounded-md px-2 py-1 font-semibold capitalize", badge[row.status])}>{row.status}</span>
              </div>
              <p className="mt-2 text-xs text-gray-600">{row.location}</p>
              <p className="mt-2 text-sm text-gray-700">{row.details}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-between text-xs text-gray-500">
        <p>{data.length} alerts shown</p>
        <span className="inline-flex items-center gap-1"><Filter size={13} /> Filters applied in real time</span>
      </section>
    </div>
  );
}
