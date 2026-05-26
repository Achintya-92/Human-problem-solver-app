"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { CommunityFeed } from "@/components/CommunityFeed";
import { SearchBar } from "@/components/SearchBar";
import { Sidebar } from "@/components/Sidebar";
import { AIRecommendationPanel } from "@/components/AIRecommendationPanel";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface CategoryPageProps {
  categoryName: string;
  categorySlug: string;
  categoryDescription: string;
}

export function CategoryPage({ categoryName, categorySlug, categoryDescription }: CategoryPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-4">
        {/* Category Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{categoryName}</h1>
            <p className="mt-2 text-base text-[rgb(var(--muted-foreground))]">{categoryDescription}</p>
          </div>

          {/* CTA Button */}
          <Button className="w-full bg-[rgb(var(--primary))] text-white hover:opacity-90 sm:w-auto">
            + Share your experience
          </Button>
        </div>

        {/* Search Bar */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder={`Search in ${categoryName}...`} />

        {/* Community Feed */}
        <CommunityFeed category={categorySlug} searchQuery={searchQuery} />
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <AIRecommendationPanel category={categorySlug} q={searchQuery} />

        {/* Category Stats Card */}
        <Card className="p-4">
          <h3 className="font-semibold">Category Info</h3>
          <div className="mt-3 space-y-2 text-sm text-[rgb(var(--muted-foreground))]">
            <div className="flex justify-between">
              <span>Active members</span>
              <span className="font-medium">1.2K</span>
            </div>
            <div className="flex justify-between">
              <span>Problems shared</span>
              <span className="font-medium">342</span>
            </div>
            <div className="flex justify-between">
              <span>Solutions provided</span>
              <span className="font-medium">1.8K</span>
            </div>
          </div>
        </Card>

        {/* Tips Card */}
        <Card className="border-[rgb(var(--accent))]/30 bg-[rgb(var(--accent))]/5 p-4">
          <div className="flex gap-2">
            <Sparkles className="h-5 w-5 flex-shrink-0 text-[rgb(var(--accent))]" />
            <div>
              <h3 className="font-semibold">Pro Tips</h3>
              <p className="mt-1 text-xs text-[rgb(var(--muted-foreground))]">
                Search for similar problems before posting. You might find the solution you're looking for from someone with
                relevant experience.
              </p>
            </div>
          </div>
        </Card>

        <Sidebar />
      </div>
    </div>
  );
}
