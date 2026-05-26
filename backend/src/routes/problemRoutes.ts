import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { create, detail, listFeed, postSolution, voteSolution } from "../controllers/problemController";

export const problemRoutes = Router();

problemRoutes.get("/", listFeed);
problemRoutes.get("/:id", detail);
problemRoutes.post("/", requireAuth, create);
problemRoutes.post("/:id/solutions", requireAuth, postSolution);
problemRoutes.post("/solutions/:solutionId/votes", requireAuth, voteSolution);

