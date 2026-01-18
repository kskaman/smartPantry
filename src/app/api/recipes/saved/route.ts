import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getApiUser } from "@/lib/auth";

/**
 * GET /api/recipes/saved
 * Get all saved recipes for the current user
 */
export async function GET() {
  try {
    const { error: authError } = await getApiUser();
    if (authError) return authError;

    const supabase = await createServerClient();

    const { data: savedRecipes, error } = await supabase
      .from("saved_recipes")
      .select("recipe_id, recipe_title, recipe_image")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch saved recipes" },
        { status: 500 },
      );
    }

    // Transform to RecipeOverview format
    const transformedRecipes = (savedRecipes || []).map((recipe) => ({
      id: recipe.recipe_id,
      title: recipe.recipe_title,
      image: recipe.recipe_image,
    }));

    return NextResponse.json(transformedRecipes);
  } catch {
    return NextResponse.json({ status: 500 });
  }
}

/**
 * POST /api/recipes/saved
 * Save a recipe for the current user
 * Body: { recipeId: string, recipeTitle: string, recipeImage: string }
 */
export async function POST(request: Request) {
  try {
    const { user, error: authError } = await getApiUser();
    if (authError) return authError;

    const body = await request.json();
    const { recipeId, recipeTitle, recipeImage } = body;

    if (!recipeId || !recipeTitle) {
      return NextResponse.json(
        { error: "recipeId and recipeTitle are required" },
        { status: 400 },
      );
    }

    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("saved_recipes")
      .insert({
        user_id: user.id,
        recipe_id: recipeId,
        recipe_title: recipeTitle,
        recipe_image: recipeImage,
      })
      .select()
      .single();

    if (error) {
      // Handle duplicate save (user already saved this recipe)
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Recipe already saved" },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { error: "Failed to save recipe" },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error saving Recipe" }, { status: 500 });
  }
}
