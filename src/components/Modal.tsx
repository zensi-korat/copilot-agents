import React, { useEffect, useRef } from "react";
import { X, UserPlus } from "lucide-react";
import { Button, Card } from "./ui";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Modal - Reusable modal wrapper with overlay and backdrop
 */
export function Modal({ isOpen, title, onClose, children }: ModalProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 sm:p-6">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
      />
      <Card
        ref={ref as any}
        className="relative w-full max-w-4xl rounded-xl shadow-lg z-10 overflow-auto max-h-screen"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <UserPlus size={20} />
            <h3 className="text-lg font-semibold">{title ?? "Add User"}</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="!p-2">
            <X size={18} />
          </Button>
        </div>
        <div className="p-6">{children}</div>
      </Card>
    </div>
  );
}
