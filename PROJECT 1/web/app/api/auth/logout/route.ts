import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/config";

// Clears the auth cookie.
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
