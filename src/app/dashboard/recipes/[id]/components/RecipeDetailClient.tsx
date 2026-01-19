"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRecipeDetail, useToggleSaveRecipe } from "@/hooks/use-recipes";
import {
  ArrowLeft,
  ExternalLink,
  ChefHat,
  Globe,
  Tag,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { Badge, Button, Card, Loader } from "@/ui/components";
import Image from "next/image";
import { toast } from "@/lib/toast";

interface RecipeDetailClientProps {
  recipeId: string;
}

export function RecipeDetailClient({ recipeId }: RecipeDetailClientProps) {
  const router = useRouter();
  const { recipe, isLoading, error } = useRecipeDetail(recipeId);
  const [isSaving, setIsSaving] = useState(false);
  const { saveMutation, unsaveMutation } = useToggleSaveRecipe(recipeId);

  const handleSaveToggle = async () => {
    if (!recipe) return;

    setIsSaving(true);

    try {
      if (recipe.isSaved) {
        // Unsave
        await unsaveMutation.mutateAsync(recipeId);
        toast.success("Recipe removed from saved");
      } else {
        // Save
        const result = await saveMutation.mutateAsync({
          recipeId: recipe.idMeal,
          recipeTitle: recipe.strMeal,
          recipeImage: recipe.strMealThumb,
        });
        if (result.alreadySaved) {
          toast.info("Recipe already saved");
        } else {
          toast.success("Recipe saved");
        }
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Button
          variant="icon"
          onClick={() => router.back()}
          icon={<ArrowLeft className="h-6 w-6" />}
        />

        <Card>
          Loading recipe
          <Loader />
        </Card>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Button
            variant="icon"
            onClick={() => router.back()}
            icon={<ArrowLeft className="h-6 w-6" />}
          />

          <Card>Recipe not found</Card>
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
      {/* Header with Back Button and Save Button */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="icon"
          onClick={() => router.back()}
          icon={<ArrowLeft className="h-6 w-6" />}
        />

        <Button
          variant={recipe.isSaved ? "secondary" : "primary"}
          onClick={handleSaveToggle}
          disabled={isSaving}
          icon={
            recipe.isSaved ? (
              <BookmarkCheck className="h-5 w-5" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )
          }
        >
          {isSaving ? "..." : recipe.isSaved ? "UnSave Recipe" : "Save Recipe"}
        </Button>
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
            <Badge className="text-(--text-warning) bg-[#fef3c7]">
              <ChefHat className="h-3" />
              {recipe.strCategory}
            </Badge>
            <Badge className="bg-(--text-info) bg-[#dbeafe]">
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
                  className="inline-flex items-center text-small transition-colors text-(--text-info)"
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
                      <span className="font-bold mt-1 text-(--text-warning)">
                        -
                      </span>
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
                  {(() => {
                    let steps;

                    // Check for \r\n, \n, or \r and split accordingly
                    if (/\r\n/.test(recipe.strInstructions)) {
                      steps = recipe.strInstructions.split(/\r\n/);
                    } else if (/\n/.test(recipe.strInstructions)) {
                      steps = recipe.strInstructions.split(/\n/);
                    } else if (/\r/.test(recipe.strInstructions)) {
                      steps = recipe.strInstructions.split(/\r/);
                    } else {
                      // Fallback: split by sentences
                      steps =
                        recipe.strInstructions.split(/\.(?=\s+[A-Z])|\.$/);
                    }

                    return steps
                      .map((step) => step.trim())
                      .filter((step) => step.length > 0)
                      .filter((step) => !/^\s*step\s*\d+\s*:?\s*$/i.test(step)) // remove label-only steps
                      .map((step, index) => (
                        <p
                          key={index}
                          className="mb-4 text-body leading-relaxed"
                        >
                          <span
                            className="font-semibold text-(--text-warning)"
                            style={{ color: "var(--text-warning)" }}
                          >
                            {index + 1}.{" "}
                          </span>
                          {step}
                        </p>
                      ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
