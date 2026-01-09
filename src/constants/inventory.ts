export const tabs = [
  {
    label: "All",
    path: "/dashboard/inventory/all",
  },
  {
    label: "Expired",
    path: "/dashboard/inventory/expired",
  },
  {
    label: "Expiring Soon",
    path: "/dashboard/inventory/expiring-soon",
  },
];

export type FilterOption = "all" | "expired" | "expiring-soon";

export const filterOptions = [
  { value: "all", label: "All" },
  { value: "expired", label: "Expired" },
  { value: "expiring-soon", label: "Expiring Soon" },
];

// Determine content based on filter
export const getEmptyStateContent = (filter: FilterOption) => {
  switch (filter) {
    case "expired":
      return {
        title: "No expired items",
        description:
          "Great! You don't have any expired items in your inventory",
      };
    case "expiring-soon":
      return {
        title: "No items expiring soon",
        description: "No items are expiring within the next 2 days",
      };
    default:
      return {
        title: "No items in inventory",
        description: "Start by adding items to your inventory",
      };
  }
};
