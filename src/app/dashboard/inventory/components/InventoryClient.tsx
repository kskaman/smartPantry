"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, AlertTriangle } from "lucide-react";
import { Item, Location } from "@/types/database";
import { AddItemModal } from "../../components/AddItemModal";
import { EditItemModal } from "../../components/EditItemModal";
import { Modal } from "@/app/components/Modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { getExpiryStatus, getExpiredItems } from "@/lib/expiry-utils";

interface InventoryClientProps {
  userId: string;
  initialItems: Item[];
}

export function InventoryClient({
  userId,
  initialItems,
}: InventoryClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>(initialItems);
  const [filter, setFilter] = useState<Location | "all" | "expired">("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Check for tab parameter in URL
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "expired") {
      setFilter("expired");
    }
  }, [searchParams]);

  const fetchItems = useCallback(async () => {
    try {
      const url = "/api/items";
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Failed to fetch items:", error);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDelete = async (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(itemToDelete);
    setIsDeleteModalOpen(false);
    try {
      const response = await fetch(`/api/items/${itemToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setItems((prev) => prev.filter((item) => item.id !== itemToDelete));
        toast.success("Item deleted successfully");
      } else {
        toast.error("Failed to delete item");
      }
    } catch {
      toast.error("Failed to delete item");
    } finally {
      setIsDeleting(null);
      setItemToDelete(null);
    }
  };

  const handleBulkDeleteExpired = async () => {
    const expiredItems = getExpiredItems(items);
    if (expiredItems.length === 0) return;

    setIsBulkDeleting(true);
    try {
      const deletePromises = expiredItems.map((item) =>
        fetch(`/api/items/${item.id}`, { method: "DELETE" })
      );

      const results = await Promise.all(deletePromises);
      const successCount = results.filter((r) => r.ok).length;

      if (successCount > 0) {
        setItems((prev) =>
          prev.filter((item) => !expiredItems.some((exp) => exp.id === item.id))
        );
        toast.success(
          `Deleted ${successCount} expired item${successCount !== 1 ? "s" : ""}`
        );
      }

      if (successCount < expiredItems.length) {
        toast.error(
          `Failed to delete ${expiredItems.length - successCount} item${
            expiredItems.length - successCount !== 1 ? "s" : ""
          }`
        );
      }
    } catch {
      toast.error("Failed to delete expired items");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const expiredItems = getExpiredItems(items);

  const filteredItems =
    filter === "all"
      ? items
      : filter === "expired"
      ? expiredItems
      : items.filter((item) => item.location === filter);

  const locationCounts = {
    all: items.length,
    fridge: items.filter((item) => item.location === "fridge").length,
    pantry: items.filter((item) => item.location === "pantry").length,
    freezer: items.filter((item) => item.location === "freezer").length,
    other: items.filter((item) => item.location === "other").length,
    expired: expiredItems.length,
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { value: "all", label: "All", variant: undefined },
              { value: "fridge", label: "Fridge", variant: undefined },
              { value: "pantry", label: "Pantry", variant: undefined },
              { value: "freezer", label: "Freezer", variant: undefined },
              { value: "other", label: "Other", variant: undefined },
              {
                value: "expired",
                label: "Expired",
                variant: "destructive" as const,
              },
            ] as const
          ).map((option) => (
            <Button
              key={option.value}
              onClick={() =>
                setFilter(option.value as Location | "all" | "expired")
              }
              variant={
                filter === option.value
                  ? option.variant || "default"
                  : "outline"
              }
              size="sm"
            >
              {option.label} ({locationCounts[option.value]})
              {option.value === "expired" && locationCounts.expired > 0 && (
                <AlertTriangle className="h-3 w-3 ml-1" />
              )}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          {filter === "expired" && expiredItems.length > 0 && (
            <Button
              onClick={handleBulkDeleteExpired}
              variant="destructive"
              size="sm"
              disabled={isBulkDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete All Expired ({expiredItems.length})
            </Button>
          )}
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-2">No items found</p>
            <p className="text-muted-foreground text-sm">
              {filter === "all"
                ? "Start by adding items to your inventory"
                : `No items in ${filter}`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredItems.map((item) => {
            const expiryStatus = getExpiryStatus(item.expiry_date);
            return (
              <Card key={item.id}>
                <CardContent className="flex items-center justify-between gap-4 py-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{item.name}</h3>

                      {expiryStatus && (
                        <Badge variant={expiryStatus.variant}>
                          {expiryStatus.label}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>
                        Quantity: {item.quantity}
                        {item.unit && ` ${item.unit}`}
                      </span>

                      {item.expiry_date && (
                        <span>
                          Expires:{" "}
                          {new Date(item.expiry_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {item.notes && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {item.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingItem(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeleting === item.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        userId={userId}
        onSuccess={() => {
          fetchItems();
        }}
      />

      <EditItemModal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        item={editingItem}
        onSuccess={() => {
          fetchItems();
          setEditingItem(null);
        }}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
        description="Are you sure you want to delete this item? This action cannot be undone."
        actions={[
          {
            label: "Delete",
            onClick: confirmDelete,
            variant: "destructive",
            disabled: !!isDeleting,
          },
        ]}
        closeButtonLabel="Cancel"
        showCloseButton={true}
      />
    </>
  );
}
