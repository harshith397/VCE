import * as React from "react";

type SpinnerSize = "sm" | "md" | "lg";

export const Spinner: React.FC<{ size?: SpinnerSize; className?: string }> = ({ size = "sm", className = "" }) => {
  const sizeMap: Record<SpinnerSize, string> = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-10 w-10 border-4",
  };

  return (
    <span
      className={`${sizeMap[size]} rounded-full border-t-transparent border-primary animate-spin ${className}`}
      aria-hidden
    />
  );
};

export default Spinner;
