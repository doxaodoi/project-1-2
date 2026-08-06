import { NextResponse } from "next/server";
import { apiPost, ApiError } from "@/lib/api";
import { AUTH_COOKIE, ROLE_COOKIE } from "@/lib/config";
import type { AuthResult } from "@/lib/types";

// Proxies login to the Spring Boot API and stores the returned JWT in an
// HttpOnly cookie so the browser never handles the raw token.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await apiPost<AuthResult>("/api/auth/login", body);

    const res = NextResponse.json({ role: result.role, displayName: result.displayName });
    res.cookies.set(AUTH_COOKIE, result.token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 2, // 2 hours, matches the API token expiry
    });
    // Non-sensitive cookie so the UI can branch student vs admin; the API still enforces the role.
    res.cookies.set(ROLE_COOKIE, result.role, { sameSite: "lax", path: "/", maxAge: 60 * 60 * 2 });
    return res;
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json({ message: e.message }, { status: e.status });
    }
    return NextResponse.json({ message: "Unable to reach the API" }, { status: 502 });
  }
}
