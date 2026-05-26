import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "./env";

export type JwtPayload = {
  sub: string;
};

export function signAccessToken(userId: string) {
  const payload: JwtPayload = { sub: userId };
  const opts: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as any,
  };
  return jwt.sign(payload, env.JWT_SECRET, opts);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}

