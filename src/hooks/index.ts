/**
 * Global hooks for the application
 * Export all custom hooks from this file for easy imports
 */

export { useDebounce } from "./useDebounce";
export { useDeferredSearch } from "./useDeferredSearch";

// Auth hooks
export { useUser, useSession, useSupabase, signOut } from "./useAuth";

// Direct Supabase query hooks (alternative to API routes)
export {
  useItemsDirect,
  useCreateItemDirect,
  useUpdateItemDirect,
  useDeleteItemDirect,
} from "./useSupabaseQuery";
