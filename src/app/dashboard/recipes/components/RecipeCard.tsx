import { RecipeOverview } from "@/types/recipes";

import { Button, Card } from "@/ui/components";

import Image from "next/image";
import Link from "next/link";

export default function RecipeCard({ recipe }: { recipe: RecipeOverview }) {
  return (
    <Card key={recipe.id}>
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

        <h4 className="text-subheading">{recipe.title}</h4>

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
