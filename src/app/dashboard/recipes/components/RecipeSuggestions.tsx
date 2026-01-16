"use client";

import { useState, useEffect } from "react";
import { RecipeOverview } from "@/types/recipes";
import { Item } from "@/types/database";
import { ShoppingCart, Search } from "lucide-react";
import { Button } from "@/ui/components";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import RecipeCard from "./RecipeCard";
import DotLoader from "@/components/ui/DotLoader";

export default function RecipeSuggestions() {
  const [recipes, setRecipes] = useState<RecipeOverview[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeOverview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inventoryItems, setInventoryItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch inventory items
        const inventoryResponse = await fetch("/api/items");
        const inventoryData = await inventoryResponse.json();
        setInventoryItems(inventoryData);

        // Fetch saved recipes with match scores
        const recipesResponse = await fetch("/api/recipes/suggestions");
        if (recipesResponse.ok) {
          const recipesData = await recipesResponse.json();
          setRecipes(recipesData);
        }
      } catch {
        setError("Failed to load matching recipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
          Loading matching recipes
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

  if (inventoryItems.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg mb-2">
            No inventory items found
          </p>
          <p className="text-muted-foreground text-sm mb-4">
            Add items to your inventory to see matching recipes
          </p>
          <Link href="/dashboard/inventory">
            <Button>Go to Inventory</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (filteredRecipes.length === 0 && debouncedSearchQuery) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg mb-2">
            No suggested recipes match &quot;{debouncedSearchQuery}&quot;
          </p>
          <p className="text-muted-foreground text-sm">
            Try searching with different keywords or check the Search tab
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
            ? "Top Matching Recipes Based on Your Inventory"
            : `Showing ${filteredRecipes.length} of ${recipes.length} suggested recipes`}
        </h3>
        <p className="text-muted-foreground text-sm">
          {filteredRecipes.length === recipes.length
            ? `Showing the best ${recipes.length} recipe${
                recipes.length !== 1 ? "s" : ""
              } matching your available ingredients`
            : `Filtered by "${debouncedSearchQuery}"`}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
