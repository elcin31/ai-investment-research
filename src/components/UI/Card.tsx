import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("px-4 pt-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: CardProps) {
  return (
    <h3
      className={cn(
        "text-sm font-medium text-textSecondary tracking-wide",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardContent({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("px-4 pb-4", className)} {...props}>
      {children}
    </div>
  );
}
