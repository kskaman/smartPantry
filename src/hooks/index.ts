/**
 * Global hooks for the application
 * Export all custom hooks from this file for easy imports
 */

export { useDebounce } from "./use-debounce";
export { useInventoryStats } from "./use-inventory-stats";
export { useSearch } from "./use-search";

// Auth hooks
export { useUser, useSession } from "./use-auth";

// item hooks
export { useItems, useItemMutations } from "./use-Items";

// PWA hooks
export { usePWAStatus, getAppOpenURL, shouldShowOpenInApp } from "./use-pwa-status";
