
import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  color?: "default" | "primary" | "green";
}

export const LoadingSpinner = ({
  size = "md",
  color = "default",
  className,
  ...props
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  };
  
  const colorClasses = {
    default: "border-t-foreground",
    primary: "border-t-primary",
    green: "border-t-green-600",
  };
  
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-transparent",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      {...props}
    />
  );
};
