import { useDeferredValue } from 'react';

/**
 * Custom hook that uses React's useDeferredValue for search queries
 * This is a React 18+ feature that allows us to defer updates to a value
 * It's useful for keeping the UI responsive during expensive operations
 * 
 * @param value - The search query value to defer
 * @returns The deferred value that React will update during idle time
 * 
 * @example
 * const searchQuery = "pizza";
 * const deferredQuery = useDeferredSearch(searchQuery);
 * // UI stays responsive while search is processed
 */
export function useDeferredSearch(value: string): string {
  return useDeferredValue(value);
}
