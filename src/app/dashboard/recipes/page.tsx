"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, Loader } from "@/ui/components";
import SearchRecipes from "./components/SearchRecipes";
import RecipeSuggestions from "./components/RecipeSuggestions";
import SavedRecipes from "./components/SavedRecipes";

type TabType = "search" | "suggestions" | "saved";

function RecipesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeTab = (searchParams.get("tab") as TabType) || "search";

  const handleTabChange = (tab: TabType) => {
    // When changing tabs, reset all params to just the tab
    router.push(`/dashboard/recipes?tab=${tab}`, { scroll: false });
  };

  const tabs = [
    { value: "search" as TabType, label: "Search" },
    { value: "suggestions" as TabType, label: "Suggestions" },
    { value: "saved" as TabType, label: "Saved" },
  ];

  return (
    <>
      {/* Tab Navigation */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            variant={activeTab === tab.value ? "primary" : "outline"}
            onClick={() => handleTabChange(tab.value)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "search" && <SearchRecipes />}
      {activeTab === "suggestions" && <RecipeSuggestions />}
      {activeTab === "saved" && <SavedRecipes />}
    </>
  );
}

export default function RecipesPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-2">
        <h1 className="text-title">Recipes</h1>
        <p className="text-small">
          Search for recipes or Get recipe suggestions based on your inventory
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        }
      >
        <RecipesContent />
      </Suspense>
    </div>
  );
}
