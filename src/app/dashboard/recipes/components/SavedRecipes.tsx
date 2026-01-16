"use client";

import { useState, useEffect } from "react";
import { RecipeOverview } from "@/types/recipes";
import { Bookmark, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import RecipeCard from "./RecipeCard";
import DotLoader from "@/components/ui/DotLoader";

interface SavedRecipesProps {
  debouncedSearchQuery: string;
}

export default function SavedRecipes({
  debouncedSearchQuery,
}: SavedRecipesProps) {
  const [recipes, setRecipes] = useState<RecipeOverview[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeOverview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call to fetch saved recipes
        // const response = await fetch("/api/recipes/saved");
        // const data = await response.json();
        // setRecipes(data);

        // Placeholder: Empty array for now
        setRecipes([]);
      } catch {
        setError("Failed to load saved recipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedRecipes();
  }, []);

  // Filter recipes based on search query
  useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      setFilteredRecipes(recipes);
      return;
    }

    const query = debouncedSearchQuery.toLowerCase();
    const filtered = recipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(query) ||
        recipe.cuisine?.toLowerCase().includes(query)
    );
    setFilteredRecipes(filtered);
  }, [debouncedSearchQuery, recipes]);

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-12 flex flex-col items-center text-muted-foreground mt-2">
          Loading saved recipes
          <DotLoader className="mb-4" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (recipes.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg mb-2">
            No saved recipes yet
          </p>
          <p className="text-muted-foreground text-sm">
            Save recipes from search or suggestions to see them here
          </p>
        </CardContent>
      </Card>
    );
  }

  if (filteredRecipes.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg mb-2">
            No saved recipes match &quot;{debouncedSearchQuery}&quot;
          </p>
          <p className="text-muted-foreground text-sm">
            Try searching with different keywords
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          {filteredRecipes.length === recipes.length
            ? `Your Saved Recipes (${recipes.length})`
            : `Showing ${filteredRecipes.length} of ${recipes.length} saved recipes`}
        </h3>
        {debouncedSearchQuery && (
          <p className="text-muted-foreground text-sm">
            Filtered by &quot;{debouncedSearchQuery}&quot;
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
