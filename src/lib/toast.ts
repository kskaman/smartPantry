type ToastType = "success" | "error" | "warning" | "info" | "default";

interface ToastOptions {
  type?: ToastType;
  duration?: number;
  id?: string;
}

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

// Event-based toast system
const TOAST_EVENT = "eden-toast";
const DISMISS_EVENT = "eden-toast-dismiss";

// Helper to generate unique IDs
function generateId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Show a toast notification
 */
function show(message: string, options: ToastOptions = {}): string {
  const id = options.id || generateId();
  const toast: Toast = {
    id,
    message,
    type: options.type || "default",
    duration: options.duration || 3000,
  };

  // Dispatch custom event
  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, {
      detail: toast,
    })
  );

  return id;
}

/**
 * Dismiss a specific toast by ID
 */
function dismiss(id: string): void {
  window.dispatchEvent(
    new CustomEvent(DISMISS_EVENT, {
      detail: { id },
    })
  );
}

/**
 * Show a success toast
 */
function success(message: string, duration?: number): string {
  return show(message, { type: "success", duration });
}

/**
 * Show an error toast
 */
function error(message: string, duration?: number): string {
  return show(message, { type: "error", duration });
}

/**
 * Show a warning toast
 */
function warning(message: string, duration?: number): string {
  return show(message, { type: "warning", duration });
}

/**
 * Show an info toast
 */
function info(message: string, duration?: number): string {
  return show(message, { type: "info", duration });
}

export const toast = {
  show,
  success,
  error,
  warning,
  info,
  dismiss,
};

export { TOAST_EVENT, DISMISS_EVENT };
export type { Toast, ToastType };
