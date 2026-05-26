"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/cn";

const FEATURED_CATEGORIES = [
  { slug: "career", name: "Career", icon: "💼" },
  { slug: "mental-health", name: "Mental Health", icon: "🧠" },
  { slug: "education", name: "Education", icon: "📚" },
  { slug: "relationships", name: "Relationships", icon: "💕" },
  { slug: "finance", name: "Finance", icon: "💰" },
  { slug: "health", name: "Health", icon: "🏋️" },
];

export function CategoryNavigation() {
  const pathname = usePathname();
  const [cats, setCats] = useState<Category[]>([]);

  useEffect(() => {
    api
      .get<{ categories: Category[] }>("/api/categories")
      .then((d) => setCats(d.categories))
      .catch(() => setCats([]));
  }, []);

  const isActive = (slug: string) => pathname === `/categories/${slug}`;

  // Merge featured and API categories
  const allCategories = FEATURED_CATEGORIES.map((featured) => ({
    id: featured.slug,
    slug: featured.slug,
    name: featured.name,
    icon: featured.icon,
  }));

  return (
    <nav className="overflow-x-auto border-b border-[rgb(var(--border))]">
      <div className="flex gap-1 px-4 py-3 sm:gap-2">
        <Link
          href="/"
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-full border border-[rgb(var(--border))] px-4 py-2 text-sm font-medium transition hover:bg-[rgb(var(--muted))]",
            pathname === "/" && "bg-[rgb(var(--primary))] text-white",
          )}
        >
          🏠 All
        </Link>

        {allCategories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border border-[rgb(var(--border))] px-4 py-2 text-sm font-medium transition hover:bg-[rgb(var(--muted))]",
              isActive(cat.slug) && "bg-[rgb(var(--primary))] text-white",
            )}
          >
            {cat.icon} <span className="hidden sm:inline">{cat.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
