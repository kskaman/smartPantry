"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Bookmark, Search } from "lucide-react";
import { Card, Loader, Pagination } from "@/ui/components";
import RecipeCard from "./RecipeCard";
import SearchBar from "./SearchBar";
import { useSearch } from "@/hooks/use-search";
import { useSavedRecipes } from "@/hooks/use-recipes";

const ITEMS_PER_PAGE = 12;

export default function SavedRecipes() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { recipes, isLoading, error } = useSavedRecipes();
  // Read from URL
  const urlSearchQuery = searchParams.get("query") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Update URL params (adds to existing)
  const updateSearchParams = (updates: { query?: string; page?: number }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.query !== undefined) {
      if (updates.query) {
        params.set("query", updates.query);
      } else {
        params.delete("query");
      }
      // Reset page when search changes
      params.set("page", "1");
    }

    if (updates.page !== undefined) {
      params.set("page", updates.page.toString());
    }

    router.push(`/dashboard/recipes?${params.toString()}`, { scroll: false });
  };

  const { searchQuery: localSearchQuery, setSearchQuery } = useSearch({
    onSearch: (query) => updateSearchParams({ query }),
  });

  const handleSearchSubmit = () => {
    if (localSearchQuery.trim()) {
      updateSearchParams({ query: localSearchQuery.trim() });
    }
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({ page });
  };

  // Filter recipes based on search query
  const filteredRecipes = useMemo(() => {
    if (!urlSearchQuery.trim()) {
      return recipes;
    }

    const query = urlSearchQuery.toLowerCase();
    return recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(query),
    );
  }, [urlSearchQuery, recipes]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredRecipes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRecipes = filteredRecipes.slice(startIndex, endIndex);

  const hasSearched = urlSearchQuery !== "";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <SearchBar
            value={localSearchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearchSubmit}
            placeholder="Search saved recipes..."
          />
        </div>

        <Card>
          Loading saved recipes
          <Loader />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <SearchBar
            value={localSearchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearchSubmit}
            placeholder="Search saved recipes..."
          />
        </div>

        <Card>Failed to load saved recipes. Please try again.</Card>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="space-y-6">
        <SearchBar
          value={localSearchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearchSubmit}
          placeholder="Search saved recipes..."
        />

        <Card>
          <Bookmark className="h-12 w-12 mx-auto mb-4" />
          <p className="text-body mb-2">No saved recipes yet</p>
          <p className="text-small">
            Save recipes from search or suggestions to see them here
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex flex-col gap-4">
        <SearchBar
          value={localSearchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearchSubmit}
          placeholder="Search saved recipes..."
        />
      </div>

      {/* Results */}
      {hasSearched && filteredRecipes.length === 0 ? (
        <Card>
          <Search className="h-12 w-12 mx-auto mb-4" />
          <p className="text-body mb-2">
            No recipes found for &quot;{urlSearchQuery}&quot;
          </p>
          <p className="text-small">
            Try different keywords or clear the search to see all saved recipes
          </p>
        </Card>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <h3 className="text-body">
              {hasSearched
                ? `Found ${filteredRecipes.length} recipe${filteredRecipes.length !== 1 ? "s" : ""} for "${urlSearchQuery}"`
                : `Your Saved Recipes (${recipes.length})`}
            </h3>
            <p className="text-small">
              {hasSearched
                ? "Filtered from your saved recipes"
                : "Recipes you've bookmarked for later"}
            </p>
          </div>

          {/* Recipe Grid */}
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {paginatedRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={filteredRecipes.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          )}
        </>
      )}
    </div>
  );
}
