"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { startSendingSMS, finishSendingSMS } from "@/store/slices/smsSlice";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Send, History} from "lucide-react";
import { cn } from "@/lib/utils";

export function SMSPanel() {
  const dispatch = useAppDispatch();
  const { isSending, logs, activeRecipients } = useAppSelector(state => state.sms);
  const { isEmergencySimulated } = useAppSelector(state => state.system);

  const [audience, setAudience] = useState("all");
  const [message, setMessage] = useState(isEmergencySimulated ? "FIRE ALERT: Floor 3 - Room 305. Evacuate via Staircase B immediately." : "");

  const audienceOptions = [
    { label: "Everyone (180)", value: "all" },
    { label: "Floor 3 Only (64)", value: "floor" },
    { label: "Emergency Team (15)", value: "custom" },
  ];

  const handleSend = () => {
    if (!message) return;
    
    const count = audience === "all" ? 180 : audience === "floor" ? 64 : 15;
    const target = audience === "all" ? "all" : audience === "floor" ? "floor-3" : "custom";
    const targetLabel = audience === "all" ? "Everyone" : audience === "floor" ? "Floor 3" : "Emergency Team";
    const messageId = Date.now().toString();
    
    dispatch(startSendingSMS({ 
      id: messageId, 
      message, 
      target: target as any,
      targetLabel,
      recipientCount: count,
      priority: isEmergencySimulated ? 'critical' : 'normal',
      sentBy: "Admin"
    }));
    
    setTimeout(() => {
      dispatch(finishSendingSMS({ 
        id: messageId, 
        successCount: count,
        failedCount: 0 
      }));
      setMessage("");
    }, 2500);
  };

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

        <Button 
          className={cn(
            "w-full font-bold h-11 gap-2 rounded-xl uppercase tracking-widest text-[11px] shadow-lg transition-all",
            isSending ? "bg-gray-100 text-gray-400" : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
          )}
          onClick={handleSend}
          disabled={isSending || message.length === 0}
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
