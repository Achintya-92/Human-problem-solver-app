"use client";

import { useEffect, useState } from "react";
import { X, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import type { Category } from "@/lib/types";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { useRouter } from "next/navigation";
import { useAuth } from "./providers/AuthProvider";

interface SubmitProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubmitProblemModal({ isOpen, onClose }: SubmitProblemModalProps) {
  const router = useRouter();
  const { status } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (status !== "authed") {
      toast.error("Please log in to submit a problem");
      onClose();
      return;
    }

    api
      .get<{ categories: Category[] }>("/api/categories")
      .then((d) => {
        setCategories(d.categories);
        setCategorySlug(d.categories[0]?.slug ?? "");
      })
      .catch(() => setCategories([]));
  }, [isOpen, status]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a problem title");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter a problem description");
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post<{ problem: { id: string } }>("/api/problems", {
        title,
        description,
        categorySlug,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
          .slice(0, 10),
        anonymous: false,
      });

      toast.success("Problem posted successfully!");
      setTitle("");
      setDescription("");
      setTags("");
      onClose();
      router.push(`/problems/${response.problem.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit problem");
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgb(var(--border))] px-6 py-4">
          <h2 className="text-lg font-semibold">Share Your Problem</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-[rgb(var(--muted))]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Problem Title */}
          <div>
            <label className="block text-sm font-medium">Problem Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your problem?"
              maxLength={200}
              disabled={submitting}
            />
            <p className="mt-1 text-xs text-[rgb(var(--muted-foreground))]">
              {title.length}/200
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more context and details..."
              maxLength={1000}
              disabled={submitting}
              rows={4}
              className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-[rgb(var(--ring))] placeholder:text-[rgb(var(--muted-foreground))] disabled:opacity-50"
            />
            <p className="mt-1 text-xs text-[rgb(var(--muted-foreground))]">
              {description.length}/1000
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              disabled={submitting}
              className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-[rgb(var(--ring))] disabled:opacity-50"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium">Tags (optional)</label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Separate with commas (e.g., career, interview, tech)"
              disabled={submitting}
              maxLength={100}
            />
            <p className="mt-1 text-xs text-[rgb(var(--muted-foreground))]">
              Up to 10 tags allowed
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? "Posting..." : "Post Problem"}
            </Button>
          </div>

          <div className="rounded-lg bg-[rgb(var(--muted))] p-3 text-xs text-[rgb(var(--muted-foreground))]">
            💡 <strong>Tip:</strong> Be specific about your problem and what you've already tried. More context = better solutions!
          </div>
        </form>
      </div>
    </>
  );
}
