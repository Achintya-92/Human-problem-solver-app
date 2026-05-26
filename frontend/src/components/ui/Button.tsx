"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md";
};

export function Button({ className, variant = "primary", size = "md", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] disabled:opacity-50 disabled:pointer-events-none";
  const sizes = size === "sm" ? "h-9 px-3 text-sm" : "h-10 px-4 text-sm";
  const variants =
    variant === "primary"
      ? "bg-[rgb(var(--primary))] text-white hover:opacity-90"
      : variant === "outline"
        ? "border border-[rgb(var(--border))] bg-transparent hover:bg-[rgb(var(--muted))]"
        : "bg-transparent hover:bg-[rgb(var(--muted))]";
  return <button className={cn(base, sizes, variants, className)} {...props} />;
}

