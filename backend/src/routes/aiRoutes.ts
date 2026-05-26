import { Router } from "express";
import { emotionDetect, recommendations, semanticSearch, similarProblems, summarize } from "../controllers/aiController";

export const aiRoutes = Router();

aiRoutes.get("/similar-problems", similarProblems);
aiRoutes.get("/recommendations", recommendations);
aiRoutes.get("/semantic-search", semanticSearch);
aiRoutes.post("/summarize", summarize);
aiRoutes.post("/emotion-detect", emotionDetect);

