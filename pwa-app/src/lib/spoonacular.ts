/**
 * Spoonacular API utility functions
 * API Docs: https://spoonacular.com/food-api
 */

const API_BASE = "https://api.spoonacular.com/recipes";
const API_KEY = process.env.SPOONACULAR_API_KEY;

export interface SearchRecipesParams {
  query: string;
  number?: number;
  offset?: number;
}

export interface RecipeInfo {
  id: number;
  title: string;
  image: string;
  servings: number;
  readyInMinutes: number;
  sourceUrl?: string;
  summary?: string;
  nutrition?: {
    nutrients: Array<{
      name: string;
      amount: number;
      unit: string;
    }>;
  };
  extendedIngredients?: Array<{
    id: number;
    name: string;
    original: string;
    amount: number;
    unit: string;
    unitShort: string;
  }>;
  analyzedInstructions?: Array<{
    name: string;
    steps: Array<{
      number: number;
      step: string;
      ingredients: Array<{ id: number; name: string }>;
      equipment: Array<{ id: number; name: string; image: string }>;
      length?: { number: number; unit: string };
    }>;
  }>;
}

export interface SearchResult {
  id: number;
  title: string;
  image: string;
  extendedIngredients?: Array<{
    id: number;
    name: string;
    original: string;
    amount: number;
    unit: string;
    unitShort: string;
  }>;
  servings?: number;
  readyInMinutes?: number;
  sourceUrl?: string;
  summary?: string;
  nutrition?: {
    nutrients: Array<{
      name: string;
      amount: number;
      unit: string;
    }>;
  };
  analyzedInstructions?: Array<{
    name: string;
    steps: Array<{
      number: number;
      step: string;
      ingredients: Array<{ id: number; name: string }>;
      equipment: Array<{ id: number; name: string; image: string }>;
      length?: { number: number; unit: string };
    }>;
  }>;
}

/**
 * Search for recipes by query
 * Returns basic info including images (for search results)
 */
export async function searchRecipes(
  params: SearchRecipesParams
): Promise<SearchResult[]> {
  if (!API_KEY) {
    return [];
  }

  try {
    const queryParams = new URLSearchParams({
      query: params.query,
      number: String(params.number || 12),
      offset: String(params.offset || 0),
      addRecipeInformation: "true", // Get images and additional info
      apiKey: API_KEY,
    });

    const response = await fetch(
      `${API_BASE}/complexSearch?${queryParams.toString()}`
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.results || [];
  } catch {
    return [];
  }
}

/**
 * Autocomplete recipe names for search suggestions
 * Much cheaper API call - use for search input suggestions
 */
export async function getRecipeNameSuggestions(
  query: string,
  number: number = 5
): Promise<SearchResult[]> {
  if (!API_KEY) {
    return [];
  }

  try {
    const queryParams = new URLSearchParams({
      query: query,
      number: String(number),
      apiKey: API_KEY,
    });

    const response = await fetch(
      `${API_BASE}/autocomplete?${queryParams.toString()}`
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data || [];
  } catch {
    return [];
  }
}

export async function searchRecipesByIngredients(
  ingredients: string,
  number: number = 8
): Promise<SearchResult[]> {
  if (!API_KEY) {
    return [];
  }

  try {
    const queryParams = new URLSearchParams({
      ingredients: ingredients,
      number: String(number),
      ranking: "2", // minimize missing ingredients
      ignorePantry: "true",
      sort: "max-used-ingredients",
      apiKey: API_KEY,
    });

    const response = await fetch(
      `${API_BASE}/findByIngredients?${queryParams.toString()}`
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data || [];
  } catch {
    return [];
  }
}
