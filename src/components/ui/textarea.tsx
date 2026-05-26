import * as React from "react";
import { cn } from "../../lib/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  error?: string;
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <div>
      {label ? (
        <label className="block text-sm font-medium text-foreground mb-1">
          {label}
        </label>
      ) : null}
      <textarea
        {...props}
        className={cn(
          "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-surface",
          error ? "border-destructive" : "border-border",
          className,
        )}
      />
      {error ? <p className="text-xs text-destructive mt-1">{error}</p> : null}
    </div>
  );
}

export default Textarea;
