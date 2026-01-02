"use client";

import { Item } from "@/types/database";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getExpiredItems, getExpiringSoonItems } from "@/lib/expiry-utils";
import { useState } from "react";
import Link from "next/link";

interface ExpiredItemsBannerProps {
  items: Item[];
  onDeleteExpired?: () => void;
  showDeleteButton?: boolean;
}

export function ExpiredItemsBanner({
  items,
  onDeleteExpired,
  showDeleteButton = false,
}: ExpiredItemsBannerProps) {
  const expiredItems = getExpiredItems(items);
  const expiringSoonItems = getExpiringSoonItems(items);

  const hasExpired = expiredItems.length > 0;
  const hasExpiringSoon = expiringSoonItems.length > 0;

  if (!hasExpired && !hasExpiringSoon) {
    return null;
  }

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-900">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-500 flex-shrink-0 mt-0.5" />

          <div className="flex-1 space-y-3">
            {hasExpired && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                    {expiredItems.length} Expired Item
                    {expiredItems.length !== 1 ? "s" : ""}
                  </h3>
                  <Badge variant="destructive">Action Required</Badge>
                </div>
                <p className="text-sm text-orange-800 dark:text-orange-200 mb-2">
                  The following items have expired and should be removed:
                </p>
                <div className="flex flex-wrap gap-2">
                  {expiredItems.slice(0, 5).map((item) => (
                    <Badge
                      key={item.id}
                      variant="outline"
                      className="bg-white dark:bg-gray-800"
                    >
                      {item.name}
                    </Badge>
                  ))}
                  {expiredItems.length > 5 && (
                    <Badge
                      variant="outline"
                      className="bg-white dark:bg-gray-800"
                    >
                      +{expiredItems.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {hasExpiringSoon && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                    {expiringSoonItems.length} Item
                    {expiringSoonItems.length !== 1 ? "s" : ""} Expiring Soon
                  </h3>
                  <Badge variant="secondary">Attention Needed</Badge>
                </div>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  These items will expire within 2 days. Use them soon!
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {expiringSoonItems.slice(0, 5).map((item) => (
                    <Badge
                      key={item.id}
                      variant="outline"
                      className="bg-white dark:bg-gray-800"
                    >
                      {item.name}
                    </Badge>
                  ))}
                  {expiringSoonItems.length > 5 && (
                    <Badge
                      variant="outline"
                      className="bg-white dark:bg-gray-800"
                    >
                      +{expiringSoonItems.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <Link href="/dashboard/inventory?tab=expired">
                <Button size="sm" variant="default">
                  View Expired Items
                </Button>
              </Link>
              {showDeleteButton && onDeleteExpired && hasExpired && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={onDeleteExpired}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All Expired ({expiredItems.length})
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
