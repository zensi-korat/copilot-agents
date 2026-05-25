import React from "react";
import { FieldLabel } from "./FieldLabel";

interface SelectProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}

/**
 * Select - Reusable select component with label
 */
export function Select({ label, value, onChange, options }: SelectProps) {
  return (
    <div>
      {label && <FieldLabel>{label}</FieldLabel>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
