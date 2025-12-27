import { Item } from "@/types/database";

export interface ExpiryStatus {
  label: string;
  variant: "default" | "destructive" | "secondary" | "outline";
  daysRemaining: number;
  isExpired: boolean;
}

/**
 * Get the expiry status of an item
 */
export function getExpiryStatus(
  expiryDate: string | null
): ExpiryStatus | null {
  if (!expiryDate) return null;

  const expiry = new Date(expiryDate);
  const now = new Date();

  // Reset time to midnight for accurate day comparison
  expiry.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: `Expired ${Math.abs(diffDays)} day${
        Math.abs(diffDays) !== 1 ? "s" : ""
      } ago`,
      variant: "destructive",
      daysRemaining: diffDays,
      isExpired: true,
    };
  } else if (diffDays === 0) {
    return {
      label: "Expires today",
      variant: "destructive",
      daysRemaining: diffDays,
      isExpired: false,
    };
  } else if (diffDays <= 2) {
    return {
      label: `Expires in ${diffDays} day${diffDays !== 1 ? "s" : ""}`,
      variant: "destructive",
      daysRemaining: diffDays,
      isExpired: false,
    };
  } else if (diffDays <= 7) {
    return {
      label: `Expires in ${diffDays} days`,
      variant: "secondary",
      daysRemaining: diffDays,
      isExpired: false,
    };
  } else {
    return {
      label: `Expires in ${diffDays} days`,
      variant: "outline",
      daysRemaining: diffDays,
      isExpired: false,
    };
  }
}

/**
 * Check if an item is expired
 */
export function isItemExpired(item: Item): boolean {
  const status = getExpiryStatus(item.expiry_date);
  return status?.isExpired ?? false;
}

/**
 * Filter expired items from a list
 */
export function getExpiredItems(items: Item[]): Item[] {
  return items.filter((item) => isItemExpired(item));
}

/**
 * Filter items expiring soon (within 2 days)
 */
export function getExpiringSoonItems(items: Item[]): Item[] {
  return items.filter((item) => {
    const status = getExpiryStatus(item.expiry_date);
    return status && !status.isExpired && status.daysRemaining <= 2;
  });
}

/**
 * Get counts of expired and expiring soon items
 */
export function getExpiryStats(items: Item[]): {
  expired: number;
  expiringSoon: number;
  total: number;
} {
  const expired = getExpiredItems(items).length;
  const expiringSoon = getExpiringSoonItems(items).length;

  return {
    expired,
    expiringSoon,
    total: expired + expiringSoon,
  };
}
