import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as expertService from "../services/expertService";
import * as reportService from "../services/reportService";
import { prisma } from "../db/prisma";
import { UserRole } from "@prisma/client";

// Helper function
const getParam = (param: string | string[] | undefined): string => {
  if (!param) throw new Error("Missing parameter");
  return Array.isArray(param) ? param[0] : param;
};

// Middleware to check admin role
export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "Not authenticated",
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.role !== UserRole.ADMIN) {
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",
          message: "Admin access required",
        },
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      error: {
        code: "ERROR",
        message: "Internal server error",
      },
    });
  }
}

// Verify expert
export const verifyExpert = async (req: Request, res: Response) => {
  try {
    const expertId = String(getParam(req.params.expertId));
      
    const expert = await expertService.updateExpertVerification(
      expertId,
      true
    );

    return res.json({
      data: { expert },
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        code: "ERROR",
        message: "Failed to verify expert",
      },
    });
  }
};

// Reject expert verification
export const rejectExpertVerification = async (
  req: Request,
  res: Response
) => {
  try {
    const expertId = String(getParam(req.params.expertId));

    const expert = await expertService.updateExpertVerification(
      expertId,
      false
    );

    return res.json({
      data: { expert },
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        code: "ERROR",
        message: "Failed to reject expert",
      },
    });
  }
};

// Resolve report
export const resolveReport = async (req: Request, res: Response) => {
  try {
    const reportId = String(getParam(req.params.reportId));

    const { resolution } = req.body;

    const report = await reportService.updateReportStatus(
      reportId,
      "RESOLVED",
      resolution
    );

    return res.json({
      data: { report },
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        code: "ERROR",
        message: "Failed to resolve report",
      },
    });
  }
};

// Delete category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = String(getParam(req.params.categoryId));

    const problemCount = await prisma.problem.count({
      where: { categoryId },
    });

    if (problemCount > 0) {
      return res.status(400).json({
        error: {
          code: "ERROR",
          message: "Category has problems, cannot delete",
        },
      });
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return res.json({
      data: { ok: true },
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        code: "ERROR",
        message: "Failed to delete category",
      },
    });
  }
};

export const getPendingReports = async (
  req: Request,
  res: Response
) => {
  try {
    const reports = await prisma.report.findMany({
      where: {
        status: "PENDING",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      data: { reports },
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        code: "ERROR",
        message: "Failed to fetch reports",
      },
    });
  }
};


export const getDashboardStats = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await prisma.user.count();
    const problems = await prisma.problem.count();
    const experts = await prisma.expert.count();
    const reports = await prisma.report.count({
      where: {
        status: "PENDING",
      },
    });

    return res.json({
      data: {
        users,
        problems,
        experts,
        reports,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        code: "ERROR",
        message: "Failed to fetch dashboard stats",
      },
    });
  }
};


export const getUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      data: { users },
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        code: "ERROR",
        message: "Failed to fetch users",
      },
    });
  }
};


export const suspendUser = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = getParam(req.params.userId);

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        isSuspended: true,
      },
    });

    return res.json({
      data: { user },
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        code: "ERROR",
        message: "Failed to suspend user",
      },
    });
  }
};

export const getCategories = async (
  req: Request,
  res: Response
) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      data: { categories },
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        code: "ERROR",
        message: "Failed to fetch categories",
      },
    });
  }
};

export const createCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const schema = z.object({
      name: z.string().min(2),
      slug: z.string().min(2),
    });

    const body = schema.parse(req.body);

    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug: body.slug,
      },
    });

    return res.status(201).json({
      data: { category },
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        code: "ERROR",
        message: "Failed to create category",
      },
    });
  }
};