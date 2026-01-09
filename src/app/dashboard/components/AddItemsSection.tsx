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
