import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiSend, ApiError } from "@/lib/api";
import { AUTH_COOKIE } from "@/lib/config";

// Forwards a profile update to the API with the caller's cookie JWT (functionality 1).
export async function PUT(request: Request) {
  const token = cookies().get(AUTH_COOKIE)?.value;
  if (!token) return NextResponse.json({ message: "Not signed in" }, { status: 401 });
  try {
    const body = await request.json();
    const data = await apiSend("/api/me/profile", "PUT", token, body);
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof ApiError) return NextResponse.json({ message: e.message }, { status: e.status });
    return NextResponse.json({ message: "Unable to reach the API" }, { status: 502 });
  }
}
