import { NextRequest, NextResponse } from "next/server";
import { getApiUser } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase/server";
import { ItemInsert } from "@/types/database";

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await getApiUser();
    if (authError) return authError;

    const body: ItemInsert = await request.json();

    // Validate required fields
    if (!body.name || !body.quantity || !body.expiry_date) {
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 }
      );
    }

    // Ensure user_id matches session
    const itemData: ItemInsert = {
      ...body,
      user_id: user.id,
      quantity: body.quantity,
    };

    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("items")
      .insert([itemData])
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
    const { user, error: authError } = await getApiUser();
    if (authError) return authError;

    const supabase = await createServerClient();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let query = supabase
      .from("items")
      .select("*")
      .eq("user_id", user.id)
      .order("expiry_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });

    // Optional: server-side search by name
    if (search) {
      query = query.ilike("name", `%${search}%`);
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
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
