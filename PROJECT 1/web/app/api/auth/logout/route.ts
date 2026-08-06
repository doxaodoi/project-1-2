import { NextResponse } from "next/server";
import { AUTH_COOKIE, ROLE_COOKIE } from "@/lib/config";

// Clears the auth + role cookies.
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  res.cookies.set(ROLE_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
