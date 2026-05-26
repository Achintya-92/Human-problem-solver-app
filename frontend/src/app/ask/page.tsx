"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RequireAuth } from "@/components/RequireAuth";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import type { Category } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function AskPage() {
  return (
    <RequireAuth>
      <AskForm />
    </RequireAuth>
  );
}

function AskForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [tags, setTags] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [emotionTag, setEmotionTag] = useState<string>("");

  const [imageUrl, setImageUrl] = useState("");
  const [voiceUrl, setVoiceUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get<{ categories: Category[] }>("/api/categories")
      .then((d) => {
        setCategories(d.categories);
        setCategorySlug(d.categories[0]?.slug ?? "");
      })
      .catch(() => setCategories([]));
  }, []);

  async function autoDetectEmotion() {
    try {
      const d = await api.post<{ emotion: string }>("/api/ai/emotion-detect", { text: `${title}\n\n${description}` });
      setEmotionTag(d.emotion);
      toast.success(`Emotion tag: ${d.emotion}`);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to detect emotion");
    }
  }

  async function onSubmit() {
    setSubmitting(true);
    try {
      const d = await api.post<{ problem: { id: string } }>("/api/problems", {
        title,
        description,
        categorySlug,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
          .slice(0, 10),
        anonymous,
        emotionTag: emotionTag || undefined,
        imageUrl: imageUrl || undefined,
        voiceUrl: voiceUrl || undefined,
      });
      toast.success("Problem posted");
      router.push(`/problems/${d.problem.id}`);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to post problem");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-xl font-semibold">Ask a real-life problem</h1>
      <p className="mt-1 text-sm text-[rgb(var(--muted-foreground))]">
        Share context + emotions. People reply with what actually worked for them.
      </p>

      <Card className="mt-5 p-5">
        <div className="grid gap-4">
          <div>
            <div className="text-sm font-medium">Problem title</div>
            <div className="mt-2">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., I keep failing interviews despite preparing" />
            </div>
          </div>

          <div>
            <div className="text-sm font-medium">Detailed description</div>
            <div className="mt-2">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[180px] w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]"
                placeholder="Include what you tried, what went wrong, constraints, and what success looks like."
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-sm font-medium">Category</div>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="mt-2 h-10 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 text-sm"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-sm font-medium">Tags (comma separated)</div>
              <div className="mt-2">
                <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="interview, anxiety, resume" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-sm font-medium">Emotion tag</div>
              <div className="mt-2 flex gap-2">
                <Input value={emotionTag} onChange={(e) => setEmotionTag(e.target.value)} placeholder="anxious / stuck / hopeful…" />
                <Button variant="outline" onClick={autoDetectEmotion} type="button">
                  Auto-detect (AI)
                </Button>
              </div>
              <div className="mt-2 text-xs text-[rgb(var(--muted-foreground))]">
                AI tag is a placeholder—humans provide the solutions.
              </div>
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
              <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
              <div>
                <div className="text-sm font-medium">Anonymous mode</div>
                <div className="text-xs text-[rgb(var(--muted-foreground))]">Hide your profile from the public feed.</div>
              </div>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-sm font-medium">Optional image URL</div>
              <div className="mt-2">
                <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Optional voice URL</div>
              <div className="mt-2">
                <Input value={voiceUrl} onChange={(e) => setVoiceUrl(e.target.value)} placeholder="https://…" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => router.push("/")}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={submitting}>
              {submitting ? "Posting…" : "Post problem"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

