import React from "react";

interface LoadingSkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: "sm" | "md" | "lg" | "full";
  className?: string;
}

const roundedClass = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width = "100%",
  height = 24,
  rounded = "md",
  className = "",
}) => (
  <div
    className={`skeleton bg-gray-200 animate-pulse ${roundedClass[rounded]} ${className}`}
    style={{ width, height }}
    aria-busy="true"
    aria-label="Loading…"
  />
);

export default LoadingSkeleton;
