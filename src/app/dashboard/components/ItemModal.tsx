"use client";

import { useEffect, useState } from "react";
import { Item, ItemInsert } from "@/types/database";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Button, Select } from "@/ui/components";

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: Item | null; // when present -> edit mode
  onSuccess?: () => void;
}

export default function ItemModal({
  isOpen,
  onClose,
  item,
  onSuccess,
}: ItemModalProps) {
  const isEdit = !!item;

  const [formData, setFormData] = useState<ItemInsert>({
    name: "",
    quantity: 1,
    unit: null,
    expiry_date: null,
    notes: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        expiry_date: item.expiry_date || null,
        notes: item.notes || null,
      });
    } else {
      setFormData({
        name: "",
        quantity: 1,
        unit: null,
        expiry_date: null,
        notes: null,
      });
    }
  }, [item, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value === "" ? null : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.name) {
      const msg = "Name is required";
      setError(msg);
      toast.error(msg);
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEdit && item) {
        const body: ItemInsert = formData as ItemInsert;
        const response = await fetch(`/api/items/${item.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!response.ok)
          throw new Error(
            (await response.json()).error || "Failed to update item"
          );
        toast.success("Item updated successfully");
      } else {
        const body: ItemInsert = formData as ItemInsert;
        const response = await fetch(`/api/items`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!response.ok)
          throw new Error(
            (await response.json()).error || "Failed to add item"
          );
        toast.success("Item added successfully");
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save item";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Item" : "Add Item"}</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name *</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity || ""}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={formData.unit || ""}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, unit: val || null }))
                }
                options={[
                  { value: "pieces", label: "pieces" },
                  { value: "pcs", label: "pcs" },
                  { value: "g", label: "g" },
                  { value: "kg", label: "kg" },
                  { value: "mg", label: "mg" },
                  { value: "ml", label: "ml" },
                  { value: "l", label: "l" },
                  { value: "oz", label: "oz" },
                  { value: "lb", label: "lb" },
                  { value: "cup", label: "cup" },
                  { value: "tbsp", label: "tbsp" },
                  { value: "tsp", label: "tsp" },
                ]}
                placeholder="Select unit"
                placeholderOption={{ value: "", label: "(none)" }}
                placeholderSelectable={true}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiry_date">Expiry Date</Label>
            <Input
              type="date"
              id="expiry_date"
              name="expiry_date"
              value={formData.expiry_date || ""}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes || ""}
              onChange={handleChange}
              rows={3}
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting
                ? isEdit
                  ? "Updating..."
                  : "Adding..."
                : isEdit
                ? "Update Item"
                : "Add Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
