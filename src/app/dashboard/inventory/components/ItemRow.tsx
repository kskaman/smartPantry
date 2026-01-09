import { getExpiryStatus } from "@/lib/expiry-utils";
import { Item } from "@/types";
import { Button, Badge } from "@/ui/components";
import { Edit, Trash2 } from "lucide-react";

interface ItemRowProps {
  item: Item;
  isDeleting: string | null;
  handleDelete: (id: string) => void;
  onEdit?: (item: Item) => void;
}

export default function ItemRow({
  item,
  isDeleting,
  handleDelete,
  onEdit,
}: ItemRowProps) {
  const expiryStatus = getExpiryStatus(item.expiry_date);

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">{item.name}</h3>
            {expiryStatus && (
              <Badge variant={expiryStatus.variant}>{expiryStatus.label}</Badge>
            )}
          </div>
          <div className="flex flex-row gap-4 text-sm text-gray-600">
            <span>
              Quantity:{" "}
              <span className="space-x-[3px]">
                <strong className="text-gray-900">{item.quantity}</strong>
                {item.unit && <strong className="text-gray-900">{item.unit}</strong>}
              </span>
            </span>
            {item.expiry_date && (
              <span className="font-medium">
                Expires:{" "}
                <strong className="text-gray-900">
                  {new Date(item.expiry_date).toLocaleDateString()}
                </strong>
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex gap-1 justify-end">
          {onEdit && (
            <Button
              variant="icon"
              onClick={() => onEdit(item)}
              icon={<Edit className="h-5 w-5" />}
            />
          )}
          <Button
            variant="icon"
            onClick={() => handleDelete(item.id)}
            disabled={isDeleting === item.id}
            icon={<Trash2 className="h-5 w-5 text-red-500" />}
          />
        </div>
      </td>
    </tr>
  );
}
