// MealDB API types and functions

import { MealDBMeal, MealDBSearchResponse } from "@/types/recipes";

const MEAL_DB_API_KEY = process.env.MEAL_DB_API_KEY;
const MEAL_DB_BASE_URL = `https://www.themealdb.com/api/json/v2/${MEAL_DB_API_KEY}`;

/**
 * Search meals by name
 * @param query - Search term for meal name
 * @returns Array of meals or empty array if no results
 */
export async function searchMealsByName(query: string): Promise<MealDBMeal[]> {
  if (!MEAL_DB_API_KEY) {
    throw new Error("MEALDB_API_KEY is not configured");
  }

  if (!query.trim()) {
    return [];
  }

  try {
    const response = await fetch(
      `${MEAL_DB_BASE_URL}/search.php?s=${encodeURIComponent(query)}`,
    );

    if (!response.ok) {
      throw new Error(`MealDB API error: ${response.status}`);
    }

    const data: MealDBSearchResponse = await response.json();

    // MealDB returns null if no meals found
    return data.meals || [];
  } catch (error) {
    throw error;
  }
}

/**
 * Get meal details by ID
 * @param mealId - The meal ID
 * @returns Meal details or null if not found
 */
export async function getMealById(mealId: string): Promise<MealDBMeal | null> {
  if (!MEAL_DB_API_KEY) {
    throw new Error("MEALDB_API_KEY is not configured");
  }

  try {
    const response = await fetch(`${MEAL_DB_BASE_URL}/lookup.php?i=${mealId}`);

    if (!response.ok) {
      throw new Error(`MealDB API error: ${response.status}`);
    }

    const data: MealDBSearchResponse = await response.json();

    return data.meals?.[0] || null;
  } catch (error) {
    console.error("Error fetching meal details:", error);
    throw error;
  }
}

/**
 * Filter meals by a single ingredient
 * Returns partial meal data (id, name, thumbnail only)
 * @param ingredient - Single ingredient name
 * @returns Array of partial meal objects
 */
export async function filterMealsByIngredient(
  ingredient: string,
): Promise<Array<{ idMeal: string; strMeal: string; strMealThumb: string }>> {
  if (!MEAL_DB_API_KEY) {
    throw new Error("MEALDB_API_KEY is not configured");
  }

  if (!ingredient.trim()) {
    return [];
  }

  try {
    const response = await fetch(
      `${MEAL_DB_BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`,
    );

    if (!response.ok) {
      throw new Error(`MealDB API error: ${response.status}`);
    }

    const data = await response.json();
    return data.meals || [];
  } catch {
    return [];
  }
}

/**
 * Search for recipes by multiple ingredients (OR logic)
 * Searches each ingredient individually and returns unique meals with full details
 * @param ingredients - Array of ingredient names
 * @returns Array of full meal details
 */
export async function searchMealsByIngredients(
  ingredients: string[],
): Promise<MealDBMeal[]> {
  if (!MEAL_DB_API_KEY) {
    throw new Error("MEAL_DB_API_KEY is not configured");
  }

  if (!ingredients.length) {
    return [];
  }

  try {
    const mealIdsSet = new Set<string>();

    // Search each ingredient separately (OR logic)
    await Promise.all(
      ingredients.map(async (ingredient) => {
        const partialMeals = await filterMealsByIngredient(ingredient);
        partialMeals.forEach((meal) => mealIdsSet.add(meal.idMeal));
      }),
    );

    if (mealIdsSet.size === 0) {
      return [];
    }

    // Fetch full details for all unique meal IDs
    const fullMeals = await Promise.all(
      Array.from(mealIdsSet).map((id) => getMealById(id)),
    );

    // Filter out any null results
    return fullMeals.filter((meal): meal is MealDBMeal => meal !== null);
  } catch (error) {
    console.error("Error searching meals by ingredients:", error);
    throw error;
  }
}
