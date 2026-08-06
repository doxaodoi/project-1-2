import { redirect } from "next/navigation";
import { apiGet, ApiError } from "@/lib/api";
import { requireToken } from "@/lib/session";
import type { Me, Enrollment } from "@/lib/types";
import Nav from "@/app/components/Nav";

// Indicative grade points (University of Ghana 4.0 scale).
const POINTS: Record<string, number> = {
  A: 4.0, "B+": 3.5, B: 3.0, "B-": 2.75, "C+": 2.5, C: 2.0, "D+": 1.5, D: 1.0, E: 0.5, F: 0.0,
};

export default async function GradesPage() {
  const token = requireToken();

  let me: Me;
  let grades: Enrollment[];
  try {
    me = await apiGet<Me>("/api/me", token);
    grades = await apiGet<Enrollment[]>("/api/me/grades", token);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 401 || e.status === 403)) redirect("/login");
    throw e;
  }

  let totalCredits = 0;
  let weighted = 0;
  for (const g of grades) {
    const pts = POINTS[g.grade ?? ""] ?? 0;
    totalCredits += g.creditHours;
    weighted += pts * g.creditHours;
  }
  const gpa = totalCredits > 0 ? (weighted / totalCredits).toFixed(2) : "—";

  return (
    <main className="min-h-screen bg-slate-50">
      <Nav studentName={me.student.fullName} />
      <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Grades / Results</h2>
            <p className="text-sm text-slate-500">Completed courses</p>
          </div>
          <div className="rounded-xl border border-brand/30 bg-brand/5 px-5 py-3 text-center">
            <p className="text-xs font-medium text-slate-500">Indicative GPA</p>
            <p className="text-2xl font-bold text-brand">{gpa}</p>
          </div>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white">
          {grades.length === 0 ? (
            <p className="px-5 py-6 text-sm text-slate-500">No results published yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-500">
                  <tr>
                    <th className="px-5 py-2 font-medium">Code</th>
                    <th className="px-5 py-2 font-medium">Title</th>
                    <th className="px-5 py-2 font-medium">Credits</th>
                    <th className="px-5 py-2 font-medium">Year</th>
                    <th className="px-5 py-2 font-medium">Sem</th>
                    <th className="px-5 py-2 font-medium">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {grades.map((g) => (
                    <tr key={`${g.courseCode}-${g.academicYear}-${g.semester}`}>
                      <td className="px-5 py-2 font-medium text-brand">{g.courseCode}</td>
                      <td className="px-5 py-2">{g.courseTitle}</td>
                      <td className="px-5 py-2">{g.creditHours}</td>
                      <td className="px-5 py-2">{g.academicYear}</td>
                      <td className="px-5 py-2">{g.semester}</td>
                      <td className="px-5 py-2 font-semibold">{g.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <p className="text-xs text-slate-400">GPA is indicative, computed from published grades on a 4.0 scale.</p>
      </div>
    </main>
  );
}
