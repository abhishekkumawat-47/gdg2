import { apiClient } from "@/lib/api";

export interface BroadcastSMSPayload {
  users: string[];
  message: string;
  max_concurrency?: number;
}

export interface BroadcastSMSResult {
  phone: string;
  status: "sent" | "failed";
  sid?: string;
  error?: string;
}

export interface BroadcastSMSResponse {
  status: "completed" | "completed_with_errors" | "no_valid_numbers";
  summary: {
    requested: number;
    deduplicated_valid: number;
    invalid: number;
    duplicates: number;
    sent: number;
    failed: number;
  };
  invalid_numbers: string[];
  duplicate_numbers: string[];
  results: BroadcastSMSResult[];
}

export interface SendSMSPayload {
  to_phone: string;
  message: string;
}

export async function sendSingleSMS(payload: SendSMSPayload): Promise<{ status: string; sid: string }> {
  const response = await apiClient.post("/sms/send", payload);
  return response.data;
}

export async function broadcastSMS(payload: BroadcastSMSPayload): Promise<BroadcastSMSResponse> {
  const response = await apiClient.post("/sms/broadcast", payload);
  return response.data;
}

export function parsePhoneList(input: string): string[] {
  return input
    .split(/[\n,;]/)
    .map((phone) => phone.trim())
    .filter(Boolean);
}
