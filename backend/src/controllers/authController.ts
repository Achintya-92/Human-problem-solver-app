import type { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { signAccessToken } from "../utils/jwt";
import { createUser, verifyUserPassword } from "../services/authService";

export async function signup(req: Request, res: Response) {
  const user = await createUser(req.body);
  const token = signAccessToken(user.id);
  res.status(201).json({ data: { user, token } });
}

export async function login(req: Request, res: Response) {
  const user = await verifyUserPassword(req.body);
  if (!user) {
    return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Invalid credentials" } });
  }
  const token = signAccessToken(user.id);
  return res.json({ data: { user, token } });
}

export async function logout(_req: Request, res: Response) {
  // Stateless JWT: client just deletes token.
  return res.json({ data: { ok: true } });
}

export async function me(req: Request, res: Response) {
  const userId = req.auth!.userId;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      username: true,
      bio: true,
      avatarUrl: true,
      createdAt: true,
      trustScore: true,
      userBadges: { include: { badge: true } },
      _count: { select: { problems: true, solutions: true } },
    },
  });
  return res.json({ data: { user } });
}

