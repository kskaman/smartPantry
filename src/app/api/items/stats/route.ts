import { NextResponse } from "next/server";
import { getApiUser } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const { error: authError } = await getApiUser();
    if (authError) return authError;

    const supabase = await createServerClient();
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const nowISO = now.toISOString();

    const sevenDaysLater = new Date(now);
    sevenDaysLater.setDate(now.getDate() + 7);
    const sevenDaysISO = sevenDaysLater.toISOString();

    // Run all queries in parallel for better performance
    // RLS automatically filters by user_id
    const [totalResult, expiredResult, expiringSoonResult, freshResult] = await Promise.all([
      supabase.from("items").select("*", { count: "exact", head: true }),

      supabase
        .from("items")
        .select("*", { count: "exact", head: true })
        .lt("expiry_date", nowISO),

      supabase
        .from("items")
        .select("*", { count: "exact", head: true })
        .gte("expiry_date", nowISO)
        .lt("expiry_date", sevenDaysISO),

      supabase
        .from("items")
        .select("*", { count: "exact", head: true })
        .or(`expiry_date.gte.${sevenDaysISO},expiry_date.is.null`),
    ]);

    if (totalResult.error) throw totalResult.error;
    if (expiredResult.error) throw expiredResult.error;
    if (expiringSoonResult.error) throw expiringSoonResult.error;
    if (freshResult.error) throw freshResult.error;

    return NextResponse.json({
      total: totalResult.count ?? 0,
      fresh: freshResult.count ?? 0,
      expired: expiredResult.count ?? 0,
      expiringSoon: expiringSoonResult.count ?? 0,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch inventory stats" },
      { status: 500 }
    );
  }
}
