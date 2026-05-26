"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/cn";

export function CategoryTabs({
  active,
  onChange,
}: {
  active?: string;
  onChange: (slug?: string) => void;
}) {
  const [cats, setCats] = useState<Category[]>([]);

  useEffect(() => {
    api
      .get<{ categories: Category[] }>("/api/categories")
      .then((d) => setCats(d.categories))
      .catch(() => setCats([]));
  }, []);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        className={cn(
          "rounded-full border border-[rgb(var(--border))] px-3 py-1.5 text-sm hover:bg-[rgba(255,0,255,0.2)]",
          !active && "bg-[rgb()]",
        )}
        onClick={() => onChange(undefined)}
      >
        All
      </button>
      {cats.map((c) => (
        <button
          key={c.id}
          className={cn(
            "rounded-full border border-[rgb(var(--border))] px-3 py-1.5 text-sm hover:bg-[rgb(255,0,255,0.2)]",
            active === c.slug && "bg-[rgb(var(0,0,0))]",
          )}
          onClick={() => onChange(c.slug)}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}

