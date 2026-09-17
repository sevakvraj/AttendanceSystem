import { NextRequest, NextResponse } from "next/server";
import { findStudent } from "@/services/db";
import { signAuthToken, AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from "@/lib/auth-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const identifier = (body.identifier || "").trim();
    const password = (body.password || "").trim();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Please provide both PID/identifier and password." },
        { status: 400 }
      );
    }

    const user: any = await findStudent(identifier);

    if (!user) {
      return NextResponse.json(
        { error: "Account not found. Please enter a valid Student PID (e.g. MG26001)." },
        { status: 404 }
      );
    }

    const isPasswordMatch =
      user.password === password ||
      user.password?.toUpperCase() === password.toUpperCase();

    if (!isPasswordMatch) {
      return NextResponse.json(
        { error: "Invalid password. (Default is your Student PID, e.g. MG26001)" },
        { status: 401 }
      );
    }

    const isAdmin = user.pid?.toUpperCase() === "ADMIN001";
    const role: "admin" | "student" = isAdmin ? "admin" : "student";

    if (!isAdmin && user.isBlocked) {
      return NextResponse.json(
        { error: "Admin blocked you. Please contact your class representative / admin." },
        { status: 403 }
      );
    }

    const sessionPayload = {
      pid: user.pid,
      name: user.name || (isAdmin ? "Admin" : "Student"),
      role,
      email: user.email || "",
      phone: user.phone || "",
    };

    const token = await signAuthToken(sessionPayload);

    const response = NextResponse.json({
      success: true,
      role,
      user: sessionPayload,
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);

    return response;
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Internal server error during authentication." },
      { status: 500 }
    );
  }
}
