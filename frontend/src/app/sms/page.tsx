"use client";

import { useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  startSendingSMS,
  updateSMSProgress,
  finishSendingSMS,
  clearSMSLogs,
  SMSTarget,
  SMSPriority,
  SMSStatus,
  SMSLog,
} from "@/store/slices/smsSlice";
import {
  Send,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Trash2,
  Users,
  Building2,
  Shield,
  Wrench,
  UserCheck,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TARGET_OPTIONS: { value: SMSTarget; label: string; count: number; icon: React.ReactNode; color: string }[] = [
  { value: "all",         label: "Everyone",       count: 242, icon: <Users size={16} />,      color: "blue" },
  { value: "floor-1",     label: "Floor 1",         count: 78,  icon: <Building2 size={16} />,  color: "indigo" },
  { value: "floor-2",     label: "Floor 2",         count: 84,  icon: <Building2 size={16} />,  color: "indigo" },
  { value: "floor-3",     label: "Floor 3",         count: 64,  icon: <Building2 size={16} />,  color: "indigo" },
  { value: "security",    label: "Security Team",   count: 15,  icon: <Shield size={16} />,     color: "orange" },
  { value: "staff",       label: "Staff Only",      count: 38,  icon: <UserCheck size={16} />,  color: "green" },
  { value: "maintenance", label: "Maintenance",     count: 12,  icon: <Wrench size={16} />,     color: "yellow" },
];

const MESSAGE_TEMPLATES = [
  { label: "Fire Alert",      text: "🔴 FIRE ALERT — Floor 3, Room 305. Evacuate immediately via Staircase B. Do not use elevators." },
  { label: "Evacuation",      text: "⚠️ EVACUATION ORDER — Please proceed calmly to the nearest exit. Follow staff instructions." },
  { label: "All Clear",       text: "✅ ALL CLEAR — The emergency has been resolved. It is safe to return to your normal activities." },
  { label: "Hold in Place",   text: "🔒 SHELTER IN PLACE — An external threat has been reported. Lock doors and stay away from windows." },
  { label: "Staff Drill",     text: "📋 DRILL NOTICE — A scheduled emergency drill will begin in 5 minutes. Please cooperate with staff." },
];

const PRIORITY_OPTIONS: { value: SMSPriority; label: string; color: string; description: string }[] = [
  { value: "normal",   label: "Normal",   color: "gray",   description: "Standard notification" },
  { value: "urgent",   label: "Urgent",   color: "amber",  description: "Requires immediate attention" },
  { value: "critical", label: "Critical", color: "red",    description: "Life-safety priority" },
];

function StatusBadge({ status }: { status: SMSStatus }) {
  const config = {
    queued:   { icon: <Clock size={11} />,         label: "Queued",   cls: "bg-gray-100 text-gray-600 border-gray-200" },
    sending:  { icon: <RefreshCw size={11} className="animate-spin" />, label: "Sending", cls: "bg-blue-50 text-blue-600 border-blue-200" },
    sent:     { icon: <CheckCircle2 size={11} />,   label: "Delivered", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    partial:  { icon: <AlertTriangle size={11} />,  label: "Partial",  cls: "bg-amber-50 text-amber-700 border-amber-200" },
    failed:   { icon: <XCircle size={11} />,         label: "Failed",   cls: "bg-red-50 text-red-700 border-red-200" },
  }[status];

  return (
    <div className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider", config.cls)}>
      {config.icon}
      {config.label}
    </div>
  );
}

export default function SMSPage() {
  const dispatch = useAppDispatch();
  const { logs, isSending, totalSent, totalFailed } = useAppSelector((s) => s.sms);
  const { isEmergencySimulated } = useAppSelector((s) => s.system);

  const [target, setTarget] = useState<SMSTarget>("all");
  const [message, setMessage] = useState(
    isEmergencySimulated
      ? "🔴 FIRE ALERT — Floor 3, Room 305. Evacuate immediately via Staircase B. Do not use elevators."
      : ""
  );
  const [priority, setPriority] = useState<SMSPriority>("normal");
  const [filterStatus, setFilterStatus] = useState<SMSStatus | "all">("all");

  const selectedTarget = TARGET_OPTIONS.find((t) => t.value === target)!;

  const handleSend = useCallback(() => {
    if (!message.trim() || isSending) return;

    const id = Date.now().toString();
    const recipientCount = selectedTarget.count;

    dispatch(startSendingSMS({
      id,
      message,
      target,
      targetLabel: selectedTarget.label,
      recipientCount,
      priority,
      sentBy: "Admin",
    }));

    // Simulate progressive delivery
    let delivered = 0;
    const chunk = Math.ceil(recipientCount / 4);

    const interval = setInterval(() => {
      delivered = Math.min(delivered + chunk, recipientCount);
      const failed = Math.floor(Math.random() * 3); // 0-2 failures
      dispatch(updateSMSProgress({ id, successCount: delivered - failed, failedCount: failed }));

      if (delivered >= recipientCount) {
        clearInterval(interval);
        const finalFailed = priority === "critical" ? 0 : Math.floor(Math.random() * 3);
        setTimeout(() => {
          dispatch(finishSendingSMS({ id, successCount: recipientCount - finalFailed, failedCount: finalFailed }));
          setMessage("");
        }, 500);
      }
    }, 600);
  }, [message, isSending, target, priority, selectedTarget, dispatch]);

  const filteredLogs = filterStatus === "all" ? logs : logs.filter((l) => l.status === filterStatus);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <MessageSquare size={15} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Communications / SMS</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">SMS Broadcast Center</h1>
          <p className="text-sm text-gray-400 mt-0.5">Send targeted alerts to specific floors, roles, or everyone.</p>
        </div>
        <div className="flex items-center gap-3 text-right">
          <div className="text-xs text-gray-500">
            <div className="font-bold text-lg text-emerald-600">{totalSent}</div>
            <div className="text-[10px] uppercase tracking-wider">Total Sent</div>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div className="text-xs text-gray-500">
            <div className="font-bold text-lg text-red-500">{totalFailed}</div>
            <div className="text-[10px] uppercase tracking-wider">Failed</div>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div className="text-xs text-gray-500">
            <div className="font-bold text-lg text-gray-700">{logs.length}</div>
            <div className="text-[10px] uppercase tracking-wider">Broadcasts</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composer */}
        <div className="lg:col-span-1 card-premium p-6 flex flex-col gap-5">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Send size={15} className="text-blue-600" />
            Compose Broadcast
          </h2>

          {/* Target Selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target Audience</label>
            <div className="grid grid-cols-1 gap-1.5">
              {TARGET_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTarget(opt.value)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all cursor-pointer",
                    target === opt.value
                      ? "bg-blue-50 border-blue-300 text-blue-700"
                      : "bg-white border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <div className={cn(
                    "shrink-0",
                    target === opt.value ? "text-blue-600" : "text-gray-400"
                  )}>
                    {opt.icon}
                  </div>
                  <span className="flex-1 text-sm font-semibold">{opt.label}</span>
                  <span className="text-xs font-bold text-gray-400">{opt.count}</span>
                  {target === opt.value && (
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Priority Level</label>
            <div className="flex gap-2">
              {PRIORITY_OPTIONS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-lg border text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer",
                    priority === p.value
                      ? p.value === "critical" ? "bg-red-600 border-red-600 text-white"
                        : p.value === "urgent" ? "bg-amber-500 border-amber-500 text-white"
                        : "bg-gray-800 border-gray-800 text-white"
                      : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Templates */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quick Templates</label>
            <div className="flex flex-wrap gap-2">
              {MESSAGE_TEMPLATES.map((t) => (
                <button
                  key={t.label}
                  onClick={() => setMessage(t.text)}
                  className="px-2.5 py-1 text-[10px] font-bold bg-gray-50 hover:bg-blue-50 hover:text-blue-600 border border-gray-100 hover:border-blue-200 text-gray-600 rounded-md transition-all cursor-pointer"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message Composer */}
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex justify-between">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Message</label>
              <span className={cn(
                "text-[10px] font-bold",
                message.length > 160 ? "text-red-500" : "text-gray-400"
              )}>
                {message.length}/160
              </span>
            </div>
            <textarea
              className="flex-1 min-h-[120px] w-full p-4 text-sm font-medium text-gray-800 bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 rounded-xl transition-all resize-none placeholder:text-gray-300 outline-none"
              placeholder="Type your broadcast message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSending}
            />
          </div>

          {/* Recipient Summary */}
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-blue-800">Sending to:</span>
              <span className="font-bold text-blue-600">{selectedTarget.count} recipients</span>
            </div>
            <div className="text-[11px] text-blue-600 mt-0.5">{selectedTarget.label}</div>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={isSending || !message.trim()}
            className={cn(
              "w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer uppercase tracking-widest",
              priority === "critical" && !isSending
                ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-100"
                : priority === "urgent" && !isSending
                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-100"
                : !isSending
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            {isSending ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Transmitting to {selectedTarget.count} recipients...
              </>
            ) : (
              <>
                <Send size={16} />
                Send {priority !== "normal" && <span className="opacity-80">({priority})</span>}
              </>
            )}
          </button>
        </div>

        {/* Delivery Log */}
        <div className="lg:col-span-2 card-premium overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Clock size={15} className="text-blue-600" />
              Delivery Log
            </h2>
            <div className="flex items-center gap-2">
              {(["all", "sent", "sending", "queued", "partial", "failed"] as (SMSStatus | "all")[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={cn(
                    "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer border",
                    filterStatus === s
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
                  )}
                >
                  {s}
                </button>
              ))}
              <button
                onClick={() => dispatch(clearSMSLogs())}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                title="Clear logs"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          {filteredLogs.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center gap-3">
              <div className="p-4 bg-gray-50 rounded-full">
                <MessageSquare size={28} className="text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-400">No broadcasts yet</p>
              <p className="text-xs text-gray-300">Sent messages will appear here with delivery tracking.</p>
            </div>
          ) : (
            <div className="overflow-auto flex-1 custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b border-gray-50">
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Message</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Delivered</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Failed</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors group animate-in fade-in duration-300">
                      <td className="px-6 py-4">
                        <div className="text-[11px] font-bold text-gray-500 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                        </div>
                        <div className="text-[9px] text-gray-300 mt-0.5 uppercase tracking-wider">
                          {new Date(log.timestamp).toLocaleDateString([], { month: "short", day: "numeric" })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-sm text-gray-800">{log.targetLabel}</div>
                        <div className={cn(
                          "inline-block text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider mt-0.5",
                          log.priority === "critical" ? "bg-red-100 text-red-700" :
                          log.priority === "urgent" ? "bg-amber-100 text-amber-700" :
                          "bg-gray-100 text-gray-500"
                        )}>
                          {log.priority}
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-[220px]">
                        <p className="text-xs text-gray-600 font-medium line-clamp-2 leading-relaxed">{log.message}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-sm font-bold text-emerald-600">{log.successCount}</div>
                        <div className="text-[10px] text-gray-400">/ {log.recipientCount}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className={cn("text-sm font-bold", log.failedCount > 0 ? "text-red-500" : "text-gray-300")}>
                          {log.failedCount}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <StatusBadge status={log.status} />
                        {/* Progress bar for sending */}
                        {log.status === "sending" && (
                          <div className="mt-1.5 h-1 bg-gray-100 rounded-full overflow-hidden w-full">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.round(((log.successCount + log.failedCount) / log.recipientCount) * 100)}%` }}
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
