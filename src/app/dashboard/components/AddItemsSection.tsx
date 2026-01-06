"use client";

import { useState } from "react";
import { ScanReceiptModal } from "./ScanReceiptModal";
import { Button } from "@/ui/components";
import { AddItemModal } from "./AddItemModal";

export function AddItemsSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  return (
    <>
      <div className="flex gap-4 md:gap-8 flex-row">
        <Button variant="primary" onClick={() => setIsScanModalOpen(true)}>
          Scan Receipt
        </Button>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="w-full"
        >
          Add Item
        </Button>
      </div>

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
