"use client";

import { useState } from "react";
import { ItemInsert } from "@/types/database";
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
import { Button } from "@/ui/components";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddItemModal({
  isOpen,
  onClose,
  onSuccess,
}: AddItemModalProps) {
  const [formData, setFormData] = useState<ItemInsert>({
    name: "",
    quantity: 1,
    unit: null,
    expiry_date: null,
    notes: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add item");
      }

      // Reset form
      setFormData({
        name: "",
        quantity: 1,
        unit: null,
        expiry_date: null,
        notes: null,
      });

      toast.success("Item added successfully");
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add item");
      toast.error(err instanceof Error ? err.message : "Failed to add item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Item</DialogTitle>
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
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="off"
              placeholder="e.g., Milk, Bread, Chicken"
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
                autoComplete="off"
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Input
                type="text"
                id="unit"
                name="unit"
                value={formData.unit || ""}
                autoComplete="off"
                onChange={handleChange}
                placeholder="e.g., lbs, oz, pieces"
                required
              />
            </div>
          </div>

          <div className="">
            <div className="space-y-2">
              <Label htmlFor="expiry_date">Expiry Date *</Label>
              <Input
                type="date"
                id="expiry_date"
                name="expiry_date"
                value={formData.expiry_date || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes || ""}
              onChange={handleChange}
              rows={3}
              autoComplete="off"
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
              {isSubmitting ? "Adding..." : "Add Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
