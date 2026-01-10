import { CustomModal } from "./CustomModal";
import Button from "./Button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  confirmVariant?: "primary" | "secondary" | "outline" | "warning";
  cancelLabel?: string;
  disabled?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  confirmVariant = "warning",
  cancelLabel = "Cancel",
  disabled = false,
}: ConfirmModalProps) {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="space-y-6">
        <p className="text-body text-(--text-secondary)">{description}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={disabled}>
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={disabled}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}
