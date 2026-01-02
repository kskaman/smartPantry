import { NextRequest, NextResponse } from "next/server";
import { getApiUser } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase/server";
import { ItemUpdate } from "@/types/database";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error: authError } = await getApiUser();
    if (authError) return authError;

    const { id } = await params;
    const body: ItemUpdate = await request.json();

    const supabase = await createServerClient();

    // First verify the item belongs to the user
    const { data: existingItem, error: fetchError } = await supabase
      .from("items")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !existingItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    if (existingItem.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update the item
    const { data, error } = await supabase
      .from("items")
      .update(body)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to update item" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error: authError } = await getApiUser();
    if (authError) return authError;

    const { id } = await params;

    const supabase = await createServerClient();

    // First verify the item belongs to the user
    const { data: existingItem, error: fetchError } = await supabase
      .from("items")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !existingItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    if (existingItem.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the item
    const { error } = await supabase
      .from("items")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to delete item" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
