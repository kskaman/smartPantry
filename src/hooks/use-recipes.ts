import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { MealDBMeal, RecipeOverview } from "@/types/recipes";

export function useRecipeDetail(recipeId: string) {
  const {
    data: recipe,
    isLoading,
    error,
  } = useQuery<MealDBMeal>({
    queryKey: ["recipe", recipeId],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/recipes/${recipeId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch recipe details");
        }

        const data = await response.json();

        return data;
      } catch (error) {
        toast.error("Failed to load recipe details");
        throw error;
      }
    },
    enabled: !!recipeId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    recipe,
    isLoading,
    error,
  };
}

export function useRecipeSuggestions() {
  const {
    data: recipes,
    isLoading,
    error,
  } = useQuery<RecipeOverview[]>({
    queryKey: ["recipe-suggestions"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/recipes/suggestions");

        if (!response.ok) {
          throw new Error("Failed to fetch recipe suggestions");
        }

        const data = await response.json();
        return data;
      } catch (error) {
        toast.error("Failed to load recipe suggestions");
        throw error;
      }
    },
  });

  return {
    recipes: recipes || [],
    isLoading,
    error,
  };
}

export function useSavedRecipes() {
  const {
    data: recipes,
    isLoading,
    error,
  } = useQuery<RecipeOverview[]>({
    queryKey: ["recipe-saved"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/recipes/saved");
        if (!response.ok) {
          throw new Error("Failed to fetch saved recipes");
        }

        const data = await response.json();
        return data;
      } catch (error) {
        throw error;
      }
    },
  });

  return {
    recipes: recipes || [],
    isLoading,
    error,
  };
}

export function useToggleSaveRecipe(recipeId: string) {
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: saveRecipe, // your API call
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe", recipeId] });
      queryClient.invalidateQueries({ queryKey: ["recipe-saved"] });
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: unsaveRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe", recipeId] });
      queryClient.invalidateQueries({ queryKey: ["recipe-saved"] });
    },
  });

  return { saveMutation, unsaveMutation };
}
/**
 * Save a recipe to the user's saved recipes
 */
export async function saveRecipe({
  recipeId,
  recipeTitle,
  recipeImage,
}: {
  recipeId: string;
  recipeTitle: string;
  recipeImage: string;
}) {
  const response = await fetch("/api/recipes/saved", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipeId,
      recipeTitle,
      recipeImage,
    }),
  });

  if (!response.ok) {
    if (response.status === 409) {
      return { success: true, alreadySaved: true };
    }
    throw new Error("Failed to save recipe");
  }

  return { success: true, alreadySaved: false };
}

/**
 * Remove a recipe from the user's saved recipes
 */
export async function unsaveRecipe(recipeId: string) {
  const response = await fetch(`/api/recipes/saved/${recipeId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to unsave recipe");
  }

  return { success: true };
}
