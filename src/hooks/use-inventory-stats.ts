import { useQuery } from "@tanstack/react-query";
import { InventoryStats } from "@/types";

/**
 * Fetch inventory statistics from server API
 * @returns Query result with total, expired, and expiring soon counts
 */
export function useInventoryStats() {
  return useQuery({
    queryKey: ["inventory-stats"],
    queryFn: async (): Promise<InventoryStats> => {
      const response = await fetch("/api/items/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch inventory stats");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
