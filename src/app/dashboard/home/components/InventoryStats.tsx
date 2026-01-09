"use client";

import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/ui/components";
import { useInventoryStats } from "@/hooks/useInventoryStats";

export function InventoryStats() {
  const { data, isLoading } = useInventoryStats();
  const { total, expired, expiringSoon } = data ?? {
    total: 0,
    expired: 0,
    expiringSoon: 0,
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8">
      {/* Total Items */}
      <Card>
        <CardContent className="pt-6">
          <Badge className="bg-green-100 text-green-700 mb-4">Inventory</Badge>

          <p className="text-sm text-muted-foreground mb-1">Total Items</p>

          <p className="text-3xl font-semibold">
            {isLoading ? "--" : total ?? 0}
          </p>

          <p className="text-muted-foreground text-sm mt-2">
            {isLoading
              ? "Loading items..."
              : total === 0
              ? "No items added yet"
              : "Items in inventory"}
          </p>
        </CardContent>
      </Card>

      {/* Expiring Soon */}
      <Card>
        <CardContent className="pt-6">
          <Badge className="bg-yellow-100 text-yellow-700 mb-4">Warning</Badge>

          <p className="text-sm text-muted-foreground mb-1">Expiring Soon</p>

          <p className="text-3xl font-semibold">
            {isLoading ? "--" : expiringSoon ?? 0}
          </p>

          <p className="text-muted-foreground text-sm mt-2">
            {isLoading
              ? "Checking dates..."
              : expiringSoon > 0
              ? "Needs attention"
              : "No items expiring soon"}
          </p>
        </CardContent>
      </Card>

      {/* Expired */}
      <Card>
        <CardContent className="pt-6">
          <Badge className="bg-red-100 text-red-700 mb-4">Expired</Badge>

          <p className="text-sm text-muted-foreground mb-1">Expired Items</p>

          <p className="text-3xl font-semibold">
            {isLoading ? "--" : expired ?? 0}
          </p>

          <p className="text-muted-foreground text-sm mt-2">
            {isLoading
              ? "Checking expiry..."
              : expired > 0
              ? "Remove or replace items"
              : "No expired items"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
