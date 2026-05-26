import React from "react";
import { Textarea } from "../ui";

/**
 * TextArea - Reusable textarea component with label and error display (wrapped UI textarea)
 */
export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: string;
  },
) {
  const { label, error, ...rest } = props;
  return <Textarea {...(rest as any)} label={label} error={error} />;
}
