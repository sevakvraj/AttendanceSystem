import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth-server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;

  // 1. Protect Admin Routes (/admin, /admin/*)
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyAuthToken(token);
    if (!payload || payload.role !== "admin") {
      // Invalid token or non-admin role trying to access admin
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("error", "unauthorized_admin");
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // 2. Protect Student Routes (/student, /student/*, /memories, /credits)
  if (
    pathname.startsWith("/student") ||
    pathname.startsWith("/memories") ||
    pathname.startsWith("/credits")
  ) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyAuthToken(token);
    if (!payload) {
      // Invalid or expired token
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("error", "session_expired");
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // 3. Login Page (/login) - Redirect if already authenticated
  if (pathname === "/login") {
    if (token) {
      const payload = await verifyAuthToken(token);
      if (payload) {
        if (payload.role === "admin") {
          return NextResponse.redirect(new URL("/admin", req.url));
        } else {
          return NextResponse.redirect(new URL("/student", req.url));
        }
      }
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/student/:path*",
    "/memories/:path*",
    "/credits/:path*",
    "/login",
  ],
};
