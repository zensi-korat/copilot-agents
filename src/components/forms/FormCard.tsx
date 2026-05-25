import React from "react";

interface FormCardProps {
  children: React.ReactNode;
}

/**
 * FormCard - Simple card wrapper for form sections
 */
export function FormCard({ children }: FormCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
      {children}
    </div>
  );
}
