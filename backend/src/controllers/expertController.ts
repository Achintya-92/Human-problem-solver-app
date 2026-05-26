import type { Request, Response } from "express";
import { z } from "zod";
import * as expertService from "../services/expertService";

export const getMyExpertProfile = async (req: Request, res: Response) => {
  const userId = req.auth!.userId;
  const expert = await expertService.getExpertProfile(userId);
  return res.json({ data: { expert } });
};

export const createOrUpdateExpertProfile = async (req: Request, res: Response) => {
  const userId = req.auth!.userId;
  const data = expertService.createExpertSchema.parse(req.body);
  const expert = await expertService.createOrUpdateExpertProfile(userId, data);
  return res.json({ data: { expert } });
};

export const listExperts = async (req: Request, res: Response) => {
  const query = z
    .object({
      category: z.string().optional(),
      verified: z.enum(["true", "false"]).transform((v) => v === "true").optional(),
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

  return res.json({ data: result });
};

export const getExpertById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const expert = await expertService.getExpertById(id);
  if (!expert) {
    return res.status(404).json({ error: { code: "NOT_FOUND", message: "Expert not found" } });
  }
  return res.json({ data: { expert } });
};

export const uploadProfilePhoto = async (req: Request, res: Response) => {
  // Placeholder for file upload - can be integrated with S3, Cloudinary, etc.
  const userId = req.auth!.userId;
  const photoUrl = req.body.photoUrl; // In production, this would be uploaded to cloud storage

  const expert = await expertService.getExpertProfile(userId);
  if (!expert) {
    return res.status(404).json({ error: { code: "NOT_FOUND", message: "Expert profile not found" } });
  }

  const updated = await expertService.createOrUpdateExpertProfile(userId, {
    ...expert,
    bio: expert.bio || undefined,
  });

  // Note: In production, store the uploaded photo URL
  return res.json({ data: { expert: updated, photoUrl } });
};
