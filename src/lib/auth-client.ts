"use client";

export interface SessionUser {
  pid: string;
  name: string;
  role: "admin" | "student";
  email?: string;
  phone?: string;
}

/**
 * Terminate user session completely:
 * 1. Calls /api/auth/logout to clear the HTTP-only auth_token cookie
 * 2. Clears browser localStorage and sessionStorage
 * 3. Hard-navigates to /login to flush router state and memory
 */
export async function logout(): Promise<void> {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
  } catch (err) {
    console.error("Logout API call failed:", err);
  } finally {
    if (typeof window !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace("/login");
    }
  }
}

/**
 * Fetches the verified user session from the server
 */
export async function fetchCurrentSession(): Promise<SessionUser | null> {
  try {
    const res = await fetch("/api/auth/me", {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.user || null;
  } catch (err) {
    console.error("Failed to fetch current session:", err);
    return null;
  }
}
