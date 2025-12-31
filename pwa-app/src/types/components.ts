import type { ReactNode } from "react";
import type { ButtonVariant } from "../constants";
import type React from "react";

// Base component props that many components share
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  id?: string;
}

// Interactive component props
export interface InteractiveProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

// Button component props
export interface ButtonProps extends BaseComponentProps, InteractiveProps {
  variant?: ButtonVariant;
  icon?: ReactNode;
  /** only used for text‑only or icon‑only variants */
  color?: string;
  /** only used for "regular" variants */
  width?: string;
  height?: string;
}

// Input component base props
export interface BaseInputProps extends BaseComponentProps {
  name?: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

// Text input props
export interface TextInputProps extends BaseInputProps {
  type?: "text" | "password" | "email" | "number";
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  subLabel?: string | ReactNode;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  error?: { message?: string };
  infoText?: string;
  helpText?: string;
  maxLength?: number;
  onFocus?: () => void;
}

// Password input props
export interface PasswordInputProps extends Omit<TextInputProps, "type"> {
  showPasswordToggle?: boolean;
}

// Modal component props
export interface BaseModalProps extends BaseComponentProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  icon?: ReactNode;
}

// Confirm modal props
export interface ConfirmModalProps extends BaseModalProps {
  onCancel?: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
}

// Create modal props
export interface CreateModalProps extends BaseModalProps {
  type: "note" | "collection";
  collectionId?: string | null;
  onClose: () => void;
}

// Layout component props
export interface LayoutProps extends BaseComponentProps {
  heading?: string;
  subheading?: string;
}

// Navigation component props
export interface NavigationProps extends BaseComponentProps {
  expanded?: boolean;
  setExpanded?: (expanded: boolean) => void;
}

// Card component props
export interface BaseCardProps extends BaseComponentProps, InteractiveProps {
  title?: string;
  description?: string;
  image?: string;
  selected?: boolean;
}

// Theme option props
export interface ThemeOptionProps extends BaseComponentProps {
  title: string;
  description: string;
  icon: ReactNode;
  value: string;
  name: string;
  checked: boolean;
  onChange: (value: string) => void;
}

// Divider props
export interface DividerProps extends BaseComponentProps {
  orientation?: "horizontal" | "vertical";
  variant?: "solid" | "dashed" | "dotted";
}

// Options menu props
export interface OptionsMenuProps extends BaseComponentProps {
  options: Array<{
    id: string;
    label: string;
    onClick: () => void;
    icon?: ReactNode;
    danger?: boolean;
  }>;
  trigger?: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

// loading components
export interface LoadingSpinnerProps extends BaseComponentProps {
  size?: "small" | "medium" | "large";
  variant?: "dots" | "spinner" | "pulse";
  message?: string;
}

export interface LoadingOverlayProps extends BaseComponentProps {
  isVisible: boolean;
  message?: string;
  spinner?: boolean;
  backdrop?: boolean;
}
