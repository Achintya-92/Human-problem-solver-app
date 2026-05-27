import type { Request, Response } from "express";
import { z } from "zod";

import * as consultationService from "../services/consultationService";
import * as expertService from "../services/expertService";

export const bookConsultation = async (req: Request, res: Response) => {
  const userId = req.auth!.userId;
  const expertId = String(req.params.expertId);

  const data = consultationService.createConsultationSchema.parse(req.body);

  const consultation = await consultationService.bookConsultation(
    userId,
    expertId,
    data
  );

  return res.status(201).json({
    data: { consultation },
  });
};

export const getConsultation = async (req: Request, res: Response) => {
  const id = String(req.params.id);

  const consultation = await consultationService.getConsultation(id);

  if (!consultation) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: "Consultation not found",
      },
    });
  }

  if (
    consultation.userId !== req.auth!.userId &&
    consultation.expert.userId !== req.auth!.userId
  ) {
    return res.status(403).json({
      error: {
        code: "FORBIDDEN",
        message: "Unauthorized",
      },
    });
  }

  return res.json({
    data: { consultation },
  });
};

export const getMyConsultations = async (
  req: Request,
  res: Response
) => {
  const userId = req.auth!.userId;

  const query = z
    .object({
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(50).default(10),
    })
    .parse(req.query);

  const result = await consultationService.getUserConsultations(
    userId,
    query.page,
    query.limit
  );

  return res.json({
    data: result,
  });
};

export const getExpertConsultations = async (
  req: Request,
  res: Response
) => {
  const userId = req.auth!.userId;

  const expert = await expertService.getExpertProfile(userId);

  if (!expert) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: "Expert profile not found",
      },
    });
  }

  const query = z
    .object({
      status: z.string().optional(),
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(50).default(10),
    })
    .parse(req.query);

  const result =
    await consultationService.getExpertConsultations(
      expert.id,
      query.page,
      query.limit,
      query.status
    );

  return res.json({
    data: result,
  });
};

export const updateConsultation = async (
  req: Request,
  res: Response
) => {
  const id = String(req.params.id);
  const userId = req.auth!.userId;

  const consultation = await consultationService.getConsultation(id);

  if (!consultation) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: "Consultation not found",
      },
    });
  }

  if (consultation.expert.userId !== userId) {
    return res.status(403).json({
      error: {
        code: "FORBIDDEN",
        message: "Unauthorized",
      },
    });
  }

  const data = z
    .object({
      status: z.enum([
        "PENDING",
        "CONFIRMED",
        "COMPLETED",
        "CANCELLED",
      ]),
      duration: z.number().int().optional(),
      feedback: z.string().optional(),
      rating: z.number().min(1).max(5).optional(),
      meetingLink: z.string().url().optional(),
    })
    .parse(req.body);

  const updated =
    await consultationService.updateConsultationStatus(
      id,
      data.status,
      data
    );

  return res.json({
    data: { consultation: updated },
  });
};

export const cancelConsultation = async (
  req: Request,
  res: Response
) => {
  const id = String(req.params.id);
  const userId = req.auth!.userId;

  const consultation = await consultationService.getConsultation(id);

  if (!consultation) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: "Consultation not found",
      },
    });
  }

  if (consultation.userId !== userId) {
    return res.status(403).json({
      error: {
        code: "FORBIDDEN",
        message: "Unauthorized",
      },
    });
  }

  const updated =
    await consultationService.cancelConsultation(id);

  return res.json({
    data: { consultation: updated },
  });
};