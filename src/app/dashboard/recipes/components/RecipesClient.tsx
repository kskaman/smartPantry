"use client";

import { useState } from "react";
import { Button } from "@/ui/components";
import RecipeSuggestions from "../suggestions/RecipeSuggestions";
import SearchRecipes from "../search/SearchRecipes";

export function RecipesClient() {
  const [activeTab, setActiveTab] = useState<"suggestions" | "search">(
    "suggestions"
  );

  const renderContent = () => {
    switch (activeTab) {
      case "suggestions":
        return <RecipeSuggestions />;
      case "search":
        return <SearchRecipes />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Tab Buttons */}
      <div className="mb-6 flex gap-2">
        {(
          [
            { value: "suggestions", label: "Suggestions" },
            { value: "search", label: "Search" },
          ] as const
        ).map((option) => (
          <Button
            key={option.value}
            onClick={() =>
              setActiveTab(option.value as "suggestions" | "search")
            }
            variant={activeTab === option.value ? "default" : "outline"}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Render Content Based on Active Tab */}
      {renderContent()}
    </>
  );
}
