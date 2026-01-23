import { NextRequest, NextResponse } from "next/server";
import { getApiUser } from "@/lib/auth";
import { getMealById } from "@/lib/mealdb";
import { createServerClient } from "@/lib/supabase/server";

/**
 * GET /api/recipes/[id]
 * Get detailed information for a specific recipe from MealDB
 * Also checks if the recipe is saved by the current user
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { error: authError } = await getApiUser();
    if (authError) return authError;

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Invalid recipe ID" }, { status: 400 });
    }

    // Fetch meal from MealDB
    const meal = await getMealById(id);

    if (!meal) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    // Check if recipe is saved
    const supabase = await createServerClient();
    const { data: savedRecipes } = await supabase
      .from("saved_recipes")
      .select("recipe_id")
      .eq("recipe_id", id)
      .single();

    const isSaved = !!savedRecipes;
    return NextResponse.json({ ...meal, isSaved });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
