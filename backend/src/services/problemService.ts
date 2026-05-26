import { prisma } from "../db/prisma";

export async function createProblem(input: {
  userId: string;
  title: string;
  description: string;
  categorySlug: string;
  tags?: string[];
  anonymous?: boolean;
  emotionTag?: string | null;
  imageUrl?: string | null;
  voiceUrl?: string | null;
}) {
  const category = await prisma.category.findUnique({ where: { slug: input.categorySlug } });
  if (!category) {
    const err = new Error("Category not found");
    // @ts-expect-error add status
    err.statusCode = 404;
    throw err;
  }

  return prisma.problem.create({
    data: {
      userId: input.userId,
      title: input.title,
      description: input.description,
      tags: input.tags ?? [],
      anonymous: input.anonymous ?? false,
      emotionTag: input.emotionTag ?? null,
      imageUrl: input.imageUrl ?? null,
      voiceUrl: input.voiceUrl ?? null,
      categoryId: category.id,
    },
    include: { category: true },
  });
}

export async function listProblems(input: {
  sort: "latest" | "trending";
  categorySlug?: string;
  q?: string;
  page: number;
  limit: number;
}) {
  const skip = (input.page - 1) * input.limit;

  const where: any = {};
  if (input.categorySlug) where.category = { slug: input.categorySlug };
  if (input.q) {
    where.OR = [
      { title: { contains: input.q, mode: "insensitive" } },
      { description: { contains: input.q, mode: "insensitive" } },
    ];
  }

  // "Trending" approximation: recent activity via solution count + vote count.
  const orderBy =
    input.sort === "latest"
      ? [{ createdAt: "desc" as const }]
      : [
          { votes: { _count: "desc" as const } },
          { solutions: { _count: "desc" as const } },
          { createdAt: "desc" as const },
        ];

  const [items, total] = await Promise.all([
    prisma.problem.findMany({
      where,
      skip,
      take: input.limit,
      orderBy,
      include: {
        category: true,
        user: { select: { id: true, name: true, username: true, avatarUrl: true, trustScore: true } },
        _count: { select: { solutions: true, comments: true, votes: true } },
      },
    }),
    prisma.problem.count({ where }),
  ]);

  return { items, total };
}

export async function getProblemDetail(problemId: string) {
  return prisma.problem.findUnique({
    where: { id: problemId },
    include: {
      category: true,
      user: { select: { id: true, name: true, username: true, avatarUrl: true, trustScore: true } },
      _count: { select: { solutions: true, comments: true, votes: true } },
      solutions: {
        orderBy: [{ createdAt: "desc" }],
        include: {
          user: { select: { id: true, name: true, username: true, avatarUrl: true, trustScore: true } },
          _count: { select: { comments: true, votes: true } },
          votes: { select: { targetType: true } },
        },
      },
      comments: {
        orderBy: [{ createdAt: "asc" }],
        include: { user: { select: { id: true, name: true, username: true, avatarUrl: true } } },
      },
    },
  });
}

export async function createSolution(input: {
  problemId: string;
  userId: string;
  content: string;
  practicalSteps: string;
  mistakes?: string | null;
  timeline?: string | null;
  results?: string | null;
  proofLinks?: string[];
  videoUrl?: string | null;
  experienceType: "PERSONALLY_EXPERIENCED" | "MENTOR" | "EXPERT";
}) {
  return prisma.solution.create({
    data: {
      problemId: input.problemId,
      userId: input.userId,
      content: input.content,
      practicalSteps: input.practicalSteps,
      mistakes: input.mistakes ?? null,
      timeline: input.timeline ?? null,
      results: input.results ?? null,
      proofLinks: input.proofLinks ?? [],
      videoUrl: input.videoUrl ?? null,
      experienceType: input.experienceType,
    },
  });
}

