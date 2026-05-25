import React from "react";
import { FieldLabel } from "./FieldLabel";

/**
 * TextArea - Reusable textarea component with label and error display
 */
export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: string;
  },
) {
  const { label, error, ...rest } = props;
  return (
    <div>
      {label && <FieldLabel>{label}</FieldLabel>}
      <textarea
        {...rest}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white ${
          error ? "border-red-300" : "border-gray-200"
        }`}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
