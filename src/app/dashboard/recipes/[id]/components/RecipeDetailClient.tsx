"use client";

import { useRouter } from "next/navigation";
import { useRecipeDetail } from "@/hooks/use-recipes";
import { ArrowLeft, ExternalLink, ChefHat, Globe, Tag } from "lucide-react";
import { Badge, Button } from "@/ui/components";
import Image from "next/image";
import DotLoader from "@/components/ui/DotLoader";

interface RecipeDetailClientProps {
  recipeId: string;
}

export function RecipeDetailClient({ recipeId }: RecipeDetailClientProps) {
  const router = useRouter();
  const { recipe, isLoading, error } = useRecipeDetail(recipeId);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Button variant="secondary" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="text-center py-12 flex flex-col items-center text-muted-foreground mt-2">
          Loading recipe
          <DotLoader className="mb-4" />
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Button variant="secondary" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="text-center py-16 sm:py-24 text-red-500 text-lg">
            Recipe not found
          </div>
        </div>
      </div>
    );
  }

  // Extract ingredients from MealDB recipe
  const ingredients: Array<{ name: string; measure: string }> = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[
      `strIngredient${i}` as keyof typeof recipe
    ] as string;
    const measure = recipe[`strMeasure${i}` as keyof typeof recipe] as string;

    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient.trim(),
        measure: measure?.trim() || "",
      });
    }
  }

  // Parse tags
  const tags = recipe.strTags
    ? recipe.strTags.split(",").map((tag) => tag.trim())
    : [];

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(recipe.strYoutube);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header with Back Button */}
      <div className="flex items-center mb-6">
        <Button
          variant="icon"
          onClick={() => router.back()}
          icon={<ArrowLeft className="h-6 w-6" />}
        />
      </div>

      <div className="flex flex-col lg:gap-8 gap-4 overflow-auto">
        {/* Video or Image Hero Section */}
        {videoId ? (
          <div className="relative w-full aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={recipe.strMeal}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-[8px]"
            />
          </div>
        ) : recipe.strMealThumb ? (
          <div className="relative w-full aspect-video">
            <Image
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              fill
              className="object-cover rounded-[8px]"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              quality={85}
            />
          </div>
        ) : null}

        <div className="flex flex-col gap-6">
          {/* Recipe Title and Metadata */}

          <h1 className="text-title">{recipe.strMeal}</h1>

          {/* Category, Area, and Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-orange-100 text-orange-800">
              <ChefHat className="h-3" />
              {recipe.strCategory}
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              <Globe className="h-3 w-3 mr-1" />
              {recipe.strArea}
            </Badge>
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}

            {/* Links */}
            <div className="flex flex-wrap gap-3">
              {recipe.strSource && (
                <a
                  href={recipe.strSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Source
                </a>
              )}
            </div>
          </div>

          <div className="flex md:flex-row flex-col gap-2">
            {/* Ingredients Section */}
            <div className="space-y-2 flex-1">
              <h3 className="text-heading">Ingredients</h3>
              <div>
                <ul className="space-y-3 ">
                  {ingredients.map((ingredient, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 justify-center text-medium"
                    >
                      <span className="text-orange-500 font-bold mt-1">-</span>
                      <span className="flex-1">
                        <span className="text-body-medium">
                          {ingredient.measure}
                        </span>{" "}
                        <span className="text-body">{ingredient.name}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Instructions Section */}
            <div className="space-y-2 flex-1">
              <h3 className="text-heading">Instructions</h3>

              <div>
                <div className="prose prose-base max-w-none">
                  {recipe.strInstructions
                    .split("\r\n")
                    .map((paragraph, index) => {
                      const trimmed = paragraph.trim();
                      if (!trimmed) return null;
                      return (
                        <p
                          key={index}
                          className="mb-4 text-base leading-relaxed"
                        >
                          <span className="text-semibold text-orange-500">
                            {index + 1}.{" "}
                          </span>
                          {trimmed}
                        </p>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
