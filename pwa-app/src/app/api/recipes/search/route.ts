import { NextRequest, NextResponse } from "next/server";
import { searchRecipes } from "@/lib/spoonacular";
import { getApiUser } from "@/lib/auth";

/**
 * GET /api/recipes/search
 * Full recipe search with images and details
 * Query params:
 *   - query: search term (required)
 *   - number: max results (default: 12)
 */
export async function GET(request: NextRequest) {
  try {
    const { error: authError } = await getApiUser();
    if (authError) return authError;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const numberParam = parseInt(searchParams.get("number") || "10", 12);

    if (!query.trim()) {
      return NextResponse.json([]);
    }

    // Search recipes from Spoonacular
    const results = await searchRecipes({
      query,
      number: numberParam,
    });

    // Transform to match RecipeOverview type expected by frontend
    const recipes = results.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
    }));

    return NextResponse.json(recipes);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
