import { redirect } from "next/navigation";
import { apiGet, ApiError } from "@/lib/api";
import { requireToken } from "@/lib/session";
import type { Me, LecturerCourse, LecturerTa } from "@/lib/types";
import Nav from "@/app/components/Nav";

export default async function AssignmentsPage() {
  const token = requireToken();

  let me: Me;
  let lecturerCourse: LecturerCourse[];
  let lecturerTa: LecturerTa[];
  try {
    me = await apiGet<Me>("/api/me", token);
    [lecturerCourse, lecturerTa] = await Promise.all([
      apiGet<LecturerCourse[]>("/api/assignments/lecturer-course", token),
      apiGet<LecturerTa[]>("/api/assignments/lecturer-ta", token),
    ]);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 401 || e.status === 403)) redirect("/login");
    throw e;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Nav studentName={me.student.fullName} />
      <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
        <h2 className="text-xl font-semibold text-slate-800">Lecturers &amp; Teaching Assistants</h2>

        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-3">
            <h3 className="font-semibold">Lecturer → Course assignments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-5 py-2 font-medium">Course</th>
                  <th className="px-5 py-2 font-medium">Title</th>
                  <th className="px-5 py-2 font-medium">Lecturer</th>
                  <th className="px-5 py-2 font-medium">Year</th>
                  <th className="px-5 py-2 font-medium">Sem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lecturerCourse.map((a, i) => (
                  <tr key={i}>
                    <td className="px-5 py-2 font-medium text-brand">{a.courseCode}</td>
                    <td className="px-5 py-2">{a.courseTitle}</td>
                    <td className="px-5 py-2">{a.lecturer}</td>
                    <td className="px-5 py-2">{a.academicYear}</td>
                    <td className="px-5 py-2">{a.semester}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-3">
            <h3 className="font-semibold">Lecturer → Teaching Assistant assignments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-5 py-2 font-medium">Lecturer</th>
                  <th className="px-5 py-2 font-medium">Teaching Assistant</th>
                  <th className="px-5 py-2 font-medium">Course</th>
                  <th className="px-5 py-2 font-medium">Year</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lecturerTa.map((a, i) => (
                  <tr key={i}>
                    <td className="px-5 py-2">{a.lecturer}</td>
                    <td className="px-5 py-2 font-medium">{a.ta}</td>
                    <td className="px-5 py-2 text-brand">{a.courseCode}</td>
                    <td className="px-5 py-2">{a.academicYear}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
