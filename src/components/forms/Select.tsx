import React from "react";
import { Select as UISelect } from "../ui";

interface SelectProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}

/**
 * Select - Reusable select component with label (wrapped UI select)
 */
export function Select({ label, value, onChange, options }: SelectProps) {
  return (
    <UISelect
      label={label}
      value={value}
      onChange={(e: any) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </UISelect>
  );
}
