import { prisma } from "../db/prisma";
import { z } from "zod";

export const createConsultationSchema = z.object({
  type: z.enum(["CHAT", "CALL", "VIDEO"]),
  scheduledAt: z.string().datetime().optional(),
  notes: z.string().max(1000).optional(),
});

export async function bookConsultation(userId: string, expertId: string, data: z.infer<typeof createConsultationSchema>) {
  // Verify expert exists
  const expert = await prisma.expert.findUnique({ where: { id: expertId } });
  if (!expert) throw new Error("Expert not found");

  return prisma.consultation.create({
    data: {
      userId,
      expertId,
      type: data.type,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      notes: data.notes,
    },
    include: { expert: { include: { user: true } }, user: true },
  });
}

export async function getConsultation(consultationId: string) {
  return prisma.consultation.findUnique({
    where: { id: consultationId },
    include: {
      expert: { include: { user: true } },
      user: true,
    },
  });
}

export async function getUserConsultations(userId: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [consultations, total] = await Promise.all([
    prisma.consultation.findMany({
      where: { userId },
      skip,
      take: limit,
      include: {
        expert: { include: { user: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.consultation.count({ where: { userId } }),
  ]);

  return { consultations, total, page, limit };
}

export async function getExpertConsultations(expertId: string, page = 1, limit = 10, status?: string) {
  const skip = (page - 1) * limit;

  const where: any = { expertId };
  if (status) where.status = status;

  const [consultations, total] = await Promise.all([
    prisma.consultation.findMany({
      where,
      skip,
      take: limit,
      include: { user: true },
      orderBy: { scheduledAt: "desc" },
    }),
    prisma.consultation.count({ where }),
  ]);

  return { consultations, total, page, limit };
}

export async function updateConsultationStatus(
  consultationId: string,
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED",
  data?: { duration?: number; feedback?: string; rating?: number; meetingLink?: string }
) {
  return prisma.consultation.update({
    where: { id: consultationId },
    data: {
      status,
      ...data,
      ...(status === "COMPLETED" && { completedAt: new Date() }),
    },
    include: {
      expert: { include: { user: true } },
      user: true,
    },
  });
}

export async function cancelConsultation(consultationId: string) {
  return updateConsultationStatus(consultationId, "CANCELLED");
}
