export const tabs = [
  {
    label: "Fresh",
    path: "/dashboard/inventory/fresh",
  },
  {
    label: "Expiring Soon",
    path: "/dashboard/inventory/expiring-soon",
  },
  {
    label: "Expired",
    path: "/dashboard/inventory/expired",
  },
];

export type FilterOption = "fresh" | "expired" | "expiring-soon";

export const filterOptions = [
  { value: "fresh", label: "Fresh" },
  { value: "expiring-soon", label: "Expiring Soon" },
  { value: "expired", label: "Expired" },
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
        description: "No items are expiring within the next 7 days",
      };
    case "fresh":
      return {
        title: "No fresh items",
        description: "All your items are either expired or expiring soon",
      };
    default:
      return {
        title: "No items in inventory",
        description: "Start by adding items to your inventory",
      };
  }
};
