import type { Request, Response } from "express";
import { prisma } from "../db/prisma";

export async function getUserProfile(req: Request, res: Response) {
  const idOrUsername = String(req.params.idOrUsername);
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ id: idOrUsername }, { username: idOrUsername }],
    },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      avatarUrl: true,
      createdAt: true,
      trustScore: true,
      userBadges: { include: { badge: true } },
      problems: { orderBy: { createdAt: "desc" }, take: 10, select: { id: true, title: true, createdAt: true } },
      solutions: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, createdAt: true, problem: { select: { id: true, title: true } } },
      },
    },
  });
  if (!user) return res.status(404).json({ error: { code: "NOT_FOUND", message: "User not found" } });
  return res.json({ data: { user } });
}

