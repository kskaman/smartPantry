"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import RecipeCard from "./RecipeCard";
import { RecipeOverview } from "@/types/recipes";
import { Card, Loader } from "@/ui/components";
import SearchBar from "./SearchBar";
import { useSearch } from "@/hooks/use-search";

export default function SearchRecipes() {
  const [recipes, setRecipes] = useState<RecipeOverview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/recipes/search?query=${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) {
        throw new Error("Failed to search recipes");
      }

      const data = await response.json();
      setRecipes(data);
    } catch {
      setError("Failed to search recipes. Please try again.");
      setRecipes([]);
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  };

  const { searchQuery, setSearchQuery, handleSearchSubmit } = useSearch({
    onSearch: performSearch,
  });

  return (
    <>
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={handleSearchSubmit}
        placeholder="Search recipes..."
      />

      {/* Loading State */}
      {isLoading && (
        <Card>
          <div className="flex flex-row items-center gap-4">
            <span>Searching for recipes</span>
            <Loader />
          </div>
        </Card>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Card>
          <div className="text-center py-12">
            <p className="text-(--text-danger)">{error}</p>
          </div>
        </Card>
      )}

      {/* Results */}
      {!isLoading && !error && hasSearched && recipes.length > 0 && (
        <>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">
              Found {recipes.length} recipe{recipes.length !== 1 ? "s" : ""} for
              &quot;{searchQuery}&quot;
            </h3>
          </div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-full">
            {recipes.map((recipe: RecipeOverview) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </>
      )}

      {/* No Results */}
      {!isLoading && !error && hasSearched && recipes.length === 0 && (
        <Card>
          <Search className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg mb-2">
            No recipes found for &quot;{searchQuery}&quot;
          </p>
          <p className="text-sm">
            Try searching with different keywords or check your spelling
          </p>
        </Card>
      )}

      {/* Initial State */}
      {!isLoading && !hasSearched && (
        <Card>
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg mb-2">Search for recipes</p>
          <p className="text-sm">
            Enter a recipe name and click the search icon or press Enter
          </p>
        </Card>
      )}
    </>
  );
}
