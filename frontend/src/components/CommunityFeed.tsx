"use client";

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import toast from "react-hot-toast";
import { CommunityProblemCard } from "@/components/CommunityProblemCard";
import { api } from "@/lib/api";
import type { ProblemListItem } from "@/lib/types";

interface CommunityFeedProps {
  category?: string;
  searchQuery?: string;
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 shadow-sm">
      <div className="flex gap-3">
        <div className="h-12 w-12 animate-pulse rounded-full bg-[rgb(var(--muted))]" />
        <div className="flex-1">
          <div className="h-4 w-24 animate-pulse rounded bg-[rgb(var(--muted))]" />
          <div className="mt-2 h-3 w-32 animate-pulse rounded bg-[rgb(var(--muted))]" />
        </div>
      </div>
      <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-[rgb(var(--muted))]" />
      <div className="mt-2 h-3 w-full animate-pulse rounded bg-[rgb(var(--muted))]" />
      <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-[rgb(var(--muted))]" />
      <div className="mt-4 flex gap-4">
        <div className="h-8 w-16 animate-pulse rounded bg-[rgb(var(--muted))]" />
        <div className="h-8 w-16 animate-pulse rounded bg-[rgb(var(--muted))]" />
        <div className="h-8 w-16 animate-pulse rounded bg-[rgb(var(--muted))]" />
      </div>
    </div>
  );
}

export function CommunityFeed({ category, searchQuery }: CommunityFeedProps) {
  const [items, setItems] = useState<ProblemListItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, [category, searchQuery]);

  useEffect(() => {
    if (page === 1) {
      setLoading(true);
    }

    const params = new URLSearchParams({
      page: page.toString(),
      limit: "10",
      sort: "trending",
      ...(category && { category }),
      ...(searchQuery && { q: searchQuery }),
    });

    api
      .get<{ items: ProblemListItem[]; total: number; page: number; limit: number }>(
        `/api/problems?${params.toString()}`,
      )
      .then((d) => {
        if (page === 1) {
          setItems(d.items);
        } else {
          setItems((prev) => [...prev, ...d.items]);
        }
        setHasMore(d.page * d.limit < d.total);
      })
      .catch((e) => {
        toast.error(e.message);
        if (page === 1) setItems([]);
      })
      .finally(() => setLoading(false));
  }, [page, category, searchQuery]);

  const fetchMore = () => {
    setPage((p) => p + 1);
  };

  if (loading && items.length === 0) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--card))] p-12 text-center">
        <div className="text-base font-semibold">No problems found</div>
        <p className="mt-2 text-sm text-[rgb(var(--muted-foreground))]">
          Be the first to share a problem in this category or try a different search.
        </p>
      </div>
    );
  }

  return (
    <InfiniteScroll
      dataLength={items.length}
      next={fetchMore}
      hasMore={hasMore}
      loader={<SkeletonCard />}
      className="space-y-4"
    >
      {items.map((item) => (
        <CommunityProblemCard key={item.id} problem={item} />
      ))}
    </InfiniteScroll>
  );
}
