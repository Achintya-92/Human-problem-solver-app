"use client";

import Link from "next/link";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/components/providers/AuthProvider";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TrustBadge } from "@/components/TrustBadge";

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardInner />
    </RequireAuth>
  );
}

function DashboardInner() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Card className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xl font-semibold">Dashboard</div>
            <div className="mt-1 text-sm text-[rgb(var(--muted-foreground))]">
              Your profile, trust, and contributions.
            </div>
          </div>
          <TrustBadge score={user?.trustScore?.score ?? 0} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/ask">
            <Button>Ask a problem</Button>
          </Link>
          <Link href={`/u/${user?.username ?? user?.id ?? ""}`}>
            <Button variant="outline">View profile</Button>
          </Link>
        </div>
      </Card>

      <Card className="p-5">
        <div className="text-base font-semibold">Next steps</div>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[rgb(var(--muted-foreground))]">
          <li>Post a problem with context and emotion.</li>
          <li>Answer someone with a step-by-step experience story.</li>
          <li>Earn trust via helpful and worked-for-me votes.</li>
        </ul>
      </Card>
    </div>
  );
}

