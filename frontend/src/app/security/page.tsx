"use client";

import { useMemo, useState } from "react";
import { BarChart3, Shield, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditLog {
  id: string;
  actor: string;
  action: string;
  resource: string;
  time: string;
  risk: "low" | "medium" | "high";
}

const logs: AuditLog[] = [
  { id: "SEC-301", actor: "john.mercer", action: "door_lock_override", resource: "Gate B", time: "14:18", risk: "high" },
  { id: "SEC-300", actor: "sarah.okafor", action: "camera_feed_access", resource: "Floor 3 Corridor", time: "14:12", risk: "medium" },
  { id: "SEC-299", actor: "system", action: "failed_badge_attempt", resource: "North Entrance", time: "13:58", risk: "high" },
  { id: "SEC-298", actor: "raj.sharma", action: "patrol_checkpoint", resource: "Stairwell N", time: "13:47", risk: "low" },
  { id: "SEC-297", actor: "system", action: "policy_update_applied", resource: "Access Rule Set", time: "13:20", risk: "medium" },
];

const riskBadge = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-blue-50 text-blue-700",
  high: "bg-gray-900 text-white",
} as const;

export default function SecurityPage() {
  const [riskFilter, setRiskFilter] = useState<"all" | "low" | "medium" | "high">("all");

  const filtered = useMemo(() => logs.filter((log) => riskFilter === "all" || log.risk === riskFilter), [riskFilter]);

  return (
    <div className="mx-auto max-w-[1320px] space-y-5 pb-20">
      <section className="surface-card p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Security</p>
        <h1 className="mt-1 text-2xl font-semibold text-gray-900">Security Operations</h1>
        <p className="mt-2 text-sm text-gray-600">Audit trail monitoring, risk posture, and access-control visibility.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="surface-card p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-gray-500">High Risk Events</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{logs.filter((item) => item.risk === "high").length}</p>
        </article>
        <article className="surface-card p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-gray-500">Access Controls</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">18 Rules</p>
          <p className="mt-1 text-xs text-gray-500">2 pending approval</p>
        </article>
        <article className="surface-card p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-gray-500">Audit Health</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">99.2%</p>
          <p className="mt-1 text-xs text-gray-500">Stream continuity this week</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-12">
        <article className="surface-card p-4 lg:col-span-8">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Audit Logs</h2>
            <div className="flex gap-2">
              {(["all", "low", "medium", "high"] as const).map((risk) => (
                <button key={risk} onClick={() => setRiskFilter(risk)} className={cn("h-8 rounded-lg border px-2 text-xs font-semibold capitalize", riskFilter === risk ? "border-gray-900 bg-gray-900 text-white" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100")}>{risk}</button>
              ))}
            </div>
          </div>
          <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-3 py-2 text-left">ID</th>
                  <th className="px-3 py-2 text-left">Actor</th>
                  <th className="px-3 py-2 text-left">Action</th>
                  <th className="px-3 py-2 text-left">Resource</th>
                  <th className="px-3 py-2 text-left">Time</th>
                  <th className="px-3 py-2 text-right">Risk</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-t border-gray-100">
                    <td className="px-3 py-2 text-xs text-gray-500">{row.id}</td>
                    <td className="px-3 py-2 text-gray-800">{row.actor}</td>
                    <td className="px-3 py-2 text-gray-700">{row.action}</td>
                    <td className="px-3 py-2 text-gray-700">{row.resource}</td>
                    <td className="px-3 py-2 text-gray-600">{row.time}</td>
                    <td className="px-3 py-2 text-right"><span className={cn("rounded-md px-2 py-1 text-xs font-semibold capitalize", riskBadge[row.risk])}>{row.risk}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <div className="space-y-4 lg:col-span-4">
          <article className="surface-card p-4">
            <h2 className="text-sm font-semibold text-gray-900">Risk Indicators</h2>
            <div className="mt-3 space-y-3">
              {[
                { label: "Badge anomalies", value: 6 },
                { label: "Camera blind spots", value: 2 },
                { label: "Privilege escalations", value: 1 },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="surface-card p-4">
            <h2 className="text-sm font-semibold text-gray-900">Access Control Overview</h2>
            <div className="mt-3 space-y-2 text-sm text-gray-700">
              <p className="inline-flex items-center gap-2"><Shield size={15} className="text-gray-500" /> 4 admin policies active</p>
              <p className="inline-flex items-center gap-2"><ShieldAlert size={15} className="text-gray-500" /> 2 conditional restrictions pending</p>
              <p className="inline-flex items-center gap-2"><BarChart3 size={15} className="text-gray-500" /> Weekly compliance score: 96%</p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
