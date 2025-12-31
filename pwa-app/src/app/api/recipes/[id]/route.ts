import { NextRequest, NextResponse } from "next/server";
import {
  SpoonacularRecipeDetail,
  RecipeDetail,
  SpoonacularAnalyzedInstruction,
} from "@/types/recipes";
import { getApiUser } from "@/lib/auth";

const API_BASE = "https://api.spoonacular.com/recipes";
const API_KEY = process.env.SPOONACULAR_API_KEY;

// Utility to convert HTML to plain text
function htmlToPlainText(html: string) {
  return html
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/\s*p\s*>/gi, "\n")
    .replace(/<\/\s*li\s*>/gi, "\n")
    .replace(/<[^>]+>/g, "") // remove remaining tags
    .replace(/\n{2,}/g, "\n") // collapse multiple newlines
    .trim();
}

/**
 * Convert Spoonacular detailed recipe to our simplified RecipeDetail format
 */
function convertToRecipeDetail(
  spoonRecipe: SpoonacularRecipeDetail
): RecipeDetail {
  // Extract instructions
  let instructions = spoonRecipe.instructions?.trim() || "";

  // If it contains HTML, clean it
  if (instructions.includes("<")) {
    const plain = htmlToPlainText(instructions);

    // If it was a list, turn lines into numbered steps
    const lines = plain
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (lines.length > 1) {
      instructions = lines.map((line, i) => `${i + 1}. ${line}`).join("\n\n");
    } else {
      instructions = plain;
    }
  }

  // If still empty, fallback to analyzedInstructions
  if (!instructions && spoonRecipe.analyzedInstructions?.length > 0) {
    const steps = spoonRecipe.analyzedInstructions[0]?.steps || [];
    instructions = steps.map((s) => `${s.number}. ${s.step}`).join("\n\n");
  }

  return {
    id: spoonRecipe.id,
    title: spoonRecipe.title,
    image: spoonRecipe.image,
    servings: spoonRecipe.servings,
    totalTime: spoonRecipe.readyInMinutes,
    cookingTime: spoonRecipe.cookingMinutes,
    preparationTime: spoonRecipe.preparationMinutes,
    sourceUrl: spoonRecipe.sourceUrl,
    cuisines: spoonRecipe.cuisines,
    ketogenic: spoonRecipe.ketogenic,
    vegan: spoonRecipe.vegan,
    vegetarian: spoonRecipe.vegetarian,
    dishTypes: spoonRecipe.dishTypes,
    ingredients: spoonRecipe.extendedIngredients.map((ing) => ({
      id: ing.id,
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit,
      original: ing.original,
    })),
    summary: spoonRecipe.summary,
    instructions: instructions,
    winePairing:
      spoonRecipe.winePairing && spoonRecipe.winePairing.pairedWines?.length > 0
        ? {
            pairedWines: spoonRecipe.winePairing.pairedWines,
            pairingText: spoonRecipe.winePairing.pairingText,
          }
        : null,
  };
}

/**
 * GET /api/recipes/[id]
 * Get detailed information for a specific recipe from Spoonacular
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error: authError } = await getApiUser();
    if (authError) return authError;

    const { id } = await params;

    if (!id || !id.match(/^\d+$/)) {
      return NextResponse.json({ error: "Invalid recipe ID" }, { status: 400 });
    }

    if (!API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const recipeId = parseInt(id, 10);

    // Fetch recipe details and analyzed instructions in parallel
    const queryParams = new URLSearchParams({
      addWinePairing: "true",
      apiKey: API_KEY,
    });

    const instructionsParams = new URLSearchParams({
      apiKey: API_KEY,
    });

    const [recipeResponse, instructionsResponse] = await Promise.all([
      fetch(`${API_BASE}/${recipeId}/information?${queryParams.toString()}`),
      fetch(
        `${API_BASE}/${recipeId}/analyzedInstructions?${instructionsParams.toString()}`
      ),
    ]);

    if (!recipeResponse.ok) {
      if (recipeResponse.status === 404) {
        return NextResponse.json(
          { error: "Recipe not found" },
          { status: 404 }
        );
      }
      throw new Error(`Spoonacular API error: ${recipeResponse.status}`);
    }

    const spoonacularData: SpoonacularRecipeDetail =
      await recipeResponse.json();

    // Fetch and merge analyzed instructions if available
    if (instructionsResponse.ok) {
      const analyzedInstructions: SpoonacularAnalyzedInstruction[] =
        await instructionsResponse.json();
      if (
        Array.isArray(analyzedInstructions) &&
        analyzedInstructions.length > 0
      ) {
        spoonacularData.analyzedInstructions = analyzedInstructions;
      }
    }

    // Convert to our simplified format
    const recipeDetail = convertToRecipeDetail(spoonacularData);

    return NextResponse.json(recipeDetail);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
