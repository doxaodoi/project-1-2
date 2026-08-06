import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = process.env.AUTH_COOKIE ?? "coe_token";
const ROLE_COOKIE = process.env.ROLE_COOKIE ?? "coe_role";

const STUDENT_PREFIXES = ["/dashboard", "/profile", "/fees", "/registration", "/grades", "/assignments"];

// Guards the portal: unauthenticated -> login; then keeps students and admins in their own area.
export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const role = request.cookies.get(ROLE_COOKIE)?.value;
  const path = request.nextUrl.pathname;

  // Admin-only area.
  if (path.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  // Student area: send admins to their console.
  if (role === "ADMIN" && STUDENT_PREFIXES.some((p) => path.startsWith(p))) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/fees/:path*",
    "/registration/:path*",
    "/grades/:path*",
    "/assignments/:path*",
    "/admin/:path*",
  ],
};
