"use client";

import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/ui/components";
import { useInventoryStats } from "@/hooks/useInventoryStats";
import { AlertCircle, CheckCircle2, Clock, Package } from "lucide-react";

export function InventoryStats() {
  const { data, isLoading } = useInventoryStats();
  const { total, fresh, expired, expiringSoon } = data ?? {
    total: 0,
    fresh: 0,
    expired: 0,
    expiringSoon: 0,
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Alert Message for Expired Items */}
      {!isLoading && expired > 0 && (
        <div
          className="flex items-start gap-3 p-4 rounded-lg border"
          style={{
            backgroundColor: "#fef2f2",
            borderColor: "var(--text-danger)",
            color: "var(--text-danger)",
          }}
        >
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">
              Action Required: Remove Expired Items
            </h3>
            <p className="text-sm opacity-90">
              You have {expired} expired {expired === 1 ? "item" : "items"} in
              your inventory. Please remove or replace them to maintain food
              safety.
            </p>
          </div>
        </div>
      )}

      {/* Stats Grid - Mobile Optimized */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Fresh Items */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge
                className="text-xs px-2 py-0.5"
                style={{
                  backgroundColor: "#d1fae5",
                  color: "var(--text-success)",
                }}
              >
                Fresh
              </Badge>
              <CheckCircle2
                className="h-4 w-4"
                style={{ color: "var(--text-success)" }}
              />
            </div>

            <p
              className="text-2xl sm:text-3xl font-bold mb-1"
              style={{ color: "var(--text-value)" }}
            >
              {isLoading ? "--" : fresh}
            </p>

            <p
              className="text-xs sm:text-sm"
              style={{ color: "var(--text-tertiary)" }}
            >
              {isLoading
                ? "Loading..."
                : fresh === 0
                ? "No fresh items"
                : fresh === 1
                ? "Fresh item"
                : "Fresh items"}
            </p>
          </CardContent>
        </Card>

        {/* Expiring Soon */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge
                className="text-xs px-2 py-0.5"
                style={{
                  backgroundColor: "#fef3c7",
                  color: "var(--text-warning)",
                }}
              >
                Soon
              </Badge>
              <Clock
                className="h-4 w-4"
                style={{ color: "var(--text-warning)" }}
              />
            </div>

            <p
              className="text-2xl sm:text-3xl font-bold mb-1"
              style={{ color: "var(--text-value)" }}
            >
              {isLoading ? "--" : expiringSoon}
            </p>

            <p
              className="text-xs sm:text-sm"
              style={{ color: "var(--text-tertiary)" }}
            >
              {isLoading
                ? "Checking..."
                : expiringSoon > 0
                ? "Use soon"
                : "None expiring"}
            </p>
          </CardContent>
        </Card>

        {/* Expired */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge
                className="text-xs px-2 py-0.5"
                style={{
                  backgroundColor: "#fee2e2",
                  color: "var(--text-danger)",
                }}
              >
                Expired
              </Badge>
              <AlertCircle
                className="h-4 w-4"
                style={{ color: "var(--text-danger)" }}
              />
            </div>

            <p
              className="text-2xl sm:text-3xl font-bold mb-1"
              style={{ color: "var(--text-value)" }}
            >
              {isLoading ? "--" : expired}
            </p>

            <p
              className="text-xs sm:text-sm"
              style={{ color: "var(--text-tertiary)" }}
            >
              {isLoading
                ? "Checking..."
                : expired > 0
                ? "Remove now"
                : "All good!"}
            </p>
          </CardContent>
        </Card>

        {/* Total Inventory */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge
                className="text-xs px-2 py-0.5"
                style={{
                  backgroundColor: "#e0e7ff",
                  color: "var(--text-info)",
                }}
              >
                Total
              </Badge>
              <Package
                className="h-4 w-4"
                style={{ color: "var(--text-info)" }}
              />
            </div>

            <p
              className="text-2xl sm:text-3xl font-bold mb-1"
              style={{ color: "var(--text-value)" }}
            >
              {isLoading ? "--" : total}
            </p>

            <p
              className="text-xs sm:text-sm"
              style={{ color: "var(--text-tertiary)" }}
            >
              {isLoading
                ? "Loading..."
                : total === 0
                ? "Add items"
                : total === 1
                ? "Item tracked"
                : "Items tracked"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
