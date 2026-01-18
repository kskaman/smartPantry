"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  X,
} from "lucide-react";
import { TOAST_EVENT, DISMISS_EVENT, Toast as ToastType } from "@/lib/toast";

interface ToastItemProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  const icons = {
    success: <CheckCircle className="h-5 w-5" style={{ color: "var(--toast-success-icon)" }} />,
    error: <XCircle className="h-5 w-5" style={{ color: "var(--toast-error-icon)" }} />,
    warning: <AlertCircle className="h-5 w-5" style={{ color: "var(--toast-warning-icon)" }} />,
    info: <Info className="h-5 w-5" style={{ color: "var(--toast-info-icon)" }} />,
    default: <Info className="h-5 w-5" style={{ color: "var(--text-secondary)" }} />,
  };

  const variantStyles = {
    success: {
      backgroundColor: "var(--toast-success-bg)",
      borderColor: "var(--toast-success-border)",
      color: "var(--toast-success-text)",
    },
    error: {
      backgroundColor: "var(--toast-error-bg)",
      borderColor: "var(--toast-error-border)",
      color: "var(--toast-error-text)",
    },
    warning: {
      backgroundColor: "var(--toast-warning-bg)",
      borderColor: "var(--toast-warning-border)",
      color: "var(--toast-warning-text)",
    },
    info: {
      backgroundColor: "var(--toast-info-bg)",
      borderColor: "var(--toast-info-border)",
      color: "var(--toast-info-text)",
    },
    default: {
      backgroundColor: "var(--toast-bg)",
      borderColor: "var(--toast-border)",
      color: "var(--toast-text)",
    },
  };

  const style = variantStyles[toast.type];

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-[8px] border shadow-md min-w-[280px] max-w-[420px] transition-all duration-300 ${
        isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
      }`}
      style={{
        ...style,
        boxShadow: "0 4px 12px var(--toast-shadow)",
      }}
    >
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => onDismiss(toast.id), 300);
        }}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const customEvent = event as CustomEvent<ToastType>;
      setToasts((prev) => [...prev, customEvent.detail]);
    };

    const handleDismiss = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: string }>;
      setToasts((prev) => prev.filter((t) => t.id !== customEvent.detail.id));
    };

    window.addEventListener(TOAST_EVENT, handleToast);
    window.addEventListener(DISMISS_EVENT, handleDismiss);

    return () => {
      window.removeEventListener(TOAST_EVENT, handleToast);
      window.removeEventListener(DISMISS_EVENT, handleDismiss);
    };
  }, []);

  const handleDismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
      style={{ maxHeight: "calc(100vh - 2rem)" }}
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onDismiss={handleDismiss} />
        </div>
      ))}
    </div>
  );
}
