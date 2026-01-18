import { RecipeOverview } from "@/types/recipes";
import { Badge, Button, Card } from "@/ui/components";
import { AlarmClock, ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function RecipeCard({ recipe }: { recipe: RecipeOverview }) {
  const hasExpiringItems = (recipe.expiringIngredientsCount ?? 0) > 0;

  return (
    <Card>
      <div className="flex flex-col gap-4 -p-2 h-full">
        {recipe.image && (
          <div className="relative w-full aspect-[4/3] rounded-[8px]">
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              className="object-cover rounded-md"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              loading="eager"
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <h4 className="text-subheading">{recipe.title}</h4>

          {/* Matched ingredients info */}
          {recipe.matchedIngredientsCount !== undefined &&
            recipe.totalIngredientsCount !== undefined && (
              <p className="text-small text-green-600 flex flex-row items-center gap-1">
                <ThumbsUp className="w-4 h-4" />{" "}
                {recipe.matchedIngredientsCount}/{recipe.totalIngredientsCount}{" "}
                ingredients available
              </p>
            )}

          {/* Expiring ingredients info */}
          {hasExpiringItems && recipe.expiringIngredients && (
            <div className="flex flex-col gap-1">
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-800 w-fit flex flex-row gap-1"
              >
                <AlarmClock className="w-4 h-4" />
                {recipe.expiringIngredientsCount} expiring ingredient
                {recipe.expiringIngredientsCount! > 1 ? "s" : ""} used
              </Badge>
              <p className="text-small">
                Expiring Items:{" "}
                {recipe.expiringIngredients.slice(0, 3).join(", ")}
                {recipe.expiringIngredients.length > 3 &&
                  ` +${recipe.expiringIngredients.length - 3} more`}
              </p>
            </div>
          )}
        </div>

        <Link
          href={`/dashboard/recipes/${recipe.id}`}
          className="mt-auto w-full"
        >
          <Button variant="primary" maxWidth="100%">
            View Recipe
          </Button>
        </Link>
      </div>
    </Card>
  );
}
