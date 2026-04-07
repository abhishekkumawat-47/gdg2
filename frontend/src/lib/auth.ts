import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient, getSupabaseRedirectUrl, isSupabaseConfigured } from "@/lib/supabase";

export type AuthRole = "admin" | "security" | "staff" | "maintenance";

export interface AuthProfile {
  id: string;
  email: string;
  fullName: string;
  role: AuthRole;
  avatarUrl: string | null;
}

export async function signInWithGoogle() {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getSupabaseRedirectUrl(),
    },
  });
}

export async function signOutUser() {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return { error: null };
  }

  return supabase.auth.signOut();
}

function normalizeRole(role: string | null | undefined): AuthRole {
  if (role === "admin" || role === "security" || role === "maintenance" || role === "staff") {
    return role;
  }

  return "staff";
}

export function deriveFallbackProfile(user: User): AuthProfile {
  const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Operator";

  return {
    id: user.id,
    email: user.email ?? "",
    fullName,
    role: normalizeRole(user.user_metadata?.role),
    avatarUrl: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
  };
}

export async function loadSupabaseProfile(user: User): Promise<AuthProfile> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase || !isSupabaseConfigured) {
    return deriveFallbackProfile(user);
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,full_name,role,avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) {
    return deriveFallbackProfile(user);
  }

  return {
    id: data.id,
    email: data.email || user.email || "",
    fullName: data.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Operator",
    role: normalizeRole(data.role),
    avatarUrl: data.avatar_url ?? user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
  };
}
