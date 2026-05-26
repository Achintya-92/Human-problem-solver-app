import type { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { ensureDefaultCategories } from "../services/categoryService";

export async function listCategories(_req: Request, res: Response) {
  await ensureDefaultCategories();
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return res.json({ data: { categories } });
}

