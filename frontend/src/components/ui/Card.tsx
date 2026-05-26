import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

