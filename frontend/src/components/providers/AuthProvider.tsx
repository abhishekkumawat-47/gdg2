"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setAuthenticated, setAuthLoading, setUnauthenticated } from "@/store/slices/authSlice";
import { setUserRole } from "@/store/slices/systemSlice";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { loadSupabaseProfile } from "@/lib/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let active = true;
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      dispatch(setUnauthenticated());
      return;
    }

    dispatch(setAuthLoading());

    const syncSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!active) {
        return;
      }

      const session = data.session;
      if (!session?.user) {
        dispatch(setUnauthenticated());
        return;
      }

      const profile = await loadSupabaseProfile(session.user);
      if (!active) {
        return;
      }

      dispatch(setAuthenticated(profile));
      dispatch(setUserRole(profile.role));
    };

    void syncSession();

    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!active) {
        return;
      }

      if (!session?.user) {
        dispatch(setUnauthenticated());
        return;
      }

      const profile = await loadSupabaseProfile(session.user);
      if (!active) {
        return;
      }

      dispatch(setAuthenticated(profile));
      dispatch(setUserRole(profile.role));
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [dispatch]);

  return <>{children}</>;
}
