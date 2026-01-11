import { NextRequest, NextResponse } from "next/server";
import { getApiUser } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase/server";
import { Item } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { error: authError } = await getApiUser();
    if (authError) return authError;

    const body: Omit<Item, "id"> = await request.json();

    // Validate required fields
    if (!body.name || !body.quantity || !body.expiry_date) {
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    // RLS will automatically set user_id from session
    const { data, error } = await supabase
      .from("items")
      .insert([body])
      .select()
      .single();

    if (error) {
      console.log("Item POST error:", error);
      return NextResponse.json(
        { error: "Failed to create item" },
        { status: 500 }
      );
    }

    // Strip timestamps before returning to frontend
    const { created_at, updated_at, user_id, ...item } = data;
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { error: authError } = await getApiUser();
    if (authError) return authError;

    const supabase = await createServerClient();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const filter = searchParams.get("filter"); // 'expired' | 'expiring-soon' | 'fresh'

    // RLS automatically filters by user_id
    let query = supabase
      .from("items")
      .select("*")
      .order("expiry_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });

    // Server-side search by name
    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    // Server-side filtering by expiry status
    if (filter === "expired") {
      // Get items that have already expired (expiry_date < today)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query = query.lt("expiry_date", today.toISOString());
    } else if (filter === "expiring-soon") {
      // Get items expiring within the next 7 days (today <= expiry_date < today + 7 days)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sevenDaysLater = new Date(today);
      sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
      query = query
        .gte("expiry_date", today.toISOString())
        .lt("expiry_date", sevenDaysLater.toISOString());
    } else if (filter === "fresh") {
      // Get items expiring after 7 days or with no expiry date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sevenDaysLater = new Date(today);
      sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
      query = query.or(`expiry_date.gte.${sevenDaysLater.toISOString()},expiry_date.is.null`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to fetch items" },
        { status: 500 }
      );
    }

    // Strip timestamps and user_id before returning to frontend
    const items = (data || []).map(({ created_at, updated_at, user_id, ...item }) => item);
    return NextResponse.json(items);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
