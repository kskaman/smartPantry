"use client";

import { useState, useMemo } from "react";
import { Item } from "@/types";
import { ConfirmModal, Loader } from "@/ui/components";
import { useItemMutations } from "@/hooks";
import ItemRow from "./ItemRow";
import ItemModal from "@/app/dashboard/components/ItemModal";
import EmptyState from "./EmptyState";
import Pagination from "../../../../ui/components/Pagination";

interface InventoryListProps {
  items: Item[];
  isLoading: boolean;
  emptyTitle: string;
  emptyDescription: string;
  header?: React.ReactNode;
  itemsPerPage?: number;
}

export default function InventoryList({
  items,
  isLoading,
  emptyTitle,
  emptyDescription,
  header,
  itemsPerPage = 10,
}: InventoryListProps) {
  const { deleteItem } = useItemMutations();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const isDeleting = deleteItem.isPending;

  // Calculate pagination
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  // Reset to page 1 when items change
  useMemo(() => {
    const handleCurrentPageChange = () => {
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(1);
      }
    };

    handleCurrentPageChange();
  }, [currentPage, totalPages]);

  const handleDelete = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleteModalOpen(false);
    await deleteItem.mutateAsync(itemToDelete);
    setItemToDelete(null);
  };

  const handleEditSuccess = () => {
    setEditingItem(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {header}

      {items.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="bg-(--table-bg) rounded-[12px] border border-(--table-border) py-2">
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                {paginatedItems.map((item, idx) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    isDeleting={isDeleting ? itemToDelete : null}
                    handleDelete={handleDelete}
                    onEdit={setEditingItem}
                    isLastItem={idx === paginatedItems.length - 1}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={items.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="warning"
        disabled={!!isDeleting}
      />

      <ItemModal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        item={editingItem}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
