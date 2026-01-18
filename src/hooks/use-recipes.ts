import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
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
    staleTime: Infinity,
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
        console.log(error);
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
