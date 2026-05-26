import { prisma } from "../db/prisma";
import { z } from "zod";

export const createExpertSchema = z.object({
  specializations: z.array(z.string()).default([]),
  yearsOfExperience: z.number().int().min(0).default(0),
  hourlyRate: z.number().positive().default(0),
  bio: z.string().max(1000).optional(),
  consultationTypes: z.array(z.enum(["CHAT", "CALL", "VIDEO"])).default(["CHAT"]),
  whatsappLink: z.string().url().optional(),
  contactEmail: z.string().email().optional(),
  bookingLink: z.string().url().optional(),
  categorySlug: z.string().optional(),
});

export const updateExpertSchema = createExpertSchema.partial();

export async function createOrUpdateExpertProfile(userId: string, data: z.infer<typeof createExpertSchema>) {
  const categoryId = data.categorySlug
    ? (await prisma.category.findUnique({ where: { slug: data.categorySlug } }))?.id
    : null;

  // Check if expert profile already exists
  const existing = await prisma.expert.findUnique({ where: { userId } });

  if (existing) {
    return prisma.expert.update({
      where: { userId },
      data: {
        specializations: data.specializations,
        yearsOfExperience: data.yearsOfExperience,
        hourlyRate: data.hourlyRate,
        bio: data.bio,
        consultationTypes: data.consultationTypes,
        whatsappLink: data.whatsappLink,
        contactEmail: data.contactEmail,
        bookingLink: data.bookingLink,
        ...(categoryId && { categoryId }),
      },
      include: { user: true, category: true },
    });
  }

  return prisma.expert.create({
    data: {
      userId,
      specializations: data.specializations,
      yearsOfExperience: data.yearsOfExperience,
      hourlyRate: data.hourlyRate,
      bio: data.bio,
      consultationTypes: data.consultationTypes,
      whatsappLink: data.whatsappLink,
      contactEmail: data.contactEmail,
      bookingLink: data.bookingLink,
      ...(categoryId && { categoryId }),
    },
    include: { user: true, category: true },
  });
}

export async function getExpertProfile(userId: string) {
  return prisma.expert.findUnique({
    where: { userId },
    include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } }, category: true },
  });
}

export async function listExperts(filters?: { categorySlug?: string; verified?: boolean; page?: number; limit?: number }) {
  const skip = ((filters?.page ?? 1) - 1) * (filters?.limit ?? 10);

  const where: any = {};
  if (filters?.verified !== undefined) where.isVerified = filters.verified;
  if (filters?.categorySlug) {
    const category = await prisma.category.findUnique({ where: { slug: filters.categorySlug } });
    if (category) where.categoryId = category.id;
  }

  const [experts, total] = await Promise.all([
    prisma.expert.findMany({
      where,
      skip,
      take: filters?.limit ?? 10,
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true, username: true } },
        category: true,
      },
      orderBy: { averageRating: "desc" },
    }),
    prisma.expert.count({ where }),
  ]);

  return { experts, total };
}

export async function getExpertById(expertId: string) {
  return prisma.expert.findUnique({
    where: { id: expertId },
    include: {
      user: { select: { id: true, name: true, email: true, avatarUrl: true, username: true } },
      category: true,
      consultations: {
        where: { status: "COMPLETED" },
        select: { id: true, feedback: true, rating: true },
        take: 5,
      },
    },
  });
}

export async function updateExpertVerification(expertId: string, isVerified: boolean) {
  return prisma.expert.update({
    where: { id: expertId },
    data: { isVerified },
    include: { user: true },
  });
}
