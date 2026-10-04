import * as React from "react";
import { cn } from "../../utils/cn";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-10 w-full rounded-[10px] border border-border-color bg-bg-surface px-3 py-2 text-sm placeholder:text-text-secondary focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm hover:border-border-highlight appearance-none",
          error && "border-danger focus:ring-danger/10 focus:border-danger",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";
