import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../db/prisma";
import { createProblem, createSolution, getProblemDetail, listProblems } from "../services/problemService";
import { mapVoteTargetType, recalcUserTrustScore } from "../services/trustService";

export const listProblemsQuerySchema = z.object({
  sort: z.preprocess((v) => (Array.isArray(v) ? v[0] : v), z.enum(["latest", "trending"]).default("latest")),
  category: z.preprocess((v) => (Array.isArray(v) ? v[0] : v), z.string().optional()),
  q: z.preprocess((v) => (Array.isArray(v) ? v[0] : v), z.string().optional()),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const createProblemSchema = z.object({
  title: z.string().min(5).max(140),
  description: z.string().min(20).max(8000),
  categorySlug: z.string().min(1),
  tags: z.array(z.string().min(1).max(30)).max(10).optional(),
  anonymous: z.boolean().optional(),
  emotionTag: z.string().max(64).optional(),
  imageUrl: z.string().url().optional(),
  voiceUrl: z.string().url().optional(),
});

export const createSolutionSchema = z.object({
  content: z.string().min(20).max(8000),
  practicalSteps: z.string().min(20).max(8000),
  mistakes: z.string().max(8000).optional(),
  timeline: z.string().max(2000).optional(),
  results: z.string().max(8000).optional(),
  proofLinks: z.array(z.string().url()).max(10).optional(),
  videoUrl: z.string().url().optional(),
  experienceType: z.enum(["PERSONALLY_EXPERIENCED", "MENTOR", "EXPERT"]).default("PERSONALLY_EXPERIENCED"),
});

export const voteSolutionSchema = z.object({
  kind: z.enum(["helpful", "worked", "misleading"]),
});

export async function listFeed(req: Request, res: Response) {
  const q = listProblemsQuerySchema.parse(req.query);
  const { items, total } = await listProblems({
    sort: q.sort,
    categorySlug: q.category,
    q: q.q,
    page: q.page,
    limit: q.limit,
  });
  return res.json({ data: { items, total, page: q.page, limit: q.limit } });
}

export async function create(req: Request, res: Response) {
  const userId = req.auth!.userId;
  const body = createProblemSchema.parse(req.body);
  const problem = await createProblem({ userId, ...body });
  return res.status(201).json({ data: { problem } });
}

export async function detail(req: Request, res: Response) {
  const problem = await getProblemDetail(String(req.params.id));
  if (!problem) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Problem not found" } });
  return res.json({ data: { problem } });
}

export async function postSolution(req: Request, res: Response) {
  const userId = req.auth!.userId;
  const body = createSolutionSchema.parse(req.body);
  const problemId = String(req.params.id);
  const exists = await prisma.problem.findUnique({ where: { id: problemId }, select: { id: true } });
  if (!exists) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Problem not found" } });

  const solution = await createSolution({ problemId, userId, ...body });
  return res.status(201).json({ data: { solution } });
}

export async function voteSolution(req: Request, res: Response) {
  const userId = req.auth!.userId;
  const { kind } = voteSolutionSchema.parse(req.body);
  const solutionId = String(req.params.solutionId);

  const solution = await prisma.solution.findUnique({ where: { id: solutionId }, select: { id: true, userId: true } });
  if (!solution) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Solution not found" } });

  const targetType = mapVoteTargetType(kind);

  await prisma.vote.upsert({
    where: {
      userId_targetType_solutionId: { userId, targetType, solutionId },
    },
    update: {},
    create: { userId, targetType, solutionId },
  });

  await recalcUserTrustScore(solution.userId);
  return res.json({ data: { ok: true } });
}

