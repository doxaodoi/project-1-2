import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiSend, ApiError } from "@/lib/api";
import { AUTH_COOKIE } from "@/lib/config";

const token = () => cookies().get(AUTH_COOKIE)?.value;

// Assign a lecturer to a course (functionality 4).
export async function POST(request: Request) {
  const t = token();
  if (!t) return NextResponse.json({ message: "Not signed in" }, { status: 401 });
  try {
    const body = await request.json();
    return NextResponse.json(await apiSend("/api/admin/lecturer-course", "POST", t, body));
  } catch (e) {
    if (e instanceof ApiError) return NextResponse.json({ message: e.message }, { status: e.status });
    return NextResponse.json({ message: "Unable to reach the API" }, { status: 502 });
  }
}

// Remove an assignment: DELETE ?assignmentId=NN.
export async function DELETE(request: Request) {
  const t = token();
  if (!t) return NextResponse.json({ message: "Not signed in" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("assignmentId");
  if (!id) return NextResponse.json({ message: "assignmentId is required" }, { status: 400 });
  try {
    return NextResponse.json(await apiSend(`/api/admin/lecturer-course/${id}`, "DELETE", t));
  } catch (e) {
    if (e instanceof ApiError) return NextResponse.json({ message: e.message }, { status: e.status });
    return NextResponse.json({ message: "Unable to reach the API" }, { status: 502 });
  }
}
