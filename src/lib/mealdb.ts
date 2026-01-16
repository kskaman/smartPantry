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
      `${MEAL_DB_BASE_URL}/search.php?s=${encodeURIComponent(query)}`
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

// /**
//  * Filter meals by ingredient(s) - Premium API only for multiple ingredients
//  * @param ingredients - Comma-separated ingredient list
//  * @returns Array of meals
//  */
// export async function filterMealsByIngredients(
//   ingredients: string
// ): Promise<MealDBMeal[]> {
//   if (!MEALDB_API_KEY) {
//     throw new Error("MEALDB_API_KEY is not configured");
//   }

//   try {
//     const response = await fetch(
//       `${MEALDB_BASE_URL}/filter.php?i=${encodeURIComponent(ingredients)}`
//     );

//     if (!response.ok) {
//       throw new Error(`MealDB API error: ${response.status}`);
//     }

//     const data: MealDBSearchResponse = await response.json();

//     return data.meals || [];
//   } catch (error) {
//     console.error("Error filtering meals by ingredients:", error);
//     throw error;
//   }
// }

// /**
//  * Helper function to extract non-empty ingredients from a meal
//  * @param meal - MealDB meal object
//  * @returns Array of ingredient objects with name and measure
//  */
// export function extractIngredients(meal: MealDBMeal): Array<{ name: string; measure: string }> {
//   const ingredients: Array<{ name: string; measure: string }> = [];

//   for (let i = 1; i <= 20; i++) {
//     const ingredient = meal[`strIngredient${i}` as keyof MealDBMeal] as string;
//     const measure = meal[`strMeasure${i}` as keyof MealDBMeal] as string;

//     if (ingredient && ingredient.trim()) {
//       ingredients.push({
//         name: ingredient.trim(),
//         measure: measure?.trim() || "",
//       });
//     }
//   }

//   return ingredients;
// }
