/**
 * Client-side Supabase hooks for data fetching
 * Use these in client components as an alternative to API routes
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { InventoryStats } from "@/types";

export function useInventoryStats(daysAhead = 2) {
  return useQuery({
    queryKey: ["items", "inventory-stats", daysAhead],
    queryFn: async (): Promise<InventoryStats> => {
      const now = new Date();
      const nowISO = now.toISOString();

      const soon = new Date();
      soon.setDate(now.getDate() + daysAhead);
      const soonISO = soon.toISOString();

      const [totalResult, expiredResult, expiringSoonResult] =
        await Promise.all([
          supabase.from("items").select("*", { count: "exact", head: true }),

          supabase
            .from("items")
            .select("*", { count: "exact", head: true })
            .lt("expiry_date", nowISO),

          supabase
            .from("items")
            .select("*", { count: "exact", head: true })
            .gte("expiry_date", nowISO)
            .lte("expiry_date", soonISO),
        ]);

      if (totalResult.error) throw totalResult.error;
      if (expiredResult.error) throw expiredResult.error;
      if (expiringSoonResult.error) throw expiringSoonResult.error;

      return {
        total: totalResult.count ?? 0,
        expired: expiredResult.count ?? 0,
        expiringSoon: expiringSoonResult.count ?? 0,
      };
    },
  });
}
