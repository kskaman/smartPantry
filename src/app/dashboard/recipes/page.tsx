"use client";

import { useState } from "react";
import { Button } from "@/ui/components";
import SearchRecipes from "./components/SearchRecipes";
// import RecipeSuggestions from "./components/RecipeSuggestions";
// import SavedRecipes from "./components/SavedRecipes";

type TabType = "search" | "suggestions" | "saved";

export default function RecipesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("search");

  const tabs = [
    { value: "search" as TabType, label: "Search" },
    { value: "suggestions" as TabType, label: "Suggestions" },
    { value: "saved" as TabType, label: "Saved" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-2">
        <h1 className="text-title">Recipes</h1>
        <p className="text-small">
          Search for recipes or Get recipe suggestions based on your inventory
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            variant={activeTab === tab.value ? "primary" : "outline"}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Search Bar - Shared across all tabs */}

      {/* Tab Content */}
      {activeTab === "search" && <SearchRecipes />}
      {/*{activeTab === "suggestions" && (
        <RecipeSuggestions />
      )}
      {activeTab === "saved" && (
        <SavedRecipes />
      )} */}
    </div>
  );
}
