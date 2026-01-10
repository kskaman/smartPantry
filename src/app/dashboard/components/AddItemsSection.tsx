"use client";

import { useState } from "react";
import { ScanReceiptModal } from "./ScanReceiptModal";
import { Button } from "@/ui/components";
import ItemModal from "./ItemModal";

export function AddItemsSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  return (
    <>
      <div className="flex gap-4 flex-row">
        <Button variant="primary" onClick={() => setIsScanModalOpen(true)}>
          Scan Receipt
        </Button>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Add Item
        </Button>
      </div>

      <ItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        // onSuccess is no longer needed as TanStack Query will automatically refetch
      />

      <ScanReceiptModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
      />
    </>
  );
}
