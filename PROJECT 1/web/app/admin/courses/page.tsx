import { redirect } from "next/navigation";
import { apiGet, ApiError } from "@/lib/api";
import { requireToken } from "@/lib/session";
import type { AdminCourse } from "@/lib/types";
import AdminNav from "@/app/components/AdminNav";
import CoursesClient from "./CoursesClient";

export default async function AdminCoursesPage() {
  const token = requireToken();
  let courses: AdminCourse[];
  try {
    courses = await apiGet<AdminCourse[]>("/api/admin/courses", token);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 401 || e.status === 403)) redirect("/login");
    throw e;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <AdminNav />
      <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
        <h2 className="text-xl font-semibold text-slate-800">Course Catalogue</h2>
        <CoursesClient courses={courses} />
      </div>
    </main>
  );
}
