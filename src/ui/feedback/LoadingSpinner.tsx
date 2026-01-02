import type { BaseComponentProps } from "../../types";

export interface LoadingSpinnerProps extends BaseComponentProps {
  size?: "small" | "medium" | "large";
  variant?: "dots" | "spinner" | "pulse";
  message?: string;
}

const LoadingSpinner = ({
  size = "medium",
  variant = "dots",
  message,
  className = "",
  ...props
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: "w-1.5 h-1.5",
    medium: "w-2.5 h-2.5",
    large: "w-4 h-4",
  };

  const containerClasses = {
    small: "gap-2",
    medium: "gap-4",
    large: "gap-6",
  };

  if (variant === "spinner") {
    const spinnerSizes = {
      small: "w-4 h-4",
      medium: "w-8 h-8",
      large: "w-12 h-12",
    };

    return (
      <div
        className={`flex flex-col items-center justify-center ${containerClasses[size]} ${className}`}
        {...props}
      >
        <div
          className={`${spinnerSizes[size]} border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin`}
          role="status"
          aria-label="Loading"
        />
        {message && (
          <p className="text-sm text-(--subheading-text-1) animate-pulse">
            {message}
          </p>
        )}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div
        className={`flex flex-col items-center justify-center ${containerClasses[size]} ${className}`}
        {...props}
      >
        <div
          className={`${sizeClasses[size]} rounded-full bg-(--secondary-main) animate-pulse`}
        />
        {message && (
          <p className="text-sm text-(--subheading-text-1) animate-pulse">
            {message}
          </p>
        )}
      </div>
    );
  }

  // Default dots variant
  return (
    <div
      className={`flex flex-col items-center justify-center ${containerClasses[size]} ${className}`}
      {...props}
    >
      <div className={`flex items-center ${containerClasses[size]}`}>
        <div
          className={`${sizeClasses[size]} rounded-full bg-(--secondary-main) animate-pulse delay-0`}
        ></div>
        <div
          className={`${sizeClasses[size]} rounded-full bg-(--secondary-main) animate-pulse delay-150`}
        ></div>
        <div
          className={`${sizeClasses[size]} rounded-full bg-(--secondary-main) animate-pulse delay-300`}
        ></div>
      </div>
      {message && (
        <p className="text-sm text-(--subheading-text-1) animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
