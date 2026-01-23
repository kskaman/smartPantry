import { NextRequest, NextResponse } from "next/server";
import { getApiUser } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase/server";
import { Item } from "@/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error: authError } = await getApiUser();
    if (authError) return authError;

    const { id } = await params;
    const body: Omit<Item, "id"> = await request.json();

    const supabase = await createServerClient();

    // RLS will prevent updating items that don't belong to the user
    const { data, error } = await supabase
      .from("items")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) 
      return NextResponse.json(
        { error: "Failed to update item" },
        { status: 500 }
      );
    }

    // Strip timestamps before returning to frontend
    const { created_at, updated_at, user_id, ...item } = data;
    return NextResponse.json(item);
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
    const { error: authError } = await getApiUser();
    if (authError) return authError;

    const { id } = await params;

    const supabase = await createServerClient();

    // RLS will prevent deleting items that don't belong to the user
    const { error } = await supabase.from("items").delete().eq("id", id);

    if (error) {
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
