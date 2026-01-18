import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { RecipeOverview, MealDBMeal } from "@/types/recipes";
import { filterMealsByIngredient, getMealById } from "@/lib/mealdb";
import { getApiUser } from "@/lib/auth";
import { getExpiryStatus } from "@/lib/expiry-utils";

interface IngredientWithExpiry {
  name: string;
  expiry_date: string | null;
  daysRemaining: number;
}

/**
 * Normalize ingredient names for consistent matching
 */
function normalizeName(name: string): string {
  return name.toLowerCase().trim();
}

/**
 * Extract ingredients from MealDB recipe
 */
function extractMealIngredients(meal: MealDBMeal): string[] {
  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}` as keyof MealDBMeal] as string;
    if (ingredient && ingredient.trim()) {
      ingredients.push(normalizeName(ingredient));
    }
  }
  return ingredients;
}

/**
 * Calculate comprehensive match score prioritizing expiring ingredients
 */
function calculateRecipeScore(
  recipeIngredients: string[],
  userIngredients: IngredientWithExpiry[],
): {
  totalIngredientsCount: number;
  expiringIngredientsCount: number;
  totalScore: number;
  matchedIngredientsCount: number;
  expiringIngredients: string[];
} {
  let expiringUsed = 0;
  let urgencyScore = 0;
  let matchedCount = 0;
  const expiringIngredients: string[] = [];

  // Check each recipe ingredient
  outerLoop: for (const recipeIngredient of recipeIngredients) {
    // Check if we have this ingredient
    for (const userIngredient of userIngredients) {
      const ingredientName = userIngredient.name;
      const ingredientDaysRemaining = userIngredient.daysRemaining;

      // Fuzzy match: exact, contains, or word match
      if (
        recipeIngredient === ingredientName ||
        recipeIngredient.includes(ingredientName) ||
        ingredientName.includes(recipeIngredient)
      ) {
        matchedCount++;

        // More urgent = higher score (0 days = 8 points, 7 days = 1 point)
        urgencyScore += Math.max(0, 8 - ingredientDaysRemaining);

        // Check if this ingredient is expiring
        if (ingredientDaysRemaining <= 7) {
          expiringUsed++;
          expiringIngredients.push(recipeIngredient);
        }
        continue outerLoop; // Found match, move to next recipe ingredient
      }
    }
  }

  const matchPercentage =
    recipeIngredients.length > 0 ? matchedCount / recipeIngredients.length : 0;
  const missingCount = recipeIngredients.length - matchedCount;

  // Scoring formula:
  // - Expiring items used: 1000 points each (highest priority)
  // - Urgency: up to 8 points per expiring item (more urgent = higher)
  // - Match percentage: up to 100 points (100% match = 100 points)
  // - Missing items: -5 points each (small penalty)
  const totalScore =
    expiringUsed * 1000 +
    urgencyScore +
    matchPercentage * 100 -
    missingCount * 5;

  return {
    expiringIngredientsCount: expiringUsed,
    matchedIngredientsCount: matchedCount,
    totalIngredientsCount: recipeIngredients.length,
    totalScore,
    expiringIngredients,
  };
}

/**
 * GET /api/recipes/suggestions
 * Progressive recipe collection prioritizing expiring ingredients
 */
export async function GET() {
  try {
    const { user, error: authError } = await getApiUser();
    if (authError) return authError;

    const supabase = await createServerClient();

    // Get user's inventory items sorted by expiry date
    // (ascending - most urgent first)
    // Only select columns we need for performance
    const { data: userItems, error: itemsError } = await supabase
      .from("items")
      .select("name, expiry_date")
      .eq("user_id", user.id)
      .gte("expiry_date", new Date().toISOString())
      .order("expiry_date", { ascending: true });

    if (itemsError) {
      return NextResponse.json(
        { error: "Failed to fetch Inventory Items" },
        { status: 500 },
      );
    }

    if (!userItems || userItems.length === 0) {
      return NextResponse.json([]);
    }

    // Separate expiring ( <= 7 days) and fresh items with days remaining
    const expiringItems: string[] = [];
    const freshItems: string[] = [];
    const userIngredients: IngredientWithExpiry[] = [];

    userItems.forEach(({ name, expiry_date }) => {
      const status = getExpiryStatus(expiry_date);
      if (!status || status.isExpired) return; // Skip expired items

      const itemWithExpiry: IngredientWithExpiry = {
        name: normalizeName(name),
        expiry_date: expiry_date,
        daysRemaining: status.daysRemaining,
      };

      userIngredients.push(itemWithExpiry);

      if (status.daysRemaining <= 7) {
        expiringItems.push(name);
      } else {
        freshItems.push(name);
      }
    });

    // Phase 1: Progressive recipe collection from expiring ingredients
    const mealIdsSet = new Set<string>();
    const MAX_RECIPE_IDS = 80;

    for (const item of expiringItems) {
      if (mealIdsSet.size >= MAX_RECIPE_IDS) break;

      const partialMeals = await filterMealsByIngredient(item);
      partialMeals.forEach((meal) => mealIdsSet.add(meal.idMeal));
    }

    // Phase 2: If < 80 recipes, search top fresh ingredients
    if (mealIdsSet.size < MAX_RECIPE_IDS && freshItems.length > 0) {
      for (const item of freshItems) {
        if (mealIdsSet.size >= MAX_RECIPE_IDS) break;

        const partialMeals = await filterMealsByIngredient(item);
        partialMeals.forEach((meal) => mealIdsSet.add(meal.idMeal));
      }
    }

    if (mealIdsSet.size === 0) {
      return NextResponse.json([]);
    }

    // Phase 3: Fetch full details for all recipes
    const fullMeals = await Promise.all(
      Array.from(mealIdsSet).map((id) => getMealById(id)),
    );

    const validMeals = fullMeals.filter(
      (meal): meal is MealDBMeal => meal !== null,
    );

    // Phase 4: Calculate scores for all recipes
    const recipesWithScores: RecipeOverview[] = validMeals.map((meal) => {
      const recipeIngredients = extractMealIngredients(meal);
      const scores = calculateRecipeScore(recipeIngredients, userIngredients);

      return {
        id: meal.idMeal,
        title: meal.strMeal,
        image: meal.strMealThumb,
        totalScore: scores.totalScore,
        totalIngredientsCount: scores.totalIngredientsCount,
        matchedIngredientsCount: scores.matchedIngredientsCount,
        expiringIngredientsCount: scores.expiringIngredientsCount,
        expiringIngredients: scores.expiringIngredients,
      };
    });

    // Phase 5: Sort by total score and return top 60
    recipesWithScores.sort((a, b) => b.totalScore! - a.totalScore!);

    const topRecipes = recipesWithScores.slice(0, 48);

    // Cache for 5 minutes since inventory doesn't change frequently
    return NextResponse.json(topRecipes, {
      headers: {
        "Cache-Control": "private, max-age=300, stale-while-revalidate=600",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
