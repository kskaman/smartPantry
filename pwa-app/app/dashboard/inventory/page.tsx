import { auth } from "@/app/api/auth/[...nextauth]/route";
import { createServerClient } from "@/lib/supabase/server";
import { InventoryClient } from "./components/InventoryClient";
import { ExpiredItemsBanner } from "../components/ExpiredItemsBanner";

export default async function InventoryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const supabase = await createServerClient();
  const { data: items } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", session.user.id)
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

      <InventoryClient userId={session.user.id} initialItems={items || []} />
    </div>
  );
}
