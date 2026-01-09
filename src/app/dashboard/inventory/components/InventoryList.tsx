"use client";

import { useState, useMemo } from "react";
import { Item } from "@/types";
import { Card, ConfirmModal, Loader } from "@/ui/components";
import ItemRow from "./ItemRow";
import ItemModal from "@/app/dashboard/components/ItemModal";
import EmptyState from "./EmptyState";
import Pagination from "./Pagination";

interface InventoryListProps {
  items: Item[];
  isLoading: boolean;
  onRefresh: () => void;
  onDelete: (id: string) => Promise<boolean>;
  emptyTitle: string;
  emptyDescription: string;
  header?: React.ReactNode;
  itemsPerPage?: number;
}

export default function InventoryList({
  items,
  isLoading,
  onRefresh,
  onDelete,
  emptyTitle,
  emptyDescription,
  header,
  itemsPerPage = 10,
}: InventoryListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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

    setIsDeleting(itemToDelete);
    setIsDeleteModalOpen(false);
    await onDelete(itemToDelete);
    setIsDeleting(null);
    setItemToDelete(null);
  };

  const handleEditSuccess = () => {
    onRefresh();
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
        <Card>
          <div className="overflow-x-auto -m-4">
            <table className="w-full">
              <tbody>
                {paginatedItems.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    isDeleting={isDeleting}
                    handleDelete={handleDelete}
                    onEdit={setEditingItem}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="-mx-4 -mb-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={items.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        </Card>
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
