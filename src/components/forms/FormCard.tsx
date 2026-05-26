import React from "react";
import { Card } from "../ui";

interface FormCardProps {
  children: React.ReactNode;
}

/**
 * FormCard - Simple card wrapper for form sections (uses UI Card)
 */
export function FormCard({ children }: FormCardProps) {
  return <Card>{children}</Card>;
}
