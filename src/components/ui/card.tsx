import * as React from "react";
import { cn } from "../../lib/cn";

interface CardProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  title?: React.ReactNode;
}

export function Card({ className, children, title, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-lg shadow-sm",
        className,
      )}
      {...props}
    >
      {title ? (
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-medium text-foreground">{title}</h3>
        </div>
      ) : null}
      <div className="p-4">{children}</div>
    </div>
  );
}

export default Card;
