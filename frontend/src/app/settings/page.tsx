"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"account" | "preferences" | "security">("account");
  const [name, setName] = useState("Admin Operator");
  const [email, setEmail] = useState("admin@facility.io");
  const [timezone, setTimezone] = useState("UTC+05:30");
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const canSave = useMemo(() => name.trim().length > 1 && email.includes("@"), [email, name]);

  const onSave = async () => {
    if (!canSave) return;
    setSaved(false);
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSaving(false);
    setSaved(true);
  };

  return (
    <div className="mx-auto max-w-[980px] space-y-5 pb-20">
      <section className="surface-card p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Settings</p>
        <h1 className="mt-1 text-2xl font-semibold text-gray-900">Workspace Settings</h1>
        <p className="mt-2 text-sm text-gray-600">Manage account profile, communication preferences, and security controls.</p>
      </section>

      <section className="surface-card p-4">
        <div className="inline-flex rounded-lg border border-gray-300 p-1">
          {([
            ["account", "Account"],
            ["preferences", "Preferences"],
            ["security", "Security"],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={cn(
                "h-8 rounded-md px-3 text-xs font-semibold",
                activeTab === value ? "bg-gray-900 text-white" : "text-gray-700"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === "account" && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm text-gray-700">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Display Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none" />
            </label>
            <label className="space-y-1 text-sm text-gray-700">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Email</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none" />
            </label>
            <label className="space-y-1 text-sm text-gray-700 sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Timezone</span>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none">
                <option>UTC+00:00</option>
                <option>UTC+05:30</option>
                <option>UTC-05:00</option>
              </select>
            </label>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="mt-4 space-y-3">
            <ToggleRow label="Enable SMS alerts" enabled={smsEnabled} onToggle={() => setSmsEnabled((v) => !v)} />
            <ToggleRow label="Enable email alerts" enabled={emailEnabled} onToggle={() => setEmailEnabled((v) => !v)} />
          </div>
        )}

        {activeTab === "security" && (
          <div className="mt-4 space-y-3">
            <ToggleRow label="Multi-factor authentication" enabled={mfaEnabled} onToggle={() => setMfaEnabled((v) => !v)} />
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
              <p className="inline-flex items-center gap-2 font-medium"><ShieldCheck size={15} className="text-gray-600" /> Session policy</p>
              <p className="mt-1 text-xs text-gray-600">Auto-lock after 15 minutes of inactivity.</p>
            </div>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-500">Validation: {canSave ? "Ready to save" : "Please complete required fields"}</p>
          <button onClick={onSave} disabled={!canSave || saving} className="inline-flex h-9 items-center rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {saved && (
          <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-700">
            <CheckCircle2 size={14} /> Settings saved successfully.
          </p>
        )}
      </section>
    </div>
  );
}

function ToggleRow({ label, enabled, onToggle }: { label: string; enabled: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
      <p className="text-sm text-gray-700">{label}</p>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={onToggle}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          enabled ? "bg-blue-700" : "bg-gray-300"
        )}
      >
        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform", enabled ? "translate-x-5" : "translate-x-0.5")} />
      </button>
    </div>
  );
}
