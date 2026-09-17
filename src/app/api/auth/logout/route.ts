import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth-server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Session terminated successfully.",
  });

  // Expire and clear auth cookie
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}
