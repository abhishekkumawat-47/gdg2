"use client";

import { useMemo, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { startSendingSMS, finishSendingSMS } from "@/store/slices/smsSlice";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Send, History} from "lucide-react";
import { cn } from "@/lib/utils";
import { broadcastSMS, parsePhoneList } from "@/lib/smsApi";

export function SMSPanel() {
  const dispatch = useAppDispatch();
  const { isSending, logs } = useAppSelector(state => state.sms);
  const { isEmergencySimulated } = useAppSelector(state => state.system);

  const [audience, setAudience] = useState("all");
  const [message, setMessage] = useState(isEmergencySimulated ? "FIRE ALERT: Floor 3 - Room 305. Evacuate via Staircase B immediately." : "");
  const [recipients, setRecipients] = useState("");
  const [error, setError] = useState<string | null>(null);

  const audienceOptions = useMemo(
    () => [
      { label: "Everyone", value: "all" },
      { label: "Floor 3", value: "floor" },
      { label: "Emergency Team", value: "custom" },
    ],
    []
  );

  const handleSend = useCallback(async () => {
    const trimmedMessage = message.trim();
    const phones = parsePhoneList(recipients);
    if (!trimmedMessage) {
      setError("Message is required.");
      return;
    }
    if (phones.length === 0) {
      setError("Add at least one recipient phone number in E.164 format.");
      return;
    }

    setError(null);
    const targetLabel = audience === "all" ? "Everyone" : audience === "floor" ? "Floor 3" : "Emergency Team";
    const messageId = Date.now().toString();

    dispatch(startSendingSMS({ 
      id: messageId, 
      message: trimmedMessage,
      target: "custom",
      targetLabel,
      recipientCount: phones.length,
      priority: isEmergencySimulated ? 'critical' : 'normal',
      sentBy: "Admin"
    }));

    try {
      const response = await broadcastSMS({
        users: phones,
        message: trimmedMessage,
      });

      dispatch(finishSendingSMS({ 
        id: messageId, 
        successCount: response.summary.sent,
        failedCount: response.summary.failed,
      }));
      setMessage("");
      setRecipients("");
      if (response.summary.invalid > 0) {
        setError(`${response.summary.invalid} invalid recipient numbers were skipped.`);
      }
    } catch (sendError) {
      dispatch(finishSendingSMS({ id: messageId, successCount: 0, failedCount: phones.length }));
      setError(sendError instanceof Error ? sendError.message : "Failed to send SMS broadcast.");
    }
  }, [audience, dispatch, isEmergencySimulated, message, recipients]);

  return (
    <div className="card-premium flex flex-col group animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">Broadcast Center</h3>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1 gap-5">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between ml-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Audience</label>
            <span className="text-[10px] font-bold text-blue-500 hover:underline cursor-pointer">Manage List</span>
          </div>
          <Select 
            options={audienceOptions} 
            value={audience} 
            onChange={setAudience} 
            className="w-full bg-white"
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Crisis Message</label>
          <textarea
            className="flex-1 w-full p-4 text-sm font-medium text-gray-700 bg-gray-50 border border-transparent hover:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100/50 focus:border-blue-500/30 rounded-xl transition-all resize-none placeholder:text-gray-300"
            placeholder="Type emergency alert here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSending}
            maxLength={200}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Recipients (E.164)</label>
          <textarea
            className="w-full min-h-[80px] p-3 text-xs font-medium text-gray-700 bg-gray-50 border border-transparent hover:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500/30 rounded-xl transition-all resize-y placeholder:text-gray-300"
            placeholder="+15551234567, +15557654321"
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            disabled={isSending}
          />
        </div>

        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

        <Button 
          className={cn(
            "w-full font-bold h-11 gap-2 rounded-xl uppercase tracking-widest text-[11px] shadow-lg transition-all",
            isSending ? "bg-gray-100 text-gray-400" : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
          )}
          onClick={handleSend}
          disabled={isSending || message.trim().length === 0}
        >
          {isSending ? (
            <span className="flex items-center gap-2 animate-pulse">
               <History size={14} className="animate-spin" />
               Transmitting...
            </span>
          ) : (
            <>
               <Send size={14} /> Send Broadcast
            </>
          )}
        </Button>

        {/* Dynamic Log Preview */}
        {logs.length > 0 && (
          <div className="mt-2 space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              <History size={12} /> 
              Recent Activity
            </div>
            <div className="max-h-24 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
              {[...logs].reverse().slice(0, 2).map((log) => (
                <div key={log.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 animate-in fade-in">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-blue-600">{log.recipientCount} Recipients</span>
                    <span className="text-[10px] font-medium text-gray-400">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-[11px] font-medium text-gray-600 truncate">{log.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
