"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { PlusCircle } from "lucide-react";

import { CategoryTabs } from "@/components/CategoryTabs";
import { SearchBar } from "@/components/SearchBar";
import { Sidebar } from "@/components/Sidebar";
import { AIRecommendationPanel } from "@/components/AIRecommendationPanel";
import { CommunityProblemCard } from "@/components/CommunityProblemCard";
import { SubmitProblemModal } from "@/components/SubmitProblemModal";

import { api } from "@/lib/api";
import type { ProblemListItem } from "@/lib/types";

import { Button } from "@/components/ui/Button";

type FeedSort = "latest" | "trending";

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
    </div>
  );
}

export function HomeFeed() {
  const [sort, setSort] = useState<FeedSort>("trending");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const [items, setItems] = useState<ProblemListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const query = useMemo(() => q.trim(), [q]);

  useEffect(() => {
    setLoading(true);

    api
      .get<{
        items: ProblemListItem[];
        total: number;
        page: number;
        limit: number;
      }>(
        `/api/problems?sort=${sort}&page=${page}&limit=10&category=${encodeURIComponent(
          category ?? ""
        )}&q=${encodeURIComponent(query)}`
      )
      .then((d) => {
        setItems(d.items);
        setTotal(d.total);
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [sort, category, page, query]);

  const hasMore = page * 10 < total;

  return (
   <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1e293b,_#020617)]  text-white">
  <SubmitProblemModal
    isOpen={isSubmitModalOpen}
    onClose={() => setIsSubmitModalOpen(false)}
  />

     <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1fr_360px]">
        {/* LEFT SIDE */}
        <div className="space-y-4">
          {/* HEADER */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold">Home Feed</h1>

              <p className="text-sm text-[rgb(var(--muted-foreground))]">
                Practical solutions from real humans. AI helps you find the right experiences.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant={sort === "trending" ? "primary" : "outline"}
                onClick={() => setSort("trending")}
              >
                Trending
              </Button>

              <Button
                variant={sort === "latest" ? "primary" : "outline"}
                onClick={() => setSort("latest")}
              >
                Latest
              </Button>
            </div>
          </div>

          {/* SEARCH + SUBMIT SECTION */}
          <div className="flex gap-3">
            <div className="flex-1">
              <SearchBar
                value={q}
                onChange={(v) => {
                  setPage(1);
                  setQ(v);
                }}
              />
            </div>
            <Button
              variant="primary"
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Post</span>
            </Button>
          </div>

          {/* CATEGORY TABS */}
          <CategoryTabs
            active={category}
            onChange={(slug) => {
              setPage(1);
              setCategory(slug);
            }}
          />

          {/* PROBLEM FEED */}
          <div className="space-y-3">
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : items.length ? (
              items.map((it) => (
                <CommunityProblemCard
                  key={it.id}
                  problem={it}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--card))] p-8 text-center">
                <div className="text-base font-semibold">
                  No problems found
                </div>

                <div className="mt-2 text-sm text-[rgb(var(--muted-foreground))]">
                  Try a different category or search term, or be the first to post.
                </div>

                <Button
                  variant="primary"
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="mt-4"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Share Your Problem
                </Button>
              </div>
            )}

            {/* PAGINATION */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={() =>
                  setPage((p) => Math.max(1, p - 1))
                }
                disabled={page === 1}
              >
                Prev
              </Button>

              <div className="text-sm text-[rgb(var(--muted-foreground))]">
                Page {page} {total ? `• ${total} total` : ""}
              </div>

              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasMore}
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-4">
          <AIRecommendationPanel
            category={category}
            q={query}
          />

          <Sidebar />
        </div>
      </div>
    </div>
  );
}