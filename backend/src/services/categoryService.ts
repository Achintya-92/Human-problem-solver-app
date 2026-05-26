import { prisma } from "../db/prisma";

const defaults = [
  { name: "Career", slug: "career" },
  { name: "Coding & Tech", slug: "coding-tech" },
  { name: "Education", slug: "education" },
  { name: "Communication", slug: "communication" },
  { name: "Health & Habits", slug: "health-habits" },
  { name: "Life Problems", slug: "life-problems" },
] as const;

export async function ensureDefaultCategories() {
  const count = await prisma.category.count();
  if (count > 0) return;

  await prisma.category.createMany({
    data: defaults.map((c) => ({ name: c.name, slug: c.slug })),
    skipDuplicates: true,
  });
}

