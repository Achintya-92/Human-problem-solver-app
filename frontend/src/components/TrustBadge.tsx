import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/cn";

export function TrustBadge({ score, className }: { score?: number | null; className?: string }) {
  const s = score ?? 0;
  const tone = s >= 50 ? "text-emerald-600" : s >= 20 ? "text-sky-600" : s >= 0 ? "text-zinc-500" : "text-rose-600";
  return (
    <div className={cn("inline-flex items-center gap-1 rounded-full bg-[rgb(var(--muted))] px-2 py-1 text-xs", className)}>
      <ShieldCheck className={cn("h-3.5 w-3.5", tone)} />
      <span className="text-[rgb(var(--muted-foreground))]">Trust</span>
      <span className="font-semibold">{s}</span>
    </div>
  );
}

