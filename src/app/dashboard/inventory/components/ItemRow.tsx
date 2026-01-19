import { getExpiryStatus } from "@/lib/expiry-utils";
import { Item } from "@/types";
import { Button, Badge } from "@/ui/components";
import { Edit, Trash2 } from "lucide-react";

interface ItemRowProps {
  item: Item;
  isDeleting: string | null;
  handleDelete: (id: string) => void;
  onEdit?: (item: Item) => void;
  isLastItem?: boolean;
}

export default function ItemRow({
  item,
  isDeleting,
  handleDelete,
  onEdit,
  isLastItem = false,
}: ItemRowProps) {
  const expiryStatus = getExpiryStatus(item.expiry_date);

  return (
    <tr 
      className={`hover:bg-(--table-row-hover-bg) transition-colors ${
        !isLastItem ? 'border-b border-(--table-border)' : ''
      }`}
    >
      <td className="px-3 py-3 sm:py-2 w-full">
        <div className="flex flex-col gap-2 sm:gap-1">
          {/* Name row */}
          <div className="flex items-center justify-between gap-2 items-center">
            <h3
              className="text-subheading break-words"
              style={{ color: "var(--text-title)" }}
            >
              {item.name}
            </h3>
            <div className="flex gap-1 shrink-0">
              {onEdit && (
                <Button
                  variant="icon"
                  onClick={() => onEdit(item)}
                  icon={<Edit className="h-5 w-5" />}
                />
              )}
              <Button
                variant="icon"
                onClick={() => handleDelete(item.id!)}
                disabled={isDeleting === item.id}
                icon={
                  <Trash2
                    className="h-5 w-5"
                    style={{ color: "var(--text-danger)" }}
                  />
                }
              />
            </div>
          </div>

          {/* Badge row */}
          {expiryStatus && (
            <div className="flex items-center">
              <Badge variant={expiryStatus.variant}>{expiryStatus.label}</Badge>
            </div>
          )}

          {/* Info row: Quantity and Expiry on left, buttons on right */}
          <div
            className="flex items-center justify-between gap-2 w-full
          flex-wrap gap-y-1 text-small"
          >
            <span style={{ color: "var(--text-label)" }}>
              Quantity:{" "}
              <span className="space-x-[3px]">
                <strong style={{ color: "var(--text-value)" }}>
                  {item.quantity}
                </strong>
                {item.unit && (
                  <strong style={{ color: "var(--text-value)" }}>
                    {item.unit}
                  </strong>
                )}
              </span>
            </span>
            {item.expiry_date && (
              <span
                className="text-small"
                style={{ color: "var(--text-label)" }}
              >
                Expires:{" "}
                <strong style={{ color: "var(--text-value)" }}>
                  {new Date(item.expiry_date).toLocaleDateString()}
                </strong>
              </span>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}
