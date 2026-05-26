"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { TrustBadge } from "@/components/TrustBadge";

type UserProfile = {
  id: string;
  name: string;
  username?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
  trustScore?: { score: number; helpfulVotes: number; workedForMeVotes: number; misleadingReports: number } | null;
  userBadges: { badge: { id: string; name: string; description?: string | null } }[];
  problems: { id: string; title: string; createdAt: string }[];
  solutions: { id: string; createdAt: string; problem: { id: string; title: string } }[];
};

export default function UserProfilePage() {
  const params = useParams<{ idOrUsername: string }>();
  const idOrUsername = params.idOrUsername;
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    api
      .get<{ user: UserProfile }>(`/api/users/${idOrUsername}`)
      .then((d) => setUser(d.user))
      .catch((e: any) => toast.error(e.message ?? "Failed to load profile"));
  }, [idOrUsername]);

  if (!user) {
    return <div className="text-sm text-[rgb(var(--muted-foreground))]">Loading…</div>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-4">
        <Card className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xl font-semibold">{user.name}</div>
              <div className="mt-1 text-sm text-[rgb(var(--muted-foreground))]">
                {user.username ? `@${user.username}` : "Community member"}
              </div>
            </div>
            <TrustBadge score={user.trustScore?.score ?? 0} />
          </div>

          {user.bio ? <div className="mt-4 whitespace-pre-wrap text-sm">{user.bio}</div> : null}
        </Card>

        <Card className="p-5">
          <div className="text-base font-semibold">Badges</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {user.userBadges.length ? (
              user.userBadges.map((b) => (
                <span key={b.badge.id} className="rounded-full bg-[rgb(var(--muted))] px-3 py-1.5 text-sm">
                  {b.badge.name}
                </span>
              ))
            ) : (
              <div className="text-sm text-[rgb(var(--muted-foreground))]">No badges yet.</div>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-base font-semibold">Recent solutions</div>
          <div className="mt-3 space-y-2">
            {user.solutions.length ? (
              user.solutions.map((s) => (
                <a
                  key={s.id}
                  href={`/problems/${s.problem.id}`}
                  className="block rounded-2xl border border-[rgb(var(--border))] p-3 hover:bg-[rgb(var(--muted))]"
                >
                  <div className="text-sm font-medium">{s.problem.title}</div>
                  <div className="text-xs text-[rgb(var(--muted-foreground))]">Solution posted • {new Date(s.createdAt).toLocaleDateString()}</div>
                </a>
              ))
            ) : (
              <div className="text-sm text-[rgb(var(--muted-foreground))]">No solutions yet.</div>
            )}
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="p-4">
          <div className="text-sm font-semibold">Trust breakdown</div>
          <div className="mt-3 grid gap-2 text-sm text-[rgb(var(--muted-foreground))]">
            <div className="flex justify-between">
              <span>Helpful votes</span>
              <span className="font-medium">{user.trustScore?.helpfulVotes ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Worked-for-me</span>
              <span className="font-medium">{user.trustScore?.workedForMeVotes ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Misleading reports</span>
              <span className="font-medium">{user.trustScore?.misleadingReports ?? 0}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm font-semibold">Recent problems</div>
          <div className="mt-3 space-y-2">
            {user.problems.length ? (
              user.problems.map((p) => (
                <a
                  key={p.id}
                  href={`/problems/${p.id}`}
                  className="block rounded-2xl border border-[rgb(var(--border))] p-3 hover:bg-[rgb(var(--muted))]"
                >
                  <div className="text-sm font-medium">{p.title}</div>
                  <div className="text-xs text-[rgb(var(--muted-foreground))]">{new Date(p.createdAt).toLocaleDateString()}</div>
                </a>
              ))
            ) : (
              <div className="text-sm text-[rgb(var(--muted-foreground))]">No problems posted yet.</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

