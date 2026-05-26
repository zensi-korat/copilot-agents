import React from "react";

/**
 * FieldLabel - Reusable label for form fields
 */
export function FieldLabel({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-foreground mb-1">
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  );
}
