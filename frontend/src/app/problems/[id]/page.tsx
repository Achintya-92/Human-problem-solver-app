"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import type { ProblemDetail } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { TrustBadge } from "@/components/TrustBadge";
import { SolutionCard } from "@/components/SolutionCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/components/providers/AuthProvider";
import { AIRecommendationPanel } from "@/components/AIRecommendationPanel";

export default function ProblemDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { status } = useAuth();

  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const d = await api.get<{ problem: ProblemDetail }>(`/api/problems/${id}`);
      setProblem(d.problem);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to load problem");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <div className="text-sm text-[rgb(var(--muted-foreground))]">Loading…</div>;
  }
  if (!problem) {
    return (
      <div className="rounded-2xl border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--card))] p-8 text-center">
        <div className="text-base font-semibold">Problem not found</div>
      </div>
    );
  }

  const author = problem.anonymous ? "Anonymous" : problem.user.name;
  const trust = problem.anonymous ? null : problem.user.trustScore?.score ?? 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-4">
        <Card className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-xl font-semibold">{problem.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[rgb(var(--muted-foreground))]">
                <span className="rounded-full bg-[rgb(var(--muted))] px-2 py-1">{problem.category.name}</span>
                {problem.emotionTag ? <span className="rounded-full bg-[rgb(var(--muted))] px-2 py-1">{problem.emotionTag}</span> : null}
                <span>•</span>
                <span>{author}</span>
              </div>
            </div>
            <TrustBadge score={trust} />
          </div>

          <div className="mt-4 whitespace-pre-wrap text-sm leading-6">{problem.description}</div>

          <div className="mt-4 flex flex-wrap gap-2">
            {problem.tags?.map((t) => (
              <span key={t} className="rounded-full border border-[rgb(var(--border))] px-2 py-1 text-xs text-[rgb(var(--muted-foreground))]">
                #{t}
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-base font-semibold">Human solutions</div>
              <div className="text-sm text-[rgb(var(--muted-foreground))]">
                Each answer must share experience, mistakes, steps, timeline, and outcome.
              </div>
            </div>
            <div className="text-sm text-[rgb(var(--muted-foreground))]">{problem.solutions.length} total</div>
          </div>

          <div className="mt-4 space-y-3">
            {problem.solutions.length ? (
              problem.solutions.map((s) => (
                <SolutionCard
                  key={s.id}
                  solution={s}
                  onVote={status === "authed" ? async (kind) => {
                    try {
                      await api.post(`/api/problems/solutions/${s.id}/votes`, { kind });
                      toast.success("Vote recorded");
                      load();
                    } catch (e: any) {
                      toast.error(e.message ?? "Failed to vote");
                    }
                  } : undefined}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[rgb(var(--border))] p-6 text-center text-sm text-[rgb(var(--muted-foreground))]">
                No solutions yet. Be the first to share what worked for you.
              </div>
            )}
          </div>
        </Card>

        {status === "authed" ? <PostSolution problemId={problem.id} onPosted={load} /> : null}
      </div>

      <div className="space-y-4">
        <AIRecommendationPanel category={problem.category.slug} q={problem.title} />
        <SimilarProblems problemId={problem.id} />
      </div>
    </div>
  );
}

function SimilarProblems({ problemId }: { problemId: string }) {
  const [note, setNote] = useState("Loading…");
  useEffect(() => {
    api
      .get<{ note: string }>(`/api/ai/similar-problems?problemId=${encodeURIComponent(problemId)}`)
      .then((d) => setNote(d.note))
      .catch(() => setNote("AI placeholder currently unavailable."));
  }, [problemId]);

  return (
    <Card className="p-4">
      <div className="text-sm font-semibold">Similar problems</div>
      <div className="mt-2 text-sm text-[rgb(var(--muted-foreground))]">{note}</div>
    </Card>
  );
}

function PostSolution({ problemId, onPosted }: { problemId: string; onPosted: () => void }) {
  const [content, setContent] = useState("");
  const [steps, setSteps] = useState("");
  const [mistakes, setMistakes] = useState("");
  const [timeline, setTimeline] = useState("");
  const [results, setResults] = useState("");
  const [experienceType, setExperienceType] = useState<"PERSONALLY_EXPERIENCED" | "MENTOR" | "EXPERT">("PERSONALLY_EXPERIENCED");
  const [proofLinks, setProofLinks] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const proofs = useMemo(
    () =>
      proofLinks
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 10),
    [proofLinks],
  );

  async function submit() {
    setLoading(true);
    try {
      await api.post(`/api/problems/${problemId}/solutions`, {
        content,
        practicalSteps: steps,
        mistakes: mistakes || undefined,
        timeline: timeline || undefined,
        results: results || undefined,
        experienceType,
        proofLinks: proofs.length ? proofs : undefined,
        videoUrl: videoUrl || undefined,
      });
      toast.success("Solution posted");
      setContent("");
      setSteps("");
      setMistakes("");
      setTimeline("");
      setResults("");
      setProofLinks("");
      setVideoUrl("");
      onPosted();
    } catch (e: any) {
      toast.error(e.message ?? "Failed to post solution");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-5">
      <div className="text-base font-semibold">Post a solution</div>
      <div className="mt-1 text-sm text-[rgb(var(--muted-foreground))]">Share what you did, what you messed up, and what result you got.</div>

      <div className="mt-4 grid gap-4">
        <div>
          <div className="text-sm font-medium">Experience type</div>
          <select
            value={experienceType}
            onChange={(e) => setExperienceType(e.target.value as any)}
            className="mt-2 h-10 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 text-sm"
          >
            <option value="PERSONALLY_EXPERIENCED">Personally experienced</option>
            <option value="MENTOR">Mentor</option>
            <option value="EXPERT">Expert</option>
          </select>
        </div>

        <div>
          <div className="text-sm font-medium">Short answer (context)</div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-2 min-h-[110px] w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]"
            placeholder="What was your situation? Why did this problem happen?"
          />
        </div>

        <div>
          <div className="text-sm font-medium">Practical steps (numbered is best)</div>
          <textarea
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            className="mt-2 min-h-[140px] w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]"
            placeholder={"1) ...\n2) ...\n3) ..."}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-sm font-medium">Mistakes made (optional)</div>
            <textarea
              value={mistakes}
              onChange={(e) => setMistakes(e.target.value)}
              className="mt-2 min-h-[110px] w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]"
              placeholder="What didn’t work / what you would avoid"
            />
          </div>
          <div>
            <div className="text-sm font-medium">Timeline (optional)</div>
            <Input value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="e.g., 3 weeks, daily practice" className="mt-2" />
            <div className="mt-4 text-sm font-medium">Results achieved (optional)</div>
            <textarea
              value={results}
              onChange={(e) => setResults(e.target.value)}
              className="mt-2 min-h-[90px] w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]"
              placeholder="What changed? What outcome did you get?"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-sm font-medium">Proof links (comma separated, optional)</div>
            <Input value={proofLinks} onChange={(e) => setProofLinks(e.target.value)} placeholder="https://…, https://…" className="mt-2" />
          </div>
          <div>
            <div className="text-sm font-medium">Video URL (optional)</div>
            <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://…" className="mt-2" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={submit} disabled={loading}>
            {loading ? "Posting…" : "Post solution"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

