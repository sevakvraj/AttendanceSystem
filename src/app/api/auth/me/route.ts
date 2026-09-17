import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth-server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized: No active session." }, { status: 401 });
  }

  const user = await verifyAuthToken(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized: Invalid or expired session." }, { status: 401 });
  }

  return NextResponse.json({ user });
}
