import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:opacity-90",
        secondary: "bg-subtle text-foreground hover:bg-border",
        ghost: "bg-transparent hover:bg-subtle text-foreground",
        destructive: "bg-destructive text-primary-foreground hover:opacity-90",
        outline:
          "border border-border bg-surface text-foreground hover:bg-subtle",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        default: "h-10 px-4",
        lg: "h-11 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  // fallback explicit props to aid type inference in consumers
  variant?: "default" | "secondary" | "ghost" | "destructive" | "outline";
  size?: "sm" | "default" | "lg";
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: any) {
  const Comp: any = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };

export default Button;
