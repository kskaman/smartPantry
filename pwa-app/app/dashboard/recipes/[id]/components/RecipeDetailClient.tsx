"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RecipeDetail } from "@/types/recipes";
import {
  ArrowLeft,
  Clock,
  Users,
  ChefHat,
  ExternalLink,
  Wine,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Image from "next/image";
import DotLoader from "@/components/ui/DotLoader";

interface RecipeDetailClientProps {
  recipeId: string;
}

export function RecipeDetailClient({ recipeId }: RecipeDetailClientProps) {
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRecipeDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/recipes/${recipeId}`);

      if (response.ok) {
        const data = await response.json();
        setRecipe(data);
      } else {
        toast.error("Failed to load recipe");
      }
    } catch {
      toast.error("Failed to load recipe");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipeDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Card>
            <CardContent className="text-center py-12 flex flex-col items-center text-muted-foreground mt-2">
              Loading recipe
              <DotLoader className="mb-4" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Card>
            <CardContent className="text-center py-16 sm:py-24 text-red-500 text-lg">
              Recipe not found
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Strip HTML tags from summary for display
  const cleanSummary = recipe.summary.replace(/<[^>]*>/g, "");

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header with Back Button */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="self-start"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Recipe Header with Image on Side */}
        <Card className="mb-6">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Image - Left side on desktop, top on mobile */}
              {recipe.image && (
                <div className="relative w-full sm:w-48 md:w-56 lg:w-64 h-48 sm:h-48 md:h-56 lg:h-64 flex-shrink-0">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover rounded-lg"
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 224px, 256px"
                    quality={75}
                    loading="eager"
                  />
                </div>
              )}

              {/* Content - Right side */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                  {recipe.title}
                </h1>

                {/* Dietary Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.vegan && (
                    <Badge className="bg-green-100 text-green-800">
                      <Leaf className="h-3 w-3 mr-1" />
                      Vegan
                    </Badge>
                  )}
                  {recipe.vegetarian && (
                    <Badge className="bg-green-100 text-green-800">
                      <Leaf className="h-3 w-3 mr-1" />
                      Vegetarian
                    </Badge>
                  )}
                  {recipe.ketogenic && (
                    <Badge className="bg-purple-100 text-purple-800">
                      Ketogenic
                    </Badge>
                  )}
                  {recipe.cuisines.map((cuisine) => (
                    <Badge key={cuisine} variant="outline">
                      {cuisine}
                    </Badge>
                  ))}
                  {recipe.dishTypes.map((type) => (
                    <Badge key={type} variant="secondary">
                      {type}
                    </Badge>
                  ))}
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium">{recipe.totalTime} min</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </div>

                  {recipe.preparationTime && (
                    <div className="flex items-center gap-2 text-sm">
                      <ChefHat className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="font-medium">
                          {recipe.preparationTime} min
                        </p>
                        <p className="text-xs text-muted-foreground">Prep</p>
                      </div>
                    </div>
                  )}

                  {recipe.cookingTime && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="font-medium">{recipe.cookingTime} min</p>
                        <p className="text-xs text-muted-foreground">Cook</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium">{recipe.servings}</p>
                      <p className="text-xs text-muted-foreground">Servings</p>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                {recipe.summary && (
                  <div className="mb-4">
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {cleanSummary}
                    </p>
                  </div>
                )}

                {/* Source Link */}
                {recipe.sourceUrl && (
                  <a
                    href={recipe.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-primary hover:underline"
                  >
                    View Original Recipe
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ingredients - Full width on mobile, 1/3 on desktop */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">
                  Ingredients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li
                      key={ingredient.id || index}
                      className="flex items-start gap-3 text-sm sm:text-base"
                    >
                      <span className="text-primary mt-1">•</span>
                      <span className="flex-1">
                        <span className="font-medium">
                          {ingredient.amount > 0 && (
                            <>
                              {ingredient.amount}{" "}
                              {ingredient.unit && ingredient.unit}{" "}
                            </>
                          )}
                        </span>
                        {ingredient.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Instructions - Full width on mobile, 2/3 on desktop */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">
                  Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recipe.instructions ? (
                  <div className="prose prose-sm sm:prose max-w-none">
                    <div className="space-y-4">
                      {recipe.instructions.split("\n\n").map((step, index) => (
                        <div key={index} className="flex gap-3 sm:gap-4">
                          <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs sm:text-sm font-medium">
                            {index + 1}
                          </span>
                          <p className="flex-1 text-sm sm:text-base leading-relaxed pt-0.5">
                            {step.replace(/^\d+\.\s*/, "")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm sm:text-base">
                    No instructions available for this recipe.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Wine Pairing */}
        {recipe.winePairing && recipe.winePairing.pairedWines.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <Wine className="h-5 w-5 sm:h-6 sm:w-6" />
                Wine Pairing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {recipe.winePairing.pairedWines.map((wine) => (
                    <Badge
                      key={wine}
                      variant="secondary"
                      className="text-sm capitalize"
                    >
                      {wine}
                    </Badge>
                  ))}
                </div>
                {recipe.winePairing.pairingText && (
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {recipe.winePairing.pairingText}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
