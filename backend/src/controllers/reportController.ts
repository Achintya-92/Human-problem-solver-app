import type { Request, Response } from "express";
import * as reportService from "../services/reportService";

export const createReport = async (req: Request, res: Response) => {
  const userId = req.auth!.userId;
  const data = reportService.createReportSchema.parse(req.body);

  // Prevent self-reporting
  if (data.reportedUserId === userId) {
    return res.status(400).json({ error: { code: "BAD_REQUEST", message: "Cannot report yourself" } });
  }

  const report = await reportService.createReport(userId, data);
  return res.status(201).json({ data: { report } });
};

export const getReports = async (req: Request, res: Response) => {
  // Admin only
  const query = {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 10,
    status: req.query.status as string | undefined,
  };

  const result = await reportService.getReports(query.page, query.limit, query.status);
  return res.json({ data: result });
};

export const getReport = async (req: Request, res: Response) => {
  const { id } = req.params;
  const report = await reportService.getReport(id);

  if (!report) {
    return res.status(404).json({ error: { code: "NOT_FOUND", message: "Report not found" } });
  }

  return res.json({ data: { report } });
};

export const updateReportStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, resolution } = req.body;

  const updated = await reportService.updateReportStatus(id, status, resolution);
  return res.json({ data: { report: updated } });
};

export const getUserReports = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const reports = await reportService.getUserReports(userId);
  return res.json({ data: { reports } });
};
