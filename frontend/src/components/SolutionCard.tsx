import { Award, Link as LinkIcon, ThumbsUp, HeartHandshake, Flag } from "lucide-react";
import type { Solution } from "@/lib/types";
import { Card } from "./ui/Card";
import { TrustBadge } from "./TrustBadge";
import { Button } from "./ui/Button";

function countVotes(votes: { targetType: string }[], type: string) {
  return votes.filter((v) => v.targetType === type).length;
}

export function SolutionCard({
  solution,
  onVote,
}: {
  solution: Solution;
  onVote?: (kind: "helpful" | "worked" | "misleading") => void;
}) {
  const helpful = countVotes(solution.votes, "SOLUTION_HELPFUL");
  const worked = countVotes(solution.votes, "SOLUTION_WORKED_FOR_ME");
  const misleading = countVotes(solution.votes, "SOLUTION_MISLEADING");

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm font-semibold">{solution.user.name}</div>
            <span className="rounded-full bg-[rgb(var(--muted))] px-2 py-1 text-xs text-[rgb(var(--muted-foreground))]">
              {solution.experienceType.replaceAll("_", " ").toLowerCase()}
            </span>
          </div>
          <div className="mt-1 text-sm text-[rgb(var(--muted-foreground))]">
            Experience-first, practical, emotionally relatable steps.
          </div>
        </div>
        <TrustBadge score={solution.user.trustScore?.score ?? 0} />
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <div className="text-xs font-semibold text-[rgb(var(--muted-foreground))]">Practical steps</div>
          <div className="mt-1 whitespace-pre-wrap text-sm">{solution.practicalSteps}</div>
        </div>
        {solution.mistakes ? (
          <div>
            <div className="text-xs font-semibold text-[rgb(var(--muted-foreground))]">Mistakes I made</div>
            <div className="mt-1 whitespace-pre-wrap text-sm">{solution.mistakes}</div>
          </div>
        ) : null}
        {solution.timeline ? (
          <div className="flex items-center gap-2 text-sm text-[rgb(var(--muted-foreground))]">
            <Award className="h-4 w-4" />
            Timeline: {solution.timeline}
          </div>
        ) : null}
        {solution.results ? (
          <div>
            <div className="text-xs font-semibold text-[rgb(var(--muted-foreground))]">Outcome / result</div>
            <div className="mt-1 whitespace-pre-wrap text-sm">{solution.results}</div>
          </div>
        ) : null}

        {solution.proofLinks?.length ? (
          <div className="flex flex-wrap gap-2">
            {solution.proofLinks.map((u) => (
              <a
                key={u}
                href={u}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[rgb(var(--border))] px-3 py-1.5 text-sm hover:bg-[rgb(var(--muted))]"
              >
                <LinkIcon className="h-4 w-4" />
                Proof
              </a>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onVote?.("helpful")}>
          <ThumbsUp className="mr-2 h-4 w-4" /> Helpful ({helpful})
        </Button>
        <Button variant="outline" size="sm" onClick={() => onVote?.("worked")}>
          <HeartHandshake className="mr-2 h-4 w-4" /> Worked for me ({worked})
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onVote?.("misleading")}>
          <Flag className="mr-2 h-4 w-4" /> Report ({misleading})
        </Button>
      </div>
    </Card>
  );
}

