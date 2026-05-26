import Link from "next/link";
import { MessageSquare, ThumbsUp } from "lucide-react";
import type { ProblemListItem } from "@/lib/types";
import { Card } from "./ui/Card";
import { TrustBadge } from "./TrustBadge";

export function ProblemCard({ item }: { item: ProblemListItem }) {
  const author = item.anonymous ? "Anonymous" : item.user.name;
  const trust = item.anonymous ? null : item.user.trustScore?.score ?? 0;

  return (
    <Card className="p-4 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link href={`/problems/${item.id}`} className="block">
            <h3 className="truncate text-base font-semibold">{item.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-[rgb(var(--muted-foreground))]">{item.description}</p>
          </Link>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[rgb(var(--muted-foreground))]">
            <span className="rounded-full bg-[rgb(var(--muted))] px-2 py-1">{item.category.name}</span>
            {item.emotionTag ? <span className="rounded-full bg-[rgb(var(--muted))] px-2 py-1">{item.emotionTag}</span> : null}
            <span>•</span>
            <span>{author}</span>
          </div>
        </div>
        <TrustBadge score={trust} />
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-[rgb(var(--muted-foreground))]">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            {item._count.solutions} solutions
          </span>
          <span className="inline-flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            {item._count.votes} votes
          </span>
        </div>
        <Link href={`/problems/${item.id}`} className="font-medium text-[rgb(var(--primary))] hover:underline">
          View
        </Link>
      </div>
    </Card>
  );
}

