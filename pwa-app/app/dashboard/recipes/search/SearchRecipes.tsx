"use client";

import { useState, useEffect } from "react";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Search } from "lucide-react";
import RecipeCard from "../components/RecipeCard";
import DotLoader from "../../../../components/ui/DotLoader";
import { RecipeOverview } from "@/types/recipes";
import { useDebounce } from "@/app/hooks";

export default function SearchRecipes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<RecipeOverview[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounce search query to reduce API calls - only call API after user stops typing for 500ms
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch autocomplete suggestions only when user has stopped typing
  useEffect(() => {
    // Don't fetch suggestions if we're loading search results or already searched
    if (loading || hasSearched) {
      return;
    }

    if (debouncedSearchQuery.length > 2) {
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(
            `/api/recipes/search/autocomplete?query=${encodeURIComponent(
              debouncedSearchQuery
            )}`
          );
          if (response.ok) {
            const data = await response.json();
            setSuggestions(data.slice(0, 5));
            setShowSuggestions(true);
          }
        } catch {
          setSuggestions([]);
        }
      };

      fetchSuggestions();
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedSearchQuery, loading, hasSearched]);

  // Full search on Go/Enter
  const handleSearch = async () => {
    performSearch(searchQuery);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
    
    // Trigger search immediately using the suggestion
    // We need to call the API directly with the suggestion value
    // because setSearchQuery is async and handleSearch uses searchQuery state
    performSearch(suggestion);
  };

  const performSearch = async (query: string) => {
    if (query.trim()) {
      setLoading(true);
      setShowSuggestions(false);
      setHasSearched(true);

      try {
        const response = await fetch(
          `/api/recipes/search?query=${encodeURIComponent(query)}`
        );
        if (response.ok) {
          const data = await response.json();
          setRecipes(data);
        } else {
          setRecipes([]);
        }
      } catch {
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {/* Search Bar */}
      <div className="flex flex-col items-center p-4 sm:flex-row sm:justify-center sm:gap-4">
        <div className="relative w-full max-w-2xl mb-4 sm:mb-0">
          <Input
            type="text"
            placeholder="Search for recipes by name, cuisine, or ingredients..."
            className="w-full"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              // Reset search state when user starts typing again
              if (hasSearched) {
                setHasSearched(false);
                setRecipes([]);
              }
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            onFocus={() => suggestions.length > 0 && !hasSearched && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full bg-background border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-3 hover:bg-accent cursor-pointer transition-colors border-b last:border-b-0"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{suggestion}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button onClick={handleSearch} className="w-full sm:w-auto">
          <Search className="h-4 w-4 mr-2" />
          Go
        </Button>
      </div>

      {/* Search Results */}
      {loading && (
        <Card>
          <CardContent className="text-center py-12 flex flex-col items-center">
            <div className="text-muted-foreground mt-2">
              Searching for recipes
              <DotLoader className="mb-4" />
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && hasSearched && recipes.length > 0 && (
        <>
          <div className="mb-4 px-4">
            <h3 className="text-lg font-semibold">
              Found {recipes.length} recipe{recipes.length !== 1 ? "s" : ""} for
              &quot;{searchQuery}&quot;
            </h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </>
      )}

      {!loading && hasSearched && recipes.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-2">
              No recipes found for &quot;{searchQuery}&quot;
            </p>
            <p className="text-muted-foreground text-sm">
              Try searching with different keywords or check your spelling
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && !hasSearched && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-2">
              Search for your favorite recipes
            </p>
            <p className="text-muted-foreground text-sm">
              Enter a recipe name to get started
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
