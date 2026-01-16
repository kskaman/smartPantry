import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { MealDBMeal } from "@/types/recipes";

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
