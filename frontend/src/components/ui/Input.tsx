"use client";

import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 text-sm outline-none transition focus:ring-2 focus:ring-[rgb(var(--ring))] placeholder:text-[rgb(var(--muted-foreground))]",
        className,
      )}
      {...props}
    />
  );
}

