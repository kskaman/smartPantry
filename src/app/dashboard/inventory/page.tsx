"use client";

import { useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { useDebounce, useItems, useItemMutations } from "@/hooks";
import { Button, Select, TextInput } from "@/ui/components";
import { AddItemsSection } from "../components/AddItemsSection";
import { InventoryList } from "./components";
import { FilterOption, filterOptions, getEmptyStateContent } from "@/constants";

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterOption>("fresh");
  const debouncedSearch = useDebounce(search, 1000);

  const { items, isLoading } = useItems(
    debouncedSearch,
    filter
  );
  const { deleteMultipleItems } = useItemMutations();

  const handleBulkDeleteExpired = async () => {
    if (items.length === 0) return;

    const itemIds = items.map((item) => item.id).filter((id): id is string => !!id);
    if (itemIds.length === 0) return;
    await deleteMultipleItems.mutateAsync(itemIds);
  };

  const isBulkDeleting = deleteMultipleItems.isPending;

  const emptyState = getEmptyStateContent(filter);

  const bulkDeleteButton = filter === "expired" && items.length > 0 && (
    <div className="flex justify-end">
      <Button
        onClick={handleBulkDeleteExpired}
        variant="warning"
        width="225px"
        disabled={isBulkDeleting}
        icon={<Trash2 className="h-4 w-4" />}
      >
        Delete All Expired ({items.length})
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-2">
        <h1 className="text-title">Inventory</h1>
        <p className="text-small">Track expired and expiring items</p>
      </div>

      <AddItemsSection />

      <div className="flex flex-col lg:flex-row gap-2 justify-center">
        <div className="flex-1">
          <TextInput
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder="Search items"
            startIcon={<Search className="h-4 w-4" style={{ color: "var(--text-muted)" }} />}
          />
        </div>

        <div className="flex-1  lg:mt-[3px]">
          <Select
            value={filter}
            onChange={(val) => setFilter(val as FilterOption)}
            ariaLabel="Inventory view"
            options={filterOptions}
            placeholderOption={filterOptions[0]}
            placeholderSelectable={true}
          />
        </div>
      </div>

      <InventoryList
        items={items}
        isLoading={isLoading}
        emptyTitle={emptyState.title}
        emptyDescription={emptyState.description}
        header={bulkDeleteButton}
      />
    </div>
  );
}
