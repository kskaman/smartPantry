// Recipe overview type used in the application for RecipeCard
export interface RecipeOverview {
  id: number;
  title: string;
  image: string;
  matchedIngredients?: string[];
  unMatchedIngredients?: string[];
  matchScore?: number;
}

// Spoonacular API response types
// get recipes by ingredients
export interface SpoonacularRecipeByIngredients {
  id: number;
  title: string;
  image: string;
  imageType: string;
  likes: number;
  missedIngredientCount: number;
  missedIngredients?: Array<{
    id: number;
    name: string;
    image: string;
    aisle: string;
    meta: string[];
    original: string;
    originalName: string;
    unit: string;
    unitLong: string;
    unitShort: string;
    amount: number;
  }>;
  unusedIngredients: Array<{
    id: number;
    name: string;
    image: string;
    aisle: string;
    meta: string[];
    original: string;
    originalName: string;
    unit: string;
    unitLong: string;
    unitShort: string;
    amount: number;
  }>;
  unusedIngredientCount: number;
  usedIngredients: Array<{
    id: number;
    name: string;
    image: string;
    aisle: string;
    meta: string[];
    original: string;
    originalName: string;
    unit: string;
    unitLong: string;
    unitShort: string;
    amount: number;
  }>;
  usedIngredientCount: number;
}

// Spoonacular API response type for analyzed instructions
// GET https://api.spoonacular.com/recipes/{id}/analyzedInstructions
export interface SpoonacularAnalyzedInstruction {
  name: string;
  steps: Array<{
    number: number;
    step: string;
    ingredients: Array<{
      id: number;
      name: string;
      localizedName: string;
      image: string;
    }>;
    equipment: Array<{
      id: number;
      name: string;
      localizedName: string;
      image: string;
      temperature?: {
        number: number;
        unit: string;
      };
    }>;
    length?: {
      number: number;
      unit: string;
    };
  }>;
}

// Spoonacular API response type for recipe details by ID
// GET https://api.spoonacular.com/recipes/{id}/information
export interface SpoonacularRecipeDetail {
  id: number;
  title: string;
  image: string;
  imageType: string;
  servings: number;
  readyInMinutes: number;
  cookingMinutes: number | null;
  preparationMinutes: number | null;
  sourceUrl: string;
  spoonacularSourceUrl: string;
  healthScore: number;
  spoonacularScore: number;
  pricePerServing: number;
  cheap: boolean;
  cuisines: string[];
  dairyFree: boolean;
  diets: string[];
  glutenFree: boolean;
  instructions: string;
  ketogenic: boolean;
  lowFodmap: boolean;
  vegan: boolean;
  vegetarian: boolean;
  veryHealthy: boolean;
  veryPopular: boolean;
  whole30: boolean;
  dishTypes: string[];
  extendedIngredients: Array<{
    id: number;
    aisle: string;
    image: string;
    consistency: string;
    name: string;
    nameClean?: string;
    original: string;
    originalName: string;
    amount: number;
    unit: string;
    meta: string[];
    measures: {
      us: {
        amount: number;
        unitShort: string;
        unitLong: string;
      };
      metric: {
        amount: number;
        unitShort: string;
        unitLong: string;
      };
    };
  }>;
  summary: string;
  analyzedInstructions: Array<{
    name: string;
    steps: Array<{
      number: number;
      step: string;
      ingredients: Array<{
        id: number;
        name: string;
        localizedName: string;
        image: string;
      }>;
      equipment: Array<{
        id: number;
        name: string;
        localizedName: string;
        image: string;
      }>;
      length?: {
        number: number;
        unit: string;
      };
    }>;
  }>;
  winePairing: {
    pairedWines: string[];
    pairingText: string;
    productMatches: Array<{
      id: number;
      title: string;
      description: string;
      price: string;
      imageUrl: string;
      averageRating: number;
      ratingCount: number;
      score: number;
      link: string;
    }>;
  };
}

// Simplified recipe detail type for the application
export interface RecipeDetail {
  id: number;
  title: string;
  image: string;
  servings: number;
  totalTime: number; // readyInMinutes
  cookingTime: number | null; // cookingMinutes
  preparationTime: number | null; // preparationMinutes
  sourceUrl: string;
  cuisines: string[];
  ketogenic: boolean;
  vegan: boolean;
  vegetarian: boolean;
  dishTypes: string[];
  ingredients: Array<{
    id: number;
    name: string;
    amount: number;
    unit: string;
    original: string;
  }>;
  summary: string;
  instructions: string; // from instructions field or analyzedInstructions
  winePairing: {
    pairedWines: string[];
    pairingText: string;
  } | null;
}
