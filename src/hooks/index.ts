/**
 * Global hooks for the application
 * Export all custom hooks from this file for easy imports
 */

export { useDebounce } from "./useDebounce";
export { useInventoryStats } from "./useInventoryStats";
export { useSearch } from "./use-search";

// Auth hooks
export { useUser, useSession } from "./useAuth";

// item hooks
export { useItems } from "./useItems";
export { useItemMutations } from "./useItemMutations";
