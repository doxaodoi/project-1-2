import { redirect } from "next/navigation";
import { apiGet, ApiError } from "@/lib/api";
import { requireToken } from "@/lib/session";
import type { Option, LecturerCourseRow, LecturerTaRow } from "@/lib/types";
import AdminNav from "@/app/components/AdminNav";
import AssignmentsClient from "./AssignmentsClient";

export default async function AdminAssignmentsPage() {
  const token = requireToken();
  let lecturers: Option[];
  let courses: Option[];
  let tas: Option[];
  let lecturerCourse: LecturerCourseRow[];
  let lecturerTa: LecturerTaRow[];
  try {
    [lecturers, courses, tas, lecturerCourse, lecturerTa] = await Promise.all([
      apiGet<Option[]>("/api/admin/lecturers", token),
      apiGet<Option[]>("/api/admin/course-options", token),
      apiGet<Option[]>("/api/admin/tas", token),
      apiGet<LecturerCourseRow[]>("/api/admin/lecturer-course", token),
      apiGet<LecturerTaRow[]>("/api/admin/lecturer-ta", token),
    ]);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 401 || e.status === 403)) redirect("/login");
    throw e;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <AdminNav />
      <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        <h2 className="text-xl font-semibold text-slate-800">Lecturer &amp; TA Assignments</h2>
        <AssignmentsClient
          lecturers={lecturers}
          courses={courses}
          tas={tas}
          lecturerCourse={lecturerCourse}
          lecturerTa={lecturerTa}
        />
      </div>
    </main>
  );
}
