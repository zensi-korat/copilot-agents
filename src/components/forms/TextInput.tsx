import React from "react";
import { Input } from "../ui";

/**
 * TextInput - Reusable text input component with label and error display (wrapped UI input)
 */
export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
  },
) {
  const { label, error, ...rest } = props;
  return <Input {...(rest as any)} label={label} error={error} />;
}
