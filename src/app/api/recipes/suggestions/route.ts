import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { RecipeOverview, MealDBMeal } from "@/types/recipes";
import { filterMealsByIngredient, getMealById } from "@/lib/mealdb";
import { getApiUser } from "@/lib/auth";
import { Item } from "@/types/database";
import { getExpiryStatus } from "@/lib/expiry-utils";

interface IngredientWithExpiry extends Item {
  daysRemaining: number;
}

/**
 * Extract ingredients from MealDB recipe
 */
function extractMealIngredients(meal: MealDBMeal): string[] {
  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}` as keyof MealDBMeal] as string;
    if (ingredient && ingredient.trim()) {
      ingredients.push(ingredient.trim().toLowerCase());
    }
  }
  return ingredients;
}

/**
 * Calculate comprehensive match score prioritizing expiring ingredients
 */
function calculateRecipeScore(
  recipeIngredients: string[],
  userIngredients: Map<string, IngredientWithExpiry>,
  expiringIngredients: Map<string, IngredientWithExpiry>,
): {
  expiringUsed: number;
  urgencyScore: number;
  matchPercentage: number;
  missingCount: number;
  totalScore: number;
  matchedIngredients: string[];
} {
  let expiringUsed = 0;
  let urgencyScore = 0;
  let matchedCount = 0;
  const matchedIngredients: string[] = [];

  // Check each recipe ingredient
  recipeIngredients.forEach((recipeIng) => {
    const recipeIngLower = recipeIng.toLowerCase().trim();

    // Check if we have this ingredient
    for (const [userIngName, userIng] of userIngredients.entries()) {
      const userIngLower = userIngName.toLowerCase();

      // Fuzzy match: exact, contains, or word match
      if (
        recipeIngLower === userIngLower ||
        recipeIngLower.includes(userIngLower) ||
        userIngLower.includes(recipeIngLower)
      ) {
        matchedCount++;
        matchedIngredients.push(userIngName);

        // Check if this ingredient is expiring
        if (expiringIngredients.has(userIngName)) {
          expiringUsed++;
          const daysRemaining = userIng.daysRemaining;
          // More urgent = higher score (0 days = 8 points, 7 days = 1 point)
          urgencyScore += Math.max(0, 8 - daysRemaining);
        }
        break; // Found match, move to next recipe ingredient
      }
    }
  });

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
    expiringUsed,
    urgencyScore,
    matchPercentage,
    missingCount,
    totalScore,
    matchedIngredients,
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
    const { data: userItems, error: itemsError } = await supabase
      .from("items")
      .select("*")
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

    // Separate expiring (≤7 days) and fresh items with days remaining
    const expiringItems: IngredientWithExpiry[] = [];
    const freshItems: IngredientWithExpiry[] = [];

    userItems.forEach((item) => {
      const status = getExpiryStatus(item.expiry_date);
      if (!status || status.isExpired) return; // Skip expired items

      const itemWithExpiry: IngredientWithExpiry = {
        ...item,
        daysRemaining: status.daysRemaining,
      };

      if (status.daysRemaining <= 7) {
        expiringItems.push(itemWithExpiry);
      } else {
        freshItems.push(itemWithExpiry);
      }
    });

    // Phase 1: Progressive recipe collection from expiring ingredients
    const mealIdsSet = new Set<string>();
    const MAX_RECIPE_IDS = 100;

    console.log(
      `Searching recipes for ${expiringItems.length} expiring ingredients`,
    );

    for (const item of expiringItems) {
      if (mealIdsSet.size >= MAX_RECIPE_IDS) break;

      const partialMeals = await filterMealsByIngredient(item.name);
      partialMeals.forEach((meal) => mealIdsSet.add(meal.idMeal));

      console.log(
        `After ${item.name}: ${mealIdsSet.size} unique recipes collected`,
      );
    }

    // Phase 2: If < 50 recipes, search top fresh ingredients
    if (mealIdsSet.size < MAX_RECIPE_IDS && freshItems.length > 0) {
      console.log("Supplementing with fresh ingredients...");

      for (const item of freshItems.slice(0, 5)) {
        if (mealIdsSet.size >= MAX_RECIPE_IDS) break;

        const partialMeals = await filterMealsByIngredient(item.name);
        partialMeals.forEach((meal) => mealIdsSet.add(meal.idMeal));
      }
    }

    console.log(`Total unique recipe IDs collected: ${mealIdsSet.size}`);

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

    console.log(`Fetched full details for ${validMeals.length} recipes`);

    // Create lookup maps for scoring
    const userIngredientsMap = new Map<string, IngredientWithExpiry>();
    const expiringIngredientsMap = new Map<string, IngredientWithExpiry>();

    [...expiringItems, ...freshItems].forEach((item) => {
      userIngredientsMap.set(item.name, item);
    });

    expiringItems.forEach((item) => {
      expiringIngredientsMap.set(item.name, item);
    });

    // Phase 4: Calculate scores for all recipes
    const recipesWithScores: RecipeOverview[] = validMeals.map((meal) => {
      const recipeIngredients = extractMealIngredients(meal);
      const scores = calculateRecipeScore(
        recipeIngredients,
        userIngredientsMap,
        expiringIngredientsMap,
      );

      return {
        id: meal.idMeal,
        title: meal.strMeal,
        image: meal.strMealThumb,
        matchScore: scores.matchPercentage,
        totalScore: scores.totalScore,
        matchedIngredients: scores.matchedIngredients,
      };
    });

    // Phase 5: Sort by total score and return top 60
    recipesWithScores.sort((a, b) => b.totalScore! - a.totalScore!);

    console.log(
      `Returning top 60 of ${recipesWithScores.length} scored recipes`,
    );

    return NextResponse.json(recipesWithScores.slice(0, 60));
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
