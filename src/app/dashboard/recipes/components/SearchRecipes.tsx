"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import RecipeCard from "./RecipeCard";
import { RecipeOverview } from "@/types/recipes";
import { Card, Loader, Pagination } from "@/ui/components";
import SearchBar from "./SearchBar";
import { useSearch } from "@/hooks/use-search";

const ITEMS_PER_PAGE = 12;

export default function SearchRecipes() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [allRecipes, setAllRecipes] = useState<RecipeOverview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read from URL
  const urlSearchQuery = searchParams.get("query") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Update URL params (adds to existing)
  const updateSearchParams = (updates: { query?: string; page?: number }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.query !== undefined) {
      if (updates.query) {
        params.set("query", updates.query);

        // Reset page when search changes
        params.set("page", "1");
      } else {
        params.delete("query");
        params.delete("page");
      }
    }

    if (updates.page !== undefined) {
      params.set("page", updates.page.toString());
    }

    router.push(`/dashboard/recipes?${params.toString()}`, { scroll: false });
  };

  const performSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/recipes/search?query=${encodeURIComponent(query)}`,
      );

      if (!response.ok) {
        throw new Error("Failed to search recipes");
      }

      const data = await response.json();
      setAllRecipes(data);
    } catch {
      setError("Failed to search recipes. Please try again.");
      setAllRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const { searchQuery: localSearchQuery, setSearchQuery } = useSearch({
    onSearch: (query) => updateSearchParams({ query }),
  });

  // Sync local search with URL on mount and URL changes
  useEffect(() => {
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
      performSearch(urlSearchQuery);
    } else {
      setAllRecipes([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSearchQuery]);

  const handleSearchSubmit = () => {
    if (localSearchQuery.trim()) {
      updateSearchParams({ query: localSearchQuery.trim() });
    }
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({ page });
  };

  // Calculate pagination
  const totalPages = Math.ceil(allRecipes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRecipes = allRecipes.slice(startIndex, endIndex);

  const hasSearched = urlSearchQuery !== "";

  return (
    <>
      <SearchBar
        value={localSearchQuery}
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
      {!isLoading && !error && hasSearched && allRecipes.length > 0 && (
        <>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">
              Found {allRecipes.length} recipe
              {allRecipes.length !== 1 ? "s" : ""} for &quot;{urlSearchQuery}
              &quot;
            </h3>
          </div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-full">
            {paginatedRecipes.map((recipe: RecipeOverview) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={allRecipes.length}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </>
      )}

      {/* No Results */}
      {!isLoading && !error && hasSearched && allRecipes.length === 0 && (
        <Card>
          <Search className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg mb-2">
            No recipes found for &quot;{urlSearchQuery}&quot;
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
