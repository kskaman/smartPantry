import { NextRequest, NextResponse } from "next/server";
import { getRecipeNameSuggestions } from "@/lib/spoonacular";
import { getApiUser } from "@/lib/auth";

/**
 * GET /api/recipes/search/autocomplete
 * Get recipe name suggestions for search input autocomplete (cheap API call)
 * Returns just recipe titles for dropdown suggestions
 * Query params:
 *   - query: search term (required)
 *   - number: max suggestions (default: 5)
 */
export async function GET(request: NextRequest) {
  try {
    const { error: authError } = await getApiUser();
    if (authError) return authError;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const numberParam = parseInt(searchParams.get("number") || "10", 5);

    if (!query.trim()) {
      return NextResponse.json([]);
    }

    // Get suggestions from Spoonacular (cheap API call - just titles)
    const suggestions = await getRecipeNameSuggestions(query, numberParam);

    // Extract just the titles for autocomplete
    const titles = suggestions.map((s) => s.title);
    return NextResponse.json(titles);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
