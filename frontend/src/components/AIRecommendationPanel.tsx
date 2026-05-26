"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { Card } from "./ui/Card";

export function AIRecommendationPanel({ category, q }: { category?: string; q?: string }) {
  const [note, setNote] = useState<string>("Loading…");

  useEffect(() => {
    api
      .get<{ note: string }>(`/api/ai/recommendations?category=${encodeURIComponent(category ?? "")}&q=${encodeURIComponent(q ?? "")}`)
      .then((d) => setNote(d.note))
      .catch(() => setNote("AI placeholder currently unavailable."));
  }, [category, q]);

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Sparkles className="h-4 w-4 text-[rgb(var(--primary))]" />
        AI recommended experiences
      </div>
      <div className="mt-2 text-sm text-[rgb(var(--muted-foreground))]">{note}</div>
      <div className="mt-3 rounded-xl bg-[rgb(var(--muted))] p-3 text-xs text-[rgb(var(--muted-foreground))]">
        AI never replaces humans here — it only organizes, matches, and summarizes real experiences.
      </div>
    </Card>
  );
}

