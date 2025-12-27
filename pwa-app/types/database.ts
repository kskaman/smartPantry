export type Location = "fridge" | "pantry" | "freezer" | "other";

export interface Item {
  id: string;
  user_id: string;
  name: string;
  quantity: number;
  unit: string | null;
  location: Location;
  expiry_date: string | null;
  purchase_date: string | null;
  category: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ItemInsert {
  user_id: string;
  name: string;
  quantity?: number;
  unit?: string | null;
  location: Location;
  expiry_date?: string | null;
  purchase_date?: string | null;
  category?: string | null;
  notes?: string | null;
}

export interface ItemUpdate {
  name?: string;
  quantity?: number;
  unit?: string | null;
  location?: Location;
  expiry_date?: string | null;
  purchase_date?: string | null;
  category?: string | null;
  notes?: string | null;
}

