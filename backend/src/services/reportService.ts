import { prisma } from "../db/prisma";
import { z } from "zod";

export const createReportSchema = z.object({
  reportedUserId: z.string(),
  reason: z.string().min(5).max(100),
  description: z.string().max(1000).optional(),
});

export async function createReport(submittedById: string, data: z.infer<typeof createReportSchema>) {
  return prisma.report.create({
    data: {
      submittedById,
      reportedUserId: data.reportedUserId,
      reason: data.reason,
      description: data.description,
    },
    include: { submittedBy: true, reportedUser: true },
  });
}

export async function getReports(page = 1, limit = 10, status?: string) {
  const skip = (page - 1) * limit;
  const where: any = {};
  if (status) where.status = status;

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      skip,
      take: limit,
      include: {
        submittedBy: { select: { id: true, name: true, email: true } },
        reportedUser: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.report.count({ where }),
  ]);

  return { reports, total, page, limit };
}

export async function getReport(reportId: string) {
  return prisma.report.findUnique({
    where: { id: reportId },
    include: {
      submittedBy: { select: { id: true, name: true, email: true } },
      reportedUser: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function updateReportStatus(reportId: string, status: "PENDING" | "REVIEWING" | "RESOLVED" | "DISMISSED", resolution?: string) {
  return prisma.report.update({
    where: { id: reportId },
    data: {
      status,
      resolution,
      updatedAt: new Date(),
    },
  });
}

export async function getUserReports(userId: string) {
  return prisma.report.findMany({
    where: { reportedUserId: userId },
    include: { submittedBy: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
}
