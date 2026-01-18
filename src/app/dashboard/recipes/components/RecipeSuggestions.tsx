"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import RecipeCard from "./RecipeCard";
import { Card, Loader, Pagination } from "@/ui/components";
import SearchBar from "./SearchBar";
import { useSearch } from "@/hooks/use-search";
import { useRecipeSuggestions } from "@/hooks/use-recipes";

const ITEMS_PER_PAGE = 12;

export default function RecipeSuggestions() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Fetch recipes with match scores
  const { recipes, isLoading, error } = useRecipeSuggestions();
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

  // Sync local search with URL on mount and URL changes
  useState(() => {
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
    }
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
            placeholder="Search suggested recipes..."
          />
        </div>

        <Card>
          Loading recipe suggestions
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
            placeholder="Search suggested recipes..."
          />
        </div>

        <Card>Failed to load recipe suggestions. Please try again.</Card>
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
          placeholder="Search suggested recipes..."
        />

        <Card>
          <Search className="h-12 w-12 mx-auto" />
          <p className="text-body-medium mx-auto">
            No recipe suggestions found
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
          placeholder="Search suggested recipes..."
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
            Try different keywords or clear the search to see all suggestions
          </p>
        </Card>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <h3 className="text-body">
              {hasSearched
                ? `Found ${filteredRecipes.length} recipe${filteredRecipes.length !== 1 ? "s" : ""} for "${urlSearchQuery}"`
                : `Top ${recipes.length} Recipe Suggestions`}
            </h3>
            <p className="text-small">
              {hasSearched
                ? "Filtered from your personalized suggestions"
                : "Based on your inventory, prioritizing items expiring soon"}
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
