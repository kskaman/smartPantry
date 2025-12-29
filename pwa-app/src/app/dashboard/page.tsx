import { auth } from "@/auth";
import { createServerClient } from "@/lib/supabase/server";
import { DashboardClient } from "./components/DashboardClient";
import { ExpiredItemsBanner } from "./components/ExpiredItemsBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getExpiryStats } from "@/lib/expiry-utils";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  // Fetch stats from database
  const supabase = await createServerClient();
  const { data: items } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", session.user.id);

  const totalItems = items?.length || 0;
  const expiryStats = getExpiryStats(items || []);

  return (
    <div className="section-shell py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user?.name}!
        </p>
      </div>

      {/* Expired Items Banner */}
      <ExpiredItemsBanner items={items || []} />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                Active
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Items</p>
            <p className="text-2xl font-semibold">{totalItems}</p>
            <p className="text-muted-foreground text-sm mt-2">
              {totalItems === 0
                ? "No items yet"
                : `${totalItems} item${
                    totalItems !== 1 ? "s" : ""
                  } in inventory`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                Alert
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Needs Attention</p>
            <p className="text-2xl font-semibold">{expiryStats.total}</p>
            <p className="text-muted-foreground text-sm mt-2">
              {expiryStats.expired > 0 && `${expiryStats.expired} expired • `}
              {expiryStats.expiringSoon > 0 ? `${expiryStats.expiringSoon} expiring soon` : "No items expiring"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                Ready
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Recipe Matches</p>
            <p className="text-2xl font-semibold">0</p>
            <p className="text-muted-foreground text-sm mt-2">
              {totalItems === 0 ? "Start adding items" : "Coming soon"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <DashboardClient
        userId={session.user.id}
        recentItems={items?.slice(0, 5) || []}
      />
    </div>
  );
}
