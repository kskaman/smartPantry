import { NextRequest, NextResponse } from "next/server";
import { getApiUser } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase/server";
import { ItemInsert } from "@/types/database";

export async function POST(request: NextRequest) {
  try {
    const { error: authError } = await getApiUser();
    if (authError) return authError;

    const body: ItemInsert = await request.json();

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

    return NextResponse.json(data, { status: 201 });
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
    const filter = searchParams.get("filter"); // 'expired' | 'expiring-soon'

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
      // Get items expiring within the next 2 days (today <= expiry_date < today + 2 days)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const twoDaysLater = new Date(today);
      twoDaysLater.setDate(twoDaysLater.getDate() + 2);
      query = query
        .gte("expiry_date", today.toISOString())
        .lt("expiry_date", twoDaysLater.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to fetch items" },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
