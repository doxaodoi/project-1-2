import { redirect } from "next/navigation";
import { apiGet, ApiError } from "@/lib/api";
import { requireToken } from "@/lib/session";
import type { Me, Course } from "@/lib/types";
import Nav from "@/app/components/Nav";
import RegistrationClient from "./RegistrationClient";

export default async function RegistrationPage() {
  const token = requireToken();

  let me: Me;
  let registered: Course[];
  let available: Course[];
  try {
    me = await apiGet<Me>("/api/me", token);
    [registered, available] = await Promise.all([
      apiGet<Course[]>("/api/me/registrations", token),
      apiGet<Course[]>("/api/me/available-courses", token),
    ]);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 401 || e.status === 403)) redirect("/login");
    throw e;
  }

  const term = registered[0]?.academicYear ?? available[0]?.academicYear ?? "2025/2026";

  return (
    <main className="min-h-screen bg-slate-50">
      <Nav studentName={me.student.fullName} />
      <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Course Registration</h2>
          <p className="text-sm text-slate-500">Second Semester, {term}</p>
        </div>
        <RegistrationClient registered={registered} available={available} />
      </div>
    </main>
  );
}
