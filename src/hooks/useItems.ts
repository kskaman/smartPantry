import { useCallback, useEffect, useState } from "react";
import { Item } from "@/types/database";
import { toast } from "sonner";

type ItemFilter = "expired" | "expiring-soon";

export function useItems(search?: string, filter?: ItemFilter) {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filter) params.set("filter", filter);
      
      const url = params.toString() ? `/api/items?${params}` : "/api/items";
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        toast.error("Failed to fetch items");
      }
    } catch {
      toast.error("Failed to fetch items");
    } finally {
      setIsLoading(false);
    }
  }, [search, filter]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const deleteItem = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        toast.success("Item deleted successfully");
        return true;
      } else {
        toast.error("Failed to delete item");
        return false;
      }
    } catch {
      toast.error("Failed to delete item");
      return false;
    }
  }, []);

  const deleteMultipleItems = useCallback(async (itemIds: string[]) => {
    try {
      const deletePromises = itemIds.map((id) =>
        fetch(`/api/items/${id}`, { method: "DELETE" })
      );

      const results = await Promise.all(deletePromises);
      const successCount = results.filter((r) => r.ok).length;

      if (successCount > 0) {
        setItems((prev) => prev.filter((item) => !itemIds.includes(item.id)));
        toast.success(
          `Deleted ${successCount} item${successCount !== 1 ? "s" : ""}`
        );
      }

      if (successCount < itemIds.length) {
        toast.error(
          `Failed to delete ${itemIds.length - successCount} item${
            itemIds.length - successCount !== 1 ? "s" : ""
          }`
        );
      }

      return successCount === itemIds.length;
    } catch {
      toast.error("Failed to delete items");
      return false;
    }
  }, []);

  return {
    items,
    isLoading,
    fetchItems,
    deleteItem,
    deleteMultipleItems,
  };
}
