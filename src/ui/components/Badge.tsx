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
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        {
          "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100":
            variant === "default",
          "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200":
            variant === "destructive",
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200":
            variant === "secondary",
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200":
            variant === "warning",
          "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300":
            variant === "outline",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
