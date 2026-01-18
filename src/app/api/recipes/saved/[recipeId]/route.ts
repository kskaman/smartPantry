import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getApiUser } from "@/lib/auth";

/**
 * DELETE /api/recipes/saved/[recipeId]
 * Unsave a recipe for the current user
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ recipeId: string }> },
) {
  try {
    const { error: authError } = await getApiUser();
    if (authError) return authError;

    const { recipeId } = await params;

    if (!recipeId) {
      return NextResponse.json(
        { error: "recipeId is required" },
        { status: 400 },
      );
    }

    const supabase = await createServerClient();

    const { error } = await supabase
      .from("saved_recipes")
      .delete()
      .eq("recipe_id", recipeId);

    if (error) {
      return NextResponse.json(
        { error: "Failed to unsave recipe" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Error unsaving recipe" },
      { status: 500 },
    );
  }
}
