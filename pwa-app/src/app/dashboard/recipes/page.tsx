import { redirect } from "next/navigation";

export default function RecipesPage() {
  // Redirect to suggestions by default
  redirect("/dashboard/recipes/suggestions");
}
