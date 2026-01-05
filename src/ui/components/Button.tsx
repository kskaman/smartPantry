import type { CSSProperties } from "react";
import { memo, useMemo } from "react";
import clsx from "clsx";
import { LoadingSpinner } from "../feedback";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "warning"
  | "text"
  | "icon";

export interface ButtonProps {
  type?: "button" | "submit" | "reset";
  className?: string;
  children?: React.ReactNode;
  id?: string;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  /** only used for text-only or icon-only variants */
  color?: string;
  /** only used for "regular" variants */
  width?: string;
  maxWidth?: string;
  height?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const Button = memo(
  ({
    type = "button",
    variant = "primary",
    children,
    icon,
    color,
    width = "100%",
    height = "44px",
    maxWidth = "250px",
    onClick,
    disabled = false,
    loading = false,
  }: ButtonProps) => {
    const variantInfo = useMemo(() => {
      const isTextOnly = variant === "text";
      const isIconOnly = variant === "icon";
      const isRegular = !isTextOnly && !isIconOnly;
      return { isTextOnly, isIconOnly, isRegular };
    }, [variant]);

    const { isTextOnly, isIconOnly, isRegular } = variantInfo;

    const style: CSSProperties = {};
    if (isTextOnly || isIconOnly) {
      if (color) style.color = color;
      style.width = "auto";
      style.height = "auto";
    } else {
      style.width = width;
      style.height = height;
      style.maxWidth = maxWidth;
    }

    return (
      <button
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        style={style}
        className={clsx(
          "btn",
          isRegular && "btn--regular btn--interactive",
          `btn-${variant}`,
          (disabled || loading) && "btn--disabled"
        )}
      >
        {loading ? (
          <LoadingSpinner size="small" variant="spinner" />
        ) : (
          <>
            {isIconOnly && icon}
            {isTextOnly && (
              <span className="text-base text-nowrap">{children}</span>
            )}
            {isRegular && (
              <>
                {icon && <span>{icon}</span>}
                <span className="text-preset-4 text-nowrap">{children}</span>
              </>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
