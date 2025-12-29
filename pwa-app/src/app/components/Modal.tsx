"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface ModalAction {
  label: string;
  onClick: () => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  disabled?: boolean;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string | ReactNode;
  children?: ReactNode;
  actions?: ModalAction[];
  closeButtonLabel?: string;
  showCloseButton?: boolean;
  size?: "default" | "sm" | "lg";
}

const sizeClasses = {
  sm: "max-w-sm",
  default: "max-w-md",
  lg: "max-w-lg",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions = [],
  closeButtonLabel = "Close",
  showCloseButton = true,
  size = "default",
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={sizeClasses[size]}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && typeof description === "string" ? (
            <DialogDescription>{description}</DialogDescription>
          ) : (
            description
          )}
        </DialogHeader>

        {children && <div className="py-4">{children}</div>}

        {(actions.length > 0 || showCloseButton) && (
          <DialogFooter className="flex gap-2 justify-end">
            {showCloseButton && (
              <Button variant="outline" onClick={onClose}>
                {closeButtonLabel}
              </Button>
            )}
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "default"}
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {action.label}
              </Button>
            ))}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
