import { RecipeOverview } from "@/types/recipes";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/ui/components";
import { Badge } from "@/components/ui/badge";

import Image from "next/image";
import Link from "next/link";

export default function RecipeCard({ recipe }: { recipe: RecipeOverview }) {
  return (
    <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        {recipe.image && (
          <div className="relative w-full h-48 mb-4">
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

        <div className="mb-4">
          <h4 className="font-semibold text-lg mb-2">{recipe.title}</h4>
          <div className="flex items-center gap-2 mb-2">
            <div>
              {recipe.matchedIngredients &&
                recipe.matchedIngredients.map((ingredient: string, index) => (
                  <Badge
                    key={index}
                    className="bg-green-100 text-green-800 mr-1 mb-1"
                  >
                    {ingredient}
                  </Badge>
                ))}
              {recipe.unMatchedIngredients &&
                recipe.unMatchedIngredients.map((ingredient: string, index) => (
                  <Badge
                    key={index}
                    className="bg-red-100 text-red-800 mr-1 mb-1"
                  >
                    {ingredient}
                  </Badge>
                ))}
            </div>
          </div>
        </div>

        <Link href={`/dashboard/recipes/${recipe.id}`}>
          <Button className="w-full" variant="outline">
            View Recipe
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
