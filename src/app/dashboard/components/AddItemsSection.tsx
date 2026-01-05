"use client";

import { useState } from "react";
import { ScanReceiptModal } from "./ScanReceiptModal";
import { Button } from "@/ui/components";
import { AddItemModal } from "./AddItemModal";

interface Props {
  userId: string;
}

export function AddItemsSection({ userId }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  return (
    <>
      <div className="flex gap-4 flex-row">
        <Button variant="primary" onClick={() => setIsScanModalOpen(true)}>
          Scan Receipt
        </Button>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="w-full"
        >
          Add Item Manually
        </Button>
      </div>

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={userId}
        onSuccess={() => {
          // Refresh the page to show updated stats
          window.location.reload();
        }}
      />

      <ScanReceiptModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
      />
    </>
  );
}
