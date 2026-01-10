import { useQuery } from "@tanstack/react-query";
import { Item } from "@/types/database";
import { toast } from "sonner";

type ItemFilter = "expired" | "expiring-soon";

export function useItems(search?: string, filter?: ItemFilter) {
  const queryKey = ["items", search, filter];

  const { data: items = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (filter) params.set("filter", filter);

        const url = params.toString() ? `/api/items?${params}` : "/api/items";
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }

        const data: Item[] = await response.json();
        return data;
      } catch (error) {
        toast.error("Failed to fetch items");
        throw error;
      }
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: true,
  });

  return {
    items,
    isLoading,
  };
}
