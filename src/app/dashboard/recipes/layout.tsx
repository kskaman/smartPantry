"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function RecipesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { value: "suggestions", label: "Suggestions", href: "/dashboard/recipes/suggestions" },
    { value: "search", label: "Search", href: "/dashboard/recipes/search" },
  ];

  return (
    <div className="section-shell py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold mb-2">Recipes</h1>
        <p className="text-muted-foreground">
          Get recipe suggestions based on your inventory or search for recipes
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 flex gap-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link key={tab.value} href={tab.href}>
              <Button variant={isActive ? "default" : "outline"}>
                {tab.label}
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
}
