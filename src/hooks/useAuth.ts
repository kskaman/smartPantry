"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export const authKeys = {
  all: ["auth"] as const,
  session: () => [...authKeys.all, "session"] as const,
};

export function useSession() {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: async (): Promise<Session | null> => {
      const { data, error } = await supabase.auth.getSession();
      if (error) return null;
      return data.session;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useUser(): User | null {
  const { data: session } = useSession();
  return session?.user ?? null;
}

export function useUserId(): string | null {
  const user = useUser();
  return user?.id ?? null;
}

/**
 * Keeps React Query in sync if user logs in/out in another tab or after redirect.
 * Put this once in your app (e.g., in a Providers component).
 */
export function useAuthSync() {
  const qc = useQueryClient();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      qc.setQueryData(authKeys.session(), session);
    });

    return () => sub.subscription.unsubscribe();
  }, [qc]);
}
