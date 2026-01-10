"use client";

import { useEffect, useState } from "react";
import { Item } from "@/types";
import { Button, Select, CustomModal, TextInput } from "@/ui/components";
import { UNIT_OPTIONS } from "@/constants";
import { useItemMutations } from "@/hooks";

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
  const { createItem, updateItem } = useItemMutations();

  // Initialize form data based on item prop
  const getInitialFormData = (): Item => {
    if (item) {
      return {
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        expiry_date: item.expiry_date || null,
      };
    }
    return {
      id: "",
      name: "",
      quantity: 1,
      unit: null,
      expiry_date: null,
    };
  };

  const [formData, setFormData] = useState<Item>(getInitialFormData());
  const [error, setError] = useState<string | null>(null);

  const isSubmitting = createItem.isPending || updateItem.isPending;

  // Reset form when modal opens/closes or item changes
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData());
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, item?.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: Item) => ({ ...prev, [name]: value === "" ? null : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name) {
      setError("Name is required");
      return;
    }

    try {
      if (isEdit && item && item.id) {
        await updateItem.mutateAsync({ id: item.id, item: formData });
      } else {
        await createItem.mutateAsync(formData);
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save item";
      setError(msg);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Item" : "Add Item"}
    >
      {error && (
        <div className="rounded-lg bg-(--warning-color)/10 p-3 text-small text-(--warning-color) mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2">
        <TextInput
          type="text"
          id="name"
          name="name"
          label="Item Name"
          value={formData.name || ""}
          onChange={handleChange}
        />

        <div className="grid grid-cols-2 gap-4">
          <TextInput
            type="number"
            id="quantity"
            name="quantity"
            label="Quantity"
            value={formData.quantity?.toString() || ""}
            onChange={handleChange}
          />

          <div className="space-y-2">
            <label className="text-small text-(--input-field-label-color)">
              Unit
            </label>
            <Select
              value={formData.unit || ""}
              onChange={(val) =>
                setFormData((prev: Item) => ({ ...prev, unit: val || null }))
              }
              options={UNIT_OPTIONS}
              placeholder="Select unit"
              placeholderOption={{ value: "", label: "(none)" }}
              placeholderSelectable={true}
            />
          </div>
        </div>

        <TextInput
          type="date"
          id="expiry_date"
          name="expiry_date"
          label="Expiry Date"
          value={formData.expiry_date || ""}
          onChange={handleChange}
        />

        <div className="flex gap-3 mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
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
    </CustomModal>
  );
}
