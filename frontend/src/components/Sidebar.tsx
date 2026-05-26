import Link from "next/link";
import { Flame, HeartHandshake, Medal, Sparkles } from "lucide-react";
import { Card } from "./ui/Card";

export function Sidebar() {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="text-sm font-semibold">Today’s vibe</div>
        <div className="mt-1 text-sm text-[rgb(var(--muted-foreground))]">
          People helping people — AI only organizes the wisdom.
        </div>
      </Card>

      <Card className="p-4">
        <div className="text-sm font-semibold">Highlights</div>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-[rgb(var(--primary))]" />
            Trending problems
          </li>
          <li className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[rgb(var(--primary))]" />
            AI recommended experiences
          </li>
          <li className="flex items-center gap-2">
            <HeartHandshake className="h-4 w-4 text-[rgb(var(--primary))]" />
            “Worked for me” votes
          </li>
          <li className="flex items-center gap-2">
            <Medal className="h-4 w-4 text-[rgb(var(--primary))]" />
            Top contributors
          </li>
        </ul>

        <div className="mt-4">
          <Link
            href="/ask"
            className="inline-flex w-full items-center justify-center rounded-xl bg-[rgb(var(--primary))] px-3 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Share a problem
          </Link>
        </div>
      </Card>
    </div>
  );
}

