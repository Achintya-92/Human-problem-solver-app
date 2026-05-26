"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, ThumbsDown, ThumbsUp } from "lucide-react";
import toast from "react-hot-toast";
import type { ProblemListItem } from "@/lib/types";
import { Card } from "./ui/Card";
import { TrustBadge } from "./TrustBadge";
import { api } from "@/lib/api";

interface CommunityProblemCardProps {
  problem: ProblemListItem;
}

export function CommunityProblemCard({ problem }: CommunityProblemCardProps) {
  const [likes, setLikes] = useState(problem._count.votes);
  const [dislikes, setDislikes] = useState(0);
  const [comments, setComments] = useState(problem._count.comments);
  const [userVote, setUserVote] = useState<"like" | "dislike" | null>(null);

  const author = problem.anonymous ? "Anonymous" : problem.user.name;
  const authorUsername = problem.anonymous ? null : problem.user.username;
  const avatarUrl = problem.anonymous ? null : problem.user.avatarUrl;
  const trust = problem.anonymous ? null : problem.user.trustScore?.score ?? 0;

  const handleLike = async () => {
    try {
      if (userVote === "like") {
        // Remove like
        await api.delete(`/api/problems/${problem.id}/vote`);
        setLikes((prev) => prev - 1);
        setUserVote(null);
      } else {
        // Add like
        await api.post(`/api/problems/${problem.id}/vote`, { type: "helpful" });
        setLikes((prev) => prev + (userVote === "dislike" ? 2 : 1));
        if (userVote === "dislike") {
          setDislikes((prev) => prev - 1);
        }
        setUserVote("like");
      }
    } catch (error) {
      toast.error("Failed to update vote");
    }
  };

  const handleDislike = async () => {
    try {
      if (userVote === "dislike") {
        // Remove dislike
        await api.delete(`/api/problems/${problem.id}/vote`);
        setDislikes((prev) => prev - 1);
        setUserVote(null);
      } else {
        // Add dislike
        await api.post(`/api/problems/${problem.id}/vote`, { type: "misleading" });
        setDislikes((prev) => prev + (userVote === "like" ? 2 : 1));
        if (userVote === "like") {
          setLikes((prev) => prev - 1);
        }
        setUserVote("dislike");
      }
    } catch (error) {
      toast.error("Failed to update vote");
    }
  };

  const postTime = formatDistanceToNow(new Date(problem.createdAt), { addSuffix: true });

  return (
    <Card className="overflow-hidden transition hover:shadow-md">
      {/* Header with Author Profile */}
      <div className="border-b border-[rgb(var(--border))] p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={author}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgb(var(--primary))] text-sm font-semibold text-white">
                  {author.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Author Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Link
                  href={problem.anonymous ? "#" : `/u/${authorUsername || problem.user.id}`}
                  className="font-semibold hover:text-[rgb(var(--primary))]"
                >
                  {author}
                </Link>
                {trust !== null && trust > 0 && <TrustBadge score={trust} />}
              </div>
              <p className="text-xs text-[rgb(var(--muted-foreground))]">{postTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Content */}
      <div className="p-4">
        <Link href={`/problems/${problem.id}`} className="block">
          <h3 className="text-lg font-semibold hover:text-[rgb(var(--primary))]">{problem.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm text-[rgb(var(--muted-foreground))]">{problem.description}</p>
        </Link>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full bg-[rgb(var(--primary))]/10 px-3 py-1 text-xs font-medium text-[rgb(var(--primary))]">
            {problem.category.name}
          </span>
          {problem.emotionTag && (
            <span className="inline-flex items-center rounded-full bg-[rgb(var(--accent))]/10 px-3 py-1 text-xs font-medium text-[rgb(var(--accent))]">
              {problem.emotionTag}
            </span>
          )}
          {problem.tags.length > 0 &&
            problem.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--muted))] px-3 py-1 text-xs"
              >
                {tag}
              </span>
            ))}
        </div>
      </div>

      {/* Interactive Footer */}
      <div className="border-t border-[rgb(var(--border))] bg-[rgb(var(--muted))]/30 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-[rgb(var(--muted-foreground))]">
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {comments} {comments === 1 ? "comment" : "comments"}
            </span>
            <span className="inline-flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              {likes} {likes === 1 ? "like" : "likes"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition hover:bg-[rgb(var(--muted))] ${
                userVote === "like"
                  ? "border-[rgb(var(--primary))] bg-[rgb(var(--primary))]/10 text-[rgb(var(--primary))]"
                  : "border-[rgb(var(--border))]"
              }`}
              title="This solution was helpful"
            >
              <ThumbsUp className="h-4 w-4" />
            </button>

            <button
              onClick={handleDislike}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition hover:bg-[rgb(var(--muted))] ${
                userVote === "dislike"
                  ? "border-red-500 bg-red-500/10 text-red-500"
                  : "border-[rgb(var(--border))]"
              }`}
              title="This is misleading"
            >
              <ThumbsDown className="h-4 w-4" />
            </button>

            <Link
              href={`/problems/${problem.id}`}
              className="rounded-lg border border-[rgb(var(--border))] px-3 py-2 text-xs font-medium transition hover:bg-[rgb(var(--muted))]"
            >
              <MessageCircle className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
