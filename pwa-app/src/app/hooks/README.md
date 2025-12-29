# Global Hooks

This folder contains reusable custom hooks for the entire application.

## Available Hooks

### `useDebounce`

A custom hook that debounces a value with a specified delay.

**Use Case:** When you need precise control over debounce timing (e.g., 300ms, 500ms).

**Example:**

```tsx
import { useDebounce } from "@/app/hooks";

const [searchQuery, setSearchQuery] = useState("");
const debouncedQuery = useDebounce(searchQuery, 300); // 300ms delay

// debouncedQuery will only update 300ms after user stops typing
```

**Pros:**

- Precise control over delay timing
- Simple to understand and use
- Works with any value type
- Easy to test

**Cons:**

- Requires manual cleanup (handled internally)
- Not integrated with React's concurrent features

---

### `useDeferredValue` (React Built-in)

React 18+ built-in hook that defers updating a value to keep the UI responsive.

**Use Case:** When you want React to automatically handle timing based on UI priority.

**Example:**

```tsx
import { useDeferredValue } from "react";

const [searchQuery, setSearchQuery] = useState("");
const deferredQuery = useDeferredValue(searchQuery);

// React decides when to update deferredQuery based on UI priority
```

**Pros:**

- Built into React (no custom hook needed)
- Automatically optimized by React's scheduler
- Better integration with Concurrent React features
- No manual timing configuration needed

**Cons:**

- Less control over exact timing
- Only available in React 18+
- Timing depends on React's internal scheduling

---

### `useDeferredSearch`

A thin wrapper around React's `useDeferredValue` specifically for search queries.

**Use Case:** Semantic wrapper for search functionality using deferred values.

**Example:**

```tsx
import { useDeferredSearch } from "@/app/hooks";

const [searchQuery, setSearchQuery] = useState("");
const deferredQuery = useDeferredSearch(searchQuery);
```

---

## Which Hook to Use?

### Use `useDebounce` when:

- ✅ You need a specific delay (e.g., "wait exactly 300ms")
- ✅ You're working with forms or user input validation
- ✅ You need consistent timing across all scenarios
- ✅ You want explicit control

### Use `useDeferredValue` when:

- ✅ You want React to optimize timing automatically
- ✅ You're using React 18+ Concurrent features
- ✅ UI responsiveness is more important than exact timing
- ✅ You want to leverage React's scheduling priorities

### Current Implementation

The `SearchRecipes` component uses `useDebounce` with a 500ms delay to reduce API calls for autocomplete suggestions. This ensures the autocomplete endpoint is only hit after the user has stopped typing for 500ms, providing a good balance between responsiveness and reducing unnecessary API calls.

**Why this approach:**

- ✅ Significantly reduces API calls (only calls after user stops typing)
- ✅ Better server resource management
- ✅ Lower costs for API usage
- ✅ Still feels responsive to users (500ms is barely noticeable)

Previous implementations are available as backups:

- `SearchRecipes-debounce-backup.tsx` - Original debounce version (300ms)
- Alternative: Use `useDeferredValue` for UI responsiveness without debouncing API calls

---

## Adding New Hooks

When adding new hooks:

1. Create a new file in this folder: `app/hooks/useYourHook.ts`
2. Export it from `index.ts`
3. Document it in this README
4. Add TypeScript types and JSDoc comments

Example:

```tsx
// app/hooks/useYourHook.ts
import { useState, useEffect } from "react";

/**
 * Description of your hook
 * @param param - Description of parameter
 * @returns Description of return value
 */
export function useYourHook(param: string): ReturnType {
  // Implementation
}
```

Then in `index.ts`:

```tsx
export { useYourHook } from "./useYourHook";
```
