import { useState, useCallback } from "react";
import { useDebounce } from "./useDebounce";

interface UseSearchOptions {
  debounceMs?: number;
  onSearch?: (query: string) => void;
}

export function useSearch(options: UseSearchOptions = {}) {
  const { debounceMs = 500, onSearch } = options;
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, debounceMs);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleSearchSubmit = useCallback(() => {
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  }, [searchQuery, onSearch]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return {
    searchQuery,
    debouncedSearchQuery,
    setSearchQuery: handleSearchChange,
    handleSearchSubmit,
    clearSearch,
  };
}
