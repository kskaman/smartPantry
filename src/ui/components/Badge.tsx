import clsx from "clsx";

export type BadgeVariant =
  | "default"
  | "destructive"
  | "secondary"
  | "outline"
  | "warning";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "destructive":
        return { backgroundColor: "#fee2e2", color: "var(--text-danger)" };
      case "secondary":
        return { backgroundColor: "#dbeafe", color: "var(--text-info)" };
      case "warning":
        return { backgroundColor: "#fef3c7", color: "var(--text-warning)" };
      case "outline":
        return {
          backgroundColor: "transparent",
          border: "1px solid var(--text-tertiary)",
          color: "var(--text-main)",
        };
      default:
        return { backgroundColor: "#f3f4f6", color: "var(--text-main)" };
    }
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-caption",
        className
      )}
      style={getVariantStyles()}
    >
      {children}
    </span>
  );
}
