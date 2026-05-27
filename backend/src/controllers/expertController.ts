import type { Request, Response } from "express";
import { z } from "zod";
import * as expertService from "../services/expertService";

export const getMyExpertProfile = async (req: Request, res: Response) => {
  const userId = req.auth!.userId;

  const expert = await expertService.getExpertProfile(userId);

  return res.json({
    data: { expert },
  });
};

export const createOrUpdateExpertProfile = async (
  req: Request,
  res: Response
) => {
  const userId = req.auth!.userId;

  const data = expertService.createExpertSchema.parse(req.body);

  const expert = await expertService.createOrUpdateExpertProfile(
    userId,
    data
  );

  return res.json({
    data: { expert },
  });
};

export const listExperts = async (req: Request, res: Response) => {
  const query = z
    .object({
      category: z.string().optional(),

      verified: z
        .enum(["true", "false"])
        .transform((v) => v === "true")
        .optional(),

      page: z.coerce.number().int().min(1).default(1),

      limit: z.coerce.number().int().min(1).max(50).default(10),
    })
    .parse(req.query);

  const result = await expertService.listExperts({
    categorySlug: query.category,
    verified: query.verified,
    page: query.page,
    limit: query.limit,
  });

  return res.json({
    data: result,
  });
};

export const getExpertById = async (req: Request, res: Response) => {
  const id = String(req.params.id);

  const expert = await expertService.getExpertById(id);

  if (!expert) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: "Expert not found",
      },
    });
  }

  return res.json({
    data: { expert },
  });
};

export const uploadProfilePhoto = async (
  req: Request,
  res: Response
) => {
  const userId = req.auth!.userId;

  // later cloud upload url
  const photoUrl = req.body.photoUrl;

  const expert = await expertService.getExpertProfile(userId);

  if (!expert) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: "Expert profile not found",
      },
    });
  }

  const updated = await expertService.createOrUpdateExpertProfile(
    userId,
    {
      specializations: expert.specializations,
      yearsOfExperience: expert.yearsOfExperience,
      hourlyRate: expert.hourlyRate,

      consultationTypes: expert.consultationTypes,

      bio: expert.bio ?? undefined,
      whatsappLink: expert.whatsappLink ?? undefined,
      contactEmail: expert.contactEmail ?? undefined,
      bookingLink: expert.bookingLink ?? undefined,

      categorySlug: expert.category?.slug,
    }
  );

  return res.json({
    data: {
      expert: updated,
      photoUrl,
    },
  });
};