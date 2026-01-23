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

  ingredient = ingredient.trim();
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
