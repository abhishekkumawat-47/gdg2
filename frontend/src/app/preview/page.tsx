"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageSquareText, ShieldAlert, Sparkles, View } from "lucide-react";
import { SITE_LOGO_PATH } from "@/lib/branding";

const previewCards = [
  { label: "Guests Present", value: "87", sub: "Live occupancy" },
  { label: "Staff Present", value: "24", sub: "On duty now" },
  { label: "Active Alerts", value: "3", sub: "Requires action" },
  { label: "System Active", value: "100%", sub: "Monitoring online" },
];

export default function PreviewPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_0%_0%,rgba(37,99,235,0.12),transparent_36%),linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-4 py-8 md:px-8">
      <section className="mx-auto max-w-[1320px] space-y-4">
        <div className="surface-card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-blue-100 bg-white">
              <Image src={SITE_LOGO_PATH} alt="CrisisControl logo" fill className="object-cover" sizes="48px" priority />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">CrisisControl Preview</p>
              <h1 className="text-2xl font-semibold text-gray-900">Public dashboard preview</h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/login" className="inline-flex h-10 items-center rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              Go to login
            </Link>
            <Link href="/" className="inline-flex h-10 items-center gap-1 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800">
              Live dashboard <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <section className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          This preview is public. The live dashboard at / is protected by Google auth.
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {previewCards.map((item) => (
            <article key={item.label} className="surface-card p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500">{item.sub}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-12">
          <article className="surface-card p-4 xl:col-span-8">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Live Heatmap</h2>
              <span className="text-xs text-gray-500">Preview mode</span>
            </div>
            <div className="grid h-[280px] place-items-center rounded-lg border border-dashed border-gray-300 bg-[linear-gradient(0deg,#f8fafc_1px,transparent_1px),linear-gradient(90deg,#f8fafc_1px,transparent_1px)] bg-[size:20px_20px] text-center">
              <div>
                <View size={26} className="mx-auto text-blue-700" />
                <p className="mt-2 text-sm text-gray-600">Hotel map and AR overlays will appear here once connected.</p>
              </div>
            </div>
          </article>

          <div className="space-y-3 xl:col-span-4">
            <article className="surface-card p-4">
              <h3 className="text-sm font-semibold text-gray-900">Broadcast Preview</h3>
              <div className="mt-2 space-y-2 text-sm text-gray-700">
                <p className="inline-flex items-center gap-2"><MessageSquareText size={15} className="text-gray-500" /> SMS workflow ready</p>
                <p className="inline-flex items-center gap-2"><ShieldAlert size={15} className="text-gray-500" /> Alert escalation visible</p>
                <p className="inline-flex items-center gap-2"><Sparkles size={15} className="text-gray-500" /> Google auth on live route</p>
              </div>
            </article>
          </div>
        </section>
      </section>
    </main>
  );
}
