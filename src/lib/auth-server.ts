import { SignJWT, jwtVerify } from "jose";

export interface AuthTokenPayload {
  pid: string;
  name: string;
  role: "admin" | "student";
  email?: string;
  phone?: string;
}

export const AUTH_COOKIE_NAME = "auth_token";

// In production, configure JWT_SECRET in environment variables. Fallback provided for seamless setup.
const JWT_SECRET_STRING =
  process.env.JWT_SECRET || "mca-attendance-jwt-secret-key-2026-secure-session";
const JWT_SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STRING);

/**
 * Signs a JWT with user payload valid for 7 days
 */
export async function signAuthToken(payload: AuthTokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET_KEY);
}

/**
 * Verifies a JWT token string. Returns the payload or null if invalid / expired.
 */
export async function verifyAuthToken(token: string): Promise<AuthTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_KEY);
    return {
      pid: payload.pid as string,
      name: payload.name as string,
      role: payload.role as "admin" | "student",
      email: payload.email as string | undefined,
      phone: payload.phone as string | undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Cookie options for setting the authentication cookie
 */
export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
};
