import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Item } from "@/types";
import { toast } from "sonner";

export function useItemMutations() {
  const queryClient = useQueryClient();

  // Create item mutation
  const createItem = useMutation({
    mutationFn: async (item: Omit<Item, "id">) => {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add item");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Item added successfully");
      // Invalidate items queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-stats"] });
    },
    onError: () => {
      toast.error("Failed to add item");
    },
  });

  // Update item mutation
  const updateItem = useMutation({
    mutationFn: async ({
      id,
      item,
    }: {
      id: string;
      item: Omit<Item, "id">;
    }) => {
      const response = await fetch(`/api/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update item");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Item updated successfully");
      // Invalidate items queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-stats"] });
    },
    onError: () => {
      toast.error("Failed to update item");
    },
  });

  // Delete item mutation
  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/items/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      return id;
    },
    onSuccess: () => {
      toast.success("Item deleted successfully");
      // Invalidate items queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-stats"] });
    },
    onError: () => {
      toast.error("Failed to delete item");
    },
  });

  // Delete multiple items mutation
  const deleteMultipleItems = useMutation({
    mutationFn: async (itemIds: string[]) => {
      const deletePromises = itemIds.map((id) =>
        fetch(`/api/items/${id}`, { method: "DELETE" })
      );

      const results = await Promise.all(deletePromises);
      const successCount = results.filter((r) => r.ok).length;

      if (successCount === 0) {
        throw new Error("Failed to delete any items");
      }

      return {
        successCount,
        failedCount: itemIds.length - successCount,
        total: itemIds.length,
      };
    },
    onSuccess: (data) => {
      if (data.successCount > 0) {
        toast.success(
          `Deleted ${data.successCount} item${
            data.successCount !== 1 ? "s" : ""
          }`
        );
      }

      if (data.failedCount > 0) {
        toast.error(
          `Failed to delete ${data.failedCount} item${
            data.failedCount !== 1 ? "s" : ""
          }`
        );
      }

      // Invalidate items queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-stats"] });
    },
    onError: () => {
      toast.error("Failed to delete items");
    },
  });

  return {
    createItem,
    updateItem,
    deleteItem,
    deleteMultipleItems,
  };
}
