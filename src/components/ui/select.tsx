import * as React from "react";
import { cn } from "../../lib/cn";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: React.ReactNode;
}

export function Select({ label, className, children, ...props }: SelectProps) {
  return (
    <div>
      {label ? (
        <label className="block text-sm font-medium text-foreground mb-1">
          {label}
        </label>
      ) : null}
      <select
        {...props}
        className={cn(
          "w-full px-3 py-2 bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring",
          className,
        )}
      >
        {children}
      </select>
    </div>
  );
}

export default Select;
