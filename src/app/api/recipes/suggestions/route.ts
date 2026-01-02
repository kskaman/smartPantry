import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import {
  RecipeOverview,
  SpoonacularRecipeByIngredients,
} from "@/types/recipes";
import { searchRecipesByIngredients } from "@/lib/spoonacular";
import { getApiUser } from "@/lib/auth";

/**
 * Convert Spoonacular recipe to our RecipeWithIngredients format
 */
function convertSpoonacularRecipe(
  spoonRecipe: SpoonacularRecipeByIngredients,
  matchScore: number = 0
): RecipeOverview {
  const availableIngredients = spoonRecipe.usedIngredients?.map(
    (ingredient) => ({
      id: ingredient.id,
      name: ingredient.name,
    })
  );
  const unavailableIngredients = spoonRecipe.missedIngredients?.map(
    (ingredient) => ({
      id: ingredient.id,
      name: ingredient.name,
    })
  );

  const ingredients = availableIngredients ? [...availableIngredients] : [];
  if (unavailableIngredients) {
    ingredients.push(...unavailableIngredients);
  }
  return {
    id: spoonRecipe.id,
    title: spoonRecipe.title,
    image: spoonRecipe.image,
    matchScore: matchScore,
    matchedIngredients: availableIngredients
      ? availableIngredients.map((ingredient) => ingredient.name)
      : [],
    unMatchedIngredients: unavailableIngredients
      ? unavailableIngredients.map((ingredient) => ingredient.name)
      : [],
  };
}

/**
 * GET /api/recipes/suggestions
 * Get recipe suggestions based on inventory items
 * Query params:
 *   - number: number of results (default: 10)
 */
export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await getApiUser();
    if (authError) return authError;

    const supabase = await createServerClient();

    // Get user's inventory items
    const { data: userItems, error: itemsError } = await supabase
      .from("items")
      .select("*")
      .eq("user_id", user.id);

    const ingredients = userItems
      ? userItems.map((item) => item.name).join(", ")
      : "";

    if (itemsError) {
      return NextResponse.json(
        { error: "Failed to fetch inventory" },
        { status: 500 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const numberParam = parseInt(searchParams.get("number") || "10", 8);

    // Search recipes from Spoonacular
    const searchResults = await searchRecipesByIngredients(
      ingredients,
      numberParam
    );

    if (!searchResults || searchResults.length === 0) {
      return NextResponse.json([]);
    }

    // Convert to our format and calculate match scores if requested
    // Note: searchResults is of type SearchResult[] which includes all needed fields
    const recipesWithMatches: RecipeOverview[] = (
      searchResults as Array<SpoonacularRecipeByIngredients>
    ).map((recipe: SpoonacularRecipeByIngredients) => {
      const matchScore =
        recipe.usedIngredientCount && recipe.missedIngredientCount
          ? recipe.usedIngredientCount /
            (recipe.usedIngredientCount + recipe.missedIngredientCount)
          : 0;

      return convertSpoonacularRecipe(recipe, matchScore);
    });

    // Sort by match score if inventory matching is enabled
    if (recipesWithMatches.length > 0) {
      recipesWithMatches.sort((a, b) => {
        if (b.matchScore! !== a.matchScore!) {
          return b.matchScore! - a.matchScore!;
        }
        return a.title.localeCompare(b.title);
      });
    }

    return NextResponse.json(recipesWithMatches);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
