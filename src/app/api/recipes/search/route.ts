import { NextRequest, NextResponse } from "next/server";
import { searchMealsByName } from "@/lib/mealdb";
import { getApiUser } from "@/lib/auth";
import { RecipeOverview } from "@/types/recipes";

/**
 * GET /api/recipes/search?query={searchTerm}
 * Search for recipes by name using MealDB API
 * Query params:
 *   - query: search term (required)
 */
export async function GET(request: NextRequest) {
  try {
    const { error: authError } = await getApiUser();
    if (authError) return authError;

    // Get query parameter
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";

    if (!query.trim()) {
      return NextResponse.json([]);
    }

    // Search recipes from MealDB
    const meals = await searchMealsByName(query);
    // Transform to RecipeOverview type
    const recipes: RecipeOverview[] = meals.map((meal) => ({
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
    }));

    return NextResponse.json(recipes);
  } catch {
    return NextResponse.json(
      { error: "Failed to search recipes" },
      { status: 500 }
    );
  }
}
