import { prisma } from "../db/prisma";
import type { VoteTargetType } from "@prisma/client";

export async function recalcUserTrustScore(userId: string) {
  const helpful = await prisma.vote.count({
    where: { solution: { userId }, targetType: "SOLUTION_HELPFUL" },
  });
  const worked = await prisma.vote.count({
    where: { solution: { userId }, targetType: "SOLUTION_WORKED_FOR_ME" },
  });
  const misleading = await prisma.vote.count({
    where: { solution: { userId }, targetType: "SOLUTION_MISLEADING" },
  });

  // Simple beginner-friendly scoring; can be replaced later.
  const score = helpful * 2 + worked * 3 - misleading * 5;

  return prisma.trustScore.upsert({
    where: { userId },
    update: { helpfulVotes: helpful, workedForMeVotes: worked, misleadingReports: misleading, score },
    create: { userId, helpfulVotes: helpful, workedForMeVotes: worked, misleadingReports: misleading, score },
  });
}

export function mapVoteTargetType(kind: "helpful" | "worked" | "misleading"): VoteTargetType {
  if (kind === "helpful") return "SOLUTION_HELPFUL";
  if (kind === "worked") return "SOLUTION_WORKED_FOR_ME";
  return "SOLUTION_MISLEADING";
}

