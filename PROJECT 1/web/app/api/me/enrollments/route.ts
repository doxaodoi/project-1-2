import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiSend, ApiError } from "@/lib/api";
import { AUTH_COOKIE } from "@/lib/config";

function token() {
  return cookies().get(AUTH_COOKIE)?.value;
}

// Register for a current-term course (functionality 3): POST { courseId }.
export async function POST(request: Request) {
  const t = token();
  if (!t) return NextResponse.json({ message: "Not signed in" }, { status: 401 });
  try {
    const body = await request.json();
    const data = await apiSend("/api/me/enrollments", "POST", t, body);
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof ApiError) return NextResponse.json({ message: e.message }, { status: e.status });
    return NextResponse.json({ message: "Unable to reach the API" }, { status: 502 });
  }
}

// Drop a current-term course (functionality 3): DELETE ?courseId=NN.
export async function DELETE(request: Request) {
  const t = token();
  if (!t) return NextResponse.json({ message: "Not signed in" }, { status: 401 });
  const courseId = new URL(request.url).searchParams.get("courseId");
  if (!courseId) return NextResponse.json({ message: "courseId is required" }, { status: 400 });
  try {
    const data = await apiSend(`/api/me/enrollments/${courseId}`, "DELETE", t);
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof ApiError) return NextResponse.json({ message: e.message }, { status: e.status });
    return NextResponse.json({ message: "Unable to reach the API" }, { status: 502 });
  }
}
