import { Router } from "express";
import { getUserProfile } from "../controllers/userController";

export const userRoutes = Router();

userRoutes.get("/:idOrUsername", getUserProfile);

