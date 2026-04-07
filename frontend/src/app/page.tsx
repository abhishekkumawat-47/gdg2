"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, MessageSquareText, ShieldAlert, Sparkles, UsersRound, View } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

const metricCards = [
  { label: "Guests Present", value: "87", sub: "Live occupancy" },
  { label: "Staff Present", value: "24", sub: "On duty now" },
  { label: "Active Alerts", value: "3", sub: "Requires action" },
  { label: "System Active", value: "100%", sub: "Monitoring online" },
];

const roleAlerts = [
  { role: "Security", owner: "John", text: "Fire reported - Check Staircase B" },
  { role: "Maintenance", owner: "Ann", text: "Fire alarm triggered on Floor 3" },
  { role: "Guests", owner: "Floor 3", text: "Evacuate through Staircase B" },
];

const logs = [
  { time: "14:22", role: "Security", msg: "Fire reported - Check Staircase B", status: "Sent" },
  { time: "14:17", role: "Maintenance", msg: "Fire alarm triggered on Floor 3", status: "Sent" },
  { time: "14:12", role: "Guests", msg: "Evacuate immediately via Staircase B", status: "Queued" },
];

export default function DashboardPage() {
  const profile = useAppSelector((state) => state.auth.profile);
  const now = useMemo(() => new Date().toLocaleString([], { hour: "2-digit", minute: "2-digit", month: "short", day: "2-digit" }), []);
  const greetingName = profile?.fullName ?? "Operator";
  const greetingRole = profile?.role ?? "staff";

  return (
    <div className="mx-auto max-w-[1320px] space-y-4 pb-20">
      <section className="surface-card p-4 md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">CrisisControl Dashboard</p>
            <h1 className="mt-1 text-xl font-semibold text-gray-900 md:text-2xl">Welcome back, {greetingName}</h1>
            <p className="mt-1 text-sm text-gray-600">Role: {greetingRole}. Fire alert at Floor 3 Room 305. Coordination and broadcasting currently active.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/sms" className="inline-flex h-9 items-center gap-1 rounded-lg bg-blue-700 px-3 text-sm font-medium text-white hover:bg-blue-800">
              <MessageSquareText size={14} /> Send SMS
            </Link>
            <button className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-300 px-3 text-sm text-gray-700 hover:bg-gray-100">
              <View size={14} /> AR View (Coming Soon)
            </button>
            <span className="inline-flex h-9 items-center rounded-lg border border-gray-300 px-3 text-xs font-semibold text-gray-500">Updated {now}</span>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-800">
        <p className="inline-flex items-center gap-1 font-semibold"><ShieldAlert size={14} /> Fire Alert</p>
        <p className="mt-0.5 text-red-700">Floor 3 Room 305 - Evacuate via Staircase B and keep elevators disabled.</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((item) => (
          <article key={item.label} className="surface-card p-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{item.label}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{item.value}</p>
            <p className="text-xs text-gray-500">{item.sub}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-12">
        <article className="surface-card p-3 xl:col-span-8">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Live Heatmap</h2>
            <span className="text-xs text-gray-500">Updated just now</span>
          </div>
          <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-3">
            <div className="grid h-[240px] place-items-center rounded-md border border-dashed border-gray-300 bg-[linear-gradient(0deg,#f8fafc_1px,transparent_1px),linear-gradient(90deg,#f8fafc_1px,transparent_1px)] bg-[size:20px_20px]">
              <p className="text-sm text-gray-500">Interactive hotel map area - AR layer ready placeholder</p>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {roleAlerts.map((item) => (
                <div key={item.role + item.owner} className="rounded-md border border-gray-200 bg-white p-2.5">
                  <p className="text-xs font-semibold text-gray-900">{item.owner} <span className="font-normal text-gray-500">- {item.role}</span></p>
                  <p className="mt-0.5 text-xs text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <div className="space-y-3 xl:col-span-4">
          <article className="surface-card p-3">
            <h3 className="text-sm font-semibold text-gray-900">Broadcast Shortcuts</h3>
            <div className="mt-2 space-y-2">
              <Link href="/sms" className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Send evacuation message <ArrowRight size={14} />
              </Link>
              <button className="flex w-full items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Notify emergency team <ArrowRight size={14} />
              </button>
              <button className="flex w-full items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Push hotel-wide advisory <ArrowRight size={14} />
              </button>
            </div>
          </article>

          <article className="surface-card p-3">
            <h3 className="text-sm font-semibold text-gray-900">AR Roadmap</h3>
            <p className="mt-1 text-xs text-gray-600">When your AR hotel view is ready, this panel can toggle AR overlays and route instructions.</p>
            <button className="mt-2 inline-flex h-8 items-center gap-1 rounded-md border border-gray-300 px-3 text-xs text-gray-700 hover:bg-gray-100">
              <Sparkles size={13} /> Enable AR controls later
            </button>
          </article>
        </div>
      </section>

      <section className="surface-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2.5">
          <h2 className="text-sm font-semibold text-gray-900">Alert Log</h2>
          <Link href="/alerts" className="text-xs font-medium text-blue-700 hover:text-blue-800">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Message</th>
                <th className="px-4 py-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((item) => (
                <tr key={item.time + item.role} className="border-t border-gray-100">
                  <td className="px-4 py-2.5 text-xs text-gray-500">{item.time}</td>
                  <td className="px-4 py-2.5 text-gray-700">{item.role}</td>
                  <td className="px-4 py-2.5 text-gray-700">{item.msg}</td>
                  <td className="px-4 py-2.5 text-right"><span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="inline-flex items-center gap-1 text-xs text-gray-500">
        <UsersRound size={13} />
        Humanized operations view active for CrisisControl.
      </section>
    </div>
  );
}
