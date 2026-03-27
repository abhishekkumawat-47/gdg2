import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SMSTarget = 'all' | 'floor-1' | 'floor-2' | 'floor-3' | 'security' | 'staff' | 'maintenance' | 'custom';
export type SMSPriority = 'normal' | 'urgent' | 'critical';
export type SMSStatus = 'queued' | 'sending' | 'sent' | 'partial' | 'failed';

export interface SMSLog {
  id: string;
  timestamp: string;
  message: string;
  target: SMSTarget;
  targetLabel: string;
  recipientCount: number;
  successCount: number;
  failedCount: number;
  queuedCount: number;
  status: SMSStatus;
  priority: SMSPriority;
  sentBy: string;
}

interface SMSState {
  logs: SMSLog[];
  isSending: boolean;
  activeRecipients: number;
  totalSent: number;
  totalFailed: number;
}

const initialState: SMSState = {
  logs: [],
  isSending: false,
  activeRecipients: 0,
  totalSent: 0,
  totalFailed: 0,
};

export const smsSlice = createSlice({
  name: 'sms',
  initialState,
  reducers: {
    startSendingSMS: (
      state,
      action: PayloadAction<{
        id: string;
        message: string;
        target: SMSTarget;
        targetLabel: string;
        recipientCount: number;
        priority: SMSPriority;
        sentBy: string;
      }>
    ) => {
      state.isSending = true;
      state.activeRecipients = action.payload.recipientCount;
      const newLog: SMSLog = {
        id: action.payload.id,
        timestamp: new Date().toISOString(),
        message: action.payload.message,
        target: action.payload.target,
        targetLabel: action.payload.targetLabel,
        recipientCount: action.payload.recipientCount,
        successCount: 0,
        failedCount: 0,
        queuedCount: action.payload.recipientCount,
        status: 'queued',
        priority: action.payload.priority,
        sentBy: action.payload.sentBy,
      };
      state.logs.unshift(newLog); // newest first
    },

    updateSMSProgress: (
      state,
      action: PayloadAction<{ id: string; successCount: number; failedCount: number }>
    ) => {
      const log = state.logs.find((l) => l.id === action.payload.id);
      if (log) {
        log.status = 'sending';
        log.successCount = action.payload.successCount;
        log.failedCount = action.payload.failedCount;
        log.queuedCount = log.recipientCount - action.payload.successCount - action.payload.failedCount;
      }
    },

    finishSendingSMS: (
      state,
      action: PayloadAction<{ id: string; successCount: number; failedCount: number }>
    ) => {
      state.isSending = false;
      const log = state.logs.find((l) => l.id === action.payload.id);
      if (log) {
        log.successCount = action.payload.successCount;
        log.failedCount = action.payload.failedCount;
        log.queuedCount = 0;
        if (action.payload.failedCount === 0) {
          log.status = 'sent';
        } else if (action.payload.successCount === 0) {
          log.status = 'failed';
        } else {
          log.status = 'partial';
        }
        state.totalSent += action.payload.successCount;
        state.totalFailed += action.payload.failedCount;
      }
    },

    clearSMSLogs: (state) => {
      state.logs = [];
      state.totalSent = 0;
      state.totalFailed = 0;
    },
  },
});

export const { startSendingSMS, updateSMSProgress, finishSendingSMS, clearSMSLogs } = smsSlice.actions;
export default smsSlice.reducer;
