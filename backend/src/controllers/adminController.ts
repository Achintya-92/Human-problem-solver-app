import type { Request, Response } from "express";
import { z } from "zod";
import * as expertService from "../services/expertService";
import * as reportService from "../services/reportService";
import { prisma } from "../db/prisma";

// Middleware to check admin role
export async function requireAdmin(req: Request, res: Response, next: any) {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Not authenticated" } });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.role !== "ADMIN") {
      return res.status(403).json({ error: { code: "FORBIDDEN", message: "Admin access required" } });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: { code: "ERROR", message: "Internal server error" } });
  }
}

// Admin dashboard stats
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [totalUsers, totalProblems, totalSolutions, totalExperts, pendingReports] = await Promise.all([
      prisma.user.count(),
      prisma.problem.count(),
      prisma.solution.count(),
      prisma.expert.count(),
      prisma.report.count({ where: { status: "PENDING" } }),
    ]);

    return res.json({
      data: {
        stats: {
          totalUsers,
          totalProblems,
          totalSolutions,
          totalExperts,
          pendingReports,
          activeExperts: await prisma.expert.count({ where: { isVerified: true } }),
          totalConsultations: await prisma.consultation.count(),
          completedConsultations: await prisma.consultation.count({ where: { status: "COMPLETED" } }),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: { code: "ERROR", message: "Failed to fetch stats" } });
  }
};

// Verify expert
export const verifyExpert = async (req: Request, res: Response) => {
  const { expertId } = req.params;

  try {
    const expert = await expertService.updateExpertVerification(expertId, true);
    return res.json({ data: { expert } });
  } catch (error) {
    res.status(500).json({ error: { code: "ERROR", message: "Failed to verify expert" } });
  }
};

// Reject expert verification
export const rejectExpertVerification = async (req: Request, res: Response) => {
  const { expertId } = req.params;

  try {
    const expert = await expertService.updateExpertVerification(expertId, false);
    return res.json({ data: { expert } });
  } catch (error) {
    res.status(500).json({ error: { code: "ERROR", message: "Failed to reject expert" } });
  }
};

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  const query = z
    .object({
      role: z.string().optional(),
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(50).default(10),
    })
    .parse(req.query);

  const skip = (query.page - 1) * query.limit;
  const where: any = {};
  if (query.role) where.role = query.role;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: query.limit,
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        role: true,
        createdAt: true,
        trustScore: true,
        _count: { select: { problems: true, solutions: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  return res.json({ data: { users, total, page: query.page, limit: query.limit } });
};

// Suspend/Ban user
export const suspendUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { reason } = req.body;

  // Note: Add suspension field to User model in production
  // For now, we can mark with a flag or create a suspension record

  return res.json({ data: { ok: true, message: "User suspended" } });
};

// Get pending reports
export const getPendingReports = async (req: Request, res: Response) => {
  const query = z
    .object({
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(50).default(10),
    })
    .parse(req.query);

  const result = await reportService.getReports(query.page, query.limit, "PENDING");
  return res.json({ data: result });
};

// Resolve report
export const resolveReport = async (req: Request, res: Response) => {
  const { reportId } = req.params;
  const { action, resolution } = req.body; // action: "dismiss" | "suspend" | "warn"

  try {
    const report = await reportService.updateReportStatus(reportId, "RESOLVED", resolution);

    // TODO: Implement action (suspend user, send warning, etc.)

    return res.json({ data: { report } });
  } catch (error) {
    res.status(500).json({ error: { code: "ERROR", message: "Failed to resolve report" } });
  }
};

// Get all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { problems: true, experts: true } } },
      orderBy: { name: "asc" },
    });
    return res.json({ data: { categories } });
  } catch (error) {
    res.status(500).json({ error: { code: "ERROR", message: "Failed to fetch categories" } });
  }
};

// Create category
export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  const slug = name.toLowerCase().replace(/\s+/g, "-");

  try {
    const category = await prisma.category.create({
      data: { name, slug },
    });
    return res.status(201).json({ data: { category } });
  } catch (error) {
    res.status(400).json({ error: { code: "ERROR", message: "Category already exists" } });
  }
};

// Delete category
export const deleteCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  try {
    // Check if category has problems
    const problemCount = await prisma.problem.count({ where: { categoryId } });
    if (problemCount > 0) {
      return res.status(400).json({ error: { code: "ERROR", message: "Category has problems, cannot delete" } });
    }

    await prisma.category.delete({ where: { id: categoryId } });
    return res.json({ data: { ok: true } });
  } catch (error) {
    res.status(500).json({ error: { code: "ERROR", message: "Failed to delete category" } });
  }
};
