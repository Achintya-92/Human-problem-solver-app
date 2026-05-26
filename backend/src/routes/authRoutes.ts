import { Router } from "express";
import { z } from "zod";
import { login, logout, me, signup } from "../controllers/authController";
import { requireAuth } from "../middleware/requireAuth";
import { validateBody } from "../middleware/validate";

export const authRoutes = Router();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(80),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRoutes.post("/signup", validateBody(signupSchema), signup);
authRoutes.post("/login", validateBody(loginSchema), login);
authRoutes.post("/logout", logout);
authRoutes.get("/me", requireAuth, me);

