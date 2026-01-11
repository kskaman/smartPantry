import { UUID } from "crypto";

export type Location = "fridge" | "pantry" | "freezer" | "other";

// Single Item type used across frontend and API
export interface Item {
  id?: UUID | string;
  name: string;
  quantity: number;
  unit: string | null;
  expiry_date: string | null;
}

export type InventoryStats = {
  total: number;
  fresh: number;
  expired: number;
  expiringSoon: number;
};
