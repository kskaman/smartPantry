import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { searchRecipes } from "@/lib/spoonacular";

/**
 * GET /api/recipes/search
 * Full recipe search with images and details
 * Query params:
 *   - query: search term (required)
 *   - number: max results (default: 12)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
