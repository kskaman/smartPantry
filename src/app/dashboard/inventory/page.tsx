import { createServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { InventoryClient } from "./components/InventoryClient";
import { ExpiredItemsBanner } from "../components/ExpiredItemsBanner";

export default async function InventoryPage() {
  // Middleware already protects this route, just get user data
  const user = await getCurrentUser();

  if (!user) {
    return null; // Should never happen due to middleware
  }

  const supabase = await createServerClient();
  const { data: items } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", user.id)
    .order("expiry_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  return (
    <div className="section-shell py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold mb-2">Inventory</h1>
        <p className="text-muted-foreground">
          Manage your household food items
        </p>
      </div>

      <ExpiredItemsBanner items={items || []} showDeleteButton={false} />

      <InventoryClient userId={user.id} initialItems={items || []} />
    </div>
  );
}
