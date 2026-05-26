import bcrypt from "bcryptjs";
import { prisma } from "../db/prisma";

export async function createUser(input: { email: string; password: string; name: string }) {
  const passwordHash = await bcrypt.hash(input.password, 10);
  return prisma.user.create({
    data: {
      email: input.email.toLowerCase(),
      passwordHash,
      name: input.name,
      trustScore: { create: {} },
    },
    select: { id: true, email: true, name: true, username: true, avatarUrl: true, bio: true, createdAt: true },
  });
}

export async function verifyUserPassword(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
    select: { id: true, email: true, name: true, username: true, avatarUrl: true, bio: true, passwordHash: true },
  });
  if (!user) return null;
  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) return null;
  const { passwordHash: _ph, ...safeUser } = user;
  return safeUser;
}

