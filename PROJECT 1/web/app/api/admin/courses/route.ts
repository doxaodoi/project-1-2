import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiSend, ApiError } from "@/lib/api";
import { AUTH_COOKIE } from "@/lib/config";

// Add a course to the catalogue (admin).
export async function POST(request: Request) {
  const t = cookies().get(AUTH_COOKIE)?.value;
  if (!t) return NextResponse.json({ message: "Not signed in" }, { status: 401 });
  try {
    const body = await request.json();
    return NextResponse.json(await apiSend("/api/admin/courses", "POST", t, body));
  } catch (e) {
    if (e instanceof ApiError) return NextResponse.json({ message: e.message }, { status: e.status });
    return NextResponse.json({ message: "Unable to reach the API" }, { status: 502 });
  }
}
