"use client";

import { useCallback, useMemo, useState } from "react";
import { Clock3, Filter, MessageSquareText, Rows3, Send, Timer, View } from "lucide-react";
import { Select } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { finishSendingSMS, startSendingSMS, type SMSLog as BroadcastLog } from "@/store/slices/smsSlice";
import { broadcastSMS, parsePhoneList } from "@/lib/smsApi";
import { cn } from "@/lib/utils";

type LogStatus = "all" | BroadcastLog["status"];
type AudienceTarget = "all" | "floor-3" | "security" | "maintenance" | "custom";

const deliveryClass: Record<BroadcastLog["status"], string> = {
  queued: "bg-amber-50 text-amber-700",
  sending: "bg-blue-50 text-blue-700",
  sent: "bg-emerald-50 text-emerald-700",
  partial: "bg-gray-100 text-gray-700",
  failed: "bg-gray-50 text-gray-500",
};

const audienceRecipients: Record<Exclude<AudienceTarget, "custom">, string[]> = {
  all: ["+15551230001", "+15551230002", "+15551230003", "+15551230004"],
  "floor-3": ["+15551230001", "+15551230002"],
  security: ["+15559870001", "+15559870002"],
  maintenance: ["+15557650001", "+15557650002"],
};

const PAGE_SIZE = 4;

export default function SMSPage() {
  const dispatch = useAppDispatch();
  const { logs, isSending } = useAppSelector((state) => state.sms);
  const currentUser = useAppSelector((state) => state.auth.profile);
  const [mode, setMode] = useState<"table" | "timeline">("table");
  const [status, setStatus] = useState<LogStatus>("all");
  const [page, setPage] = useState(1);
  const [target, setTarget] = useState<AudienceTarget>("all");
  const [message, setMessage] = useState("FIRE ALERT: Floor 3 Room 305. Evacuate via Staircase B.");
  const [recipients, setRecipients] = useState(audienceRecipients.all.join(", "));
  const [error, setError] = useState<string | null>(null);

  const audienceOptions = useMemo(
    () => [
      { label: "All occupants", value: "all" },
      { label: "Floor 3", value: "floor-3" },
      { label: "Security team", value: "security" },
      { label: "Maintenance", value: "maintenance" },
      { label: "Custom number list", value: "custom" },
    ],
    []
  );

  const statusOptions = useMemo(
    () => [
      { label: "All delivery", value: "all" },
      { label: "Queued", value: "queued" },
      { label: "Sending", value: "sending" },
      { label: "Sent", value: "sent" },
      { label: "Partial", value: "partial" },
      { label: "Failed", value: "failed" },
    ],
    []
  );

  const selectedRecipients = useMemo(
    () => (target === "custom" ? parsePhoneList(recipients) : audienceRecipients[target as Exclude<AudienceTarget, "custom">]),
    [recipients, target]
  );

  const filtered = useMemo(() => logs.filter((item) => status === "all" || item.status === status), [logs, status]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);

  const data = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const handleBroadcast = useCallback(async () => {
    const trimmedMessage = message.trim();
    const targetList = target === "custom" ? parsePhoneList(recipients) : audienceRecipients[target as Exclude<AudienceTarget, "custom">];

    if (!trimmedMessage) {
      setError("Message is required.");
      return;
    }

    if (targetList.length === 0) {
      setError("Add at least one phone number in E.164 format.");
      return;
    }

    setError(null);
    const messageId = `SMS-${Date.now()}`;
    const targetLabel = audienceOptions.find((item) => item.value === target)?.label ?? "Audience";

    dispatch(
      startSendingSMS({
        id: messageId,
        message: trimmedMessage,
        target: target === "custom" ? "custom" : target,
        targetLabel,
        recipientCount: targetList.length,
        priority: "critical",
        sentBy: currentUser?.fullName ?? currentUser?.email ?? "Operator",
      })
    );

    try {
      const response = await broadcastSMS({ users: targetList, message: trimmedMessage });
      dispatch(
        finishSendingSMS({
          id: messageId,
          successCount: response.summary.sent,
          failedCount: response.summary.failed,
        })
      );

      if (target === "custom") {
        setRecipients("");
      }
      setMessage("");
    } catch (sendError) {
      dispatch(finishSendingSMS({ id: messageId, successCount: 0, failedCount: targetList.length }));
      setError(sendError instanceof Error ? sendError.message : "Failed to send SMS broadcast.");
    }
  }, [audienceOptions, currentUser?.email, currentUser?.fullName, dispatch, message, recipients, target]);

  return (
    <div className="mx-auto max-w-[1320px] space-y-5 pb-20">
      <section className="surface-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Communications</p>
            <h1 className="mt-1 text-2xl font-semibold text-gray-900">Broadcast Messaging</h1>
            <p className="mt-2 text-sm text-gray-600">Clear, user-friendly broadcast controls with delivery visibility.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg border border-gray-300 p-1">
              <button onClick={() => setMode("table")} className={cn("inline-flex h-8 cursor-pointer items-center gap-1 rounded-md px-2 text-xs font-semibold", mode === "table" ? "bg-gray-900 text-white" : "text-gray-700")}> <Rows3 size={13} /> Table</button>
              <button onClick={() => setMode("timeline")} className={cn("inline-flex h-8 cursor-pointer items-center gap-1 rounded-md px-2 text-xs font-semibold", mode === "timeline" ? "bg-gray-900 text-white" : "text-gray-700")}> <View size={13} /> Timeline</button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-12">
        <article className="surface-card p-4 xl:col-span-5">
          <h2 className="text-sm font-semibold text-gray-900">Send Broadcast Message</h2>
          <div className="mt-3 space-y-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Audience</label>
              <Select options={audienceOptions} value={target} onChange={(value) => setTarget(value as AudienceTarget)} className="mt-1 w-full" />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 min-h-[120px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                maxLength={240}
              />
              <p className="mt-1 text-xs text-gray-500">{message.length} / 240</p>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Recipient Numbers</label>
              <textarea
                value={target === "custom" ? recipients : audienceRecipients[target as Exclude<AudienceTarget, "custom">].join(", ")}
                onChange={(e) => setRecipients(e.target.value)}
                className="mt-1 min-h-[92px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="+15551234567, +15557654321"
                disabled={target !== "custom" || isSending}
              />
              <p className="mt-1 text-xs text-gray-500">
                {target === "custom" ? "Paste comma or newline separated E.164 numbers." : `${selectedRecipients.length} numbers selected from the audience group.`}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button className="h-9 cursor-pointer rounded-lg border border-gray-300 px-3 text-xs font-medium text-gray-700 hover:bg-gray-100">Template: Fire Alert</button>
              <button className="h-9 cursor-pointer rounded-lg border border-gray-300 px-3 text-xs font-medium text-gray-700 hover:bg-gray-100">Template: All Clear</button>
              <button className="h-9 cursor-pointer rounded-lg border border-gray-300 px-3 text-xs font-medium text-gray-700 hover:bg-gray-100">Template: Medical</button>
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button onClick={handleBroadcast} disabled={isSending} className="inline-flex h-10 cursor-pointer items-center justify-center gap-1 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
              <Send size={14} /> {isSending ? "Broadcasting..." : "Broadcast Message"}
            </button>
          </div>
        </article>

        <article className="surface-card p-4 xl:col-span-7">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Delivery Logs</h2>
            <Select options={statusOptions} value={status} onChange={(value) => { setStatus(value as LogStatus); setPage(1); }} className="w-40" />
          </div>

          {mode === "table" ? (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="hidden w-full text-sm md:table">
                <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-4 py-2.5 text-left">ID</th>
                    <th className="px-4 py-2.5 text-left">Audience</th>
                    <th className="px-4 py-2.5 text-left">Message</th>
                    <th className="px-4 py-2.5 text-center">Recipients</th>
                    <th className="px-4 py-2.5 text-center">Success</th>
                    <th className="px-4 py-2.5 text-center">Failed</th>
                    <th className="px-4 py-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.id} className="border-t border-gray-100">
                      <td className="px-4 py-2.5 text-gray-500">{row.id}</td>
                      <td className="px-4 py-2.5 font-medium text-gray-900">{row.targetLabel}</td>
                      <td className="px-4 py-2.5 text-gray-700">{row.message}</td>
                      <td className="px-4 py-2.5 text-center text-gray-900">{row.recipientCount}</td>
                      <td className="px-4 py-2.5 text-center text-gray-700">{row.successCount}</td>
                      <td className="px-4 py-2.5 text-center text-gray-700">{row.failedCount}</td>
                      <td className="px-4 py-2.5 text-right"><span className={cn("rounded-md px-2 py-1 text-xs font-semibold capitalize", deliveryClass[row.status])}>{row.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="grid gap-3 p-3 md:hidden">
                {data.map((row) => (
                  <article key={row.id} className="rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">{row.id}</p>
                      <span className={cn("rounded-md px-2 py-1 text-xs font-semibold capitalize", deliveryClass[row.status])}>{row.status}</span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-gray-900">{row.targetLabel}</p>
                    <p className="mt-1 text-sm text-gray-700">{row.message}</p>
                    <p className="mt-2 text-xs text-gray-500">{row.timestamp} | Sent {row.successCount} | Failed {row.failedCount} | Total {row.recipientCount}</p>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <ol className="space-y-3">
              {data.map((row) => (
                <li key={row.id} className="rounded-lg border border-gray-200 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{row.targetLabel}</p>
                      <p className="mt-1 text-sm text-gray-700">{row.message}</p>
                      <p className="mt-2 text-xs text-gray-500">{row.id}</p>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <p className="inline-flex items-center gap-1"><Clock3 size={12} /> {row.timestamp}</p>
                      <p className="mt-1 inline-flex items-center gap-1"><Timer size={12} /> {row.successCount} / {row.recipientCount}</p>
                      <p className="mt-1"><span className={cn("rounded-md px-2 py-1 font-semibold capitalize", deliveryClass[row.status])}>{row.status}</span></p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}

          <div className="mt-3 flex items-center justify-between">
            <p className="inline-flex items-center gap-1 text-xs text-gray-500"><Filter size={13} /> {filtered.length} results</p>
            <div className="inline-flex items-center gap-2">
              <button disabled={safePage <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="h-8 cursor-pointer rounded-lg border border-gray-300 px-3 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50">Prev</button>
              <span className="text-xs text-gray-500">Page {safePage} / {pageCount}</span>
              <button disabled={safePage >= pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} className="h-8 cursor-pointer rounded-lg border border-gray-300 px-3 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50">Next</button>
            </div>
          </div>
        </article>
      </section>

      <div className="inline-flex items-center gap-1 text-xs text-gray-500"><MessageSquareText size={13} /> AR hotel view can be connected here later for contextual broadcast targeting.</div>
    </div>
  );
}
