import { Router } from "express";
import { listCategories } from "../controllers/categoryController";

export const categoryRoutes = Router();

categoryRoutes.get("/", listCategories);

