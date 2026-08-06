import Link from "next/link";
import { redirect } from "next/navigation";
import { apiGet, ApiError } from "@/lib/api";
import { requireToken } from "@/lib/session";
import type { AdminStudent, LecturerCourseRow, AdminCourse } from "@/lib/types";
import AdminNav from "@/app/components/AdminNav";
import { IconUsers, IconClipboard, IconBook } from "@/app/components/icons";

const money = (n: number) =>
  new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(n);

export default async function AdminHome() {
  const token = requireToken();
  let students: AdminStudent[];
  let assignments: LecturerCourseRow[];
  let courses: AdminCourse[];
  try {
    [students, assignments, courses] = await Promise.all([
      apiGet<AdminStudent[]>("/api/admin/students", token),
      apiGet<LecturerCourseRow[]>("/api/admin/lecturer-course", token),
      apiGet<AdminCourse[]>("/api/admin/courses", token),
    ]);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 401 || e.status === 403)) redirect("/login");
    throw e;
  }

  const totalOutstanding = students.reduce((s, x) => s + x.outstanding, 0);
  const owing = students.filter((s) => s.outstanding > 0).length;

  const cards = [
    { href: "/admin/students", title: "Class & Fees", desc: "Roster and every student's outstanding balance.", Icon: IconUsers },
    { href: "/admin/assignments", title: "Assignments", desc: "Assign lecturers to courses and TAs to lecturers.", Icon: IconClipboard },
    { href: "/admin/courses", title: "Courses", desc: "Add courses to the catalogue.", Icon: IconBook },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <AdminNav />
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <h2 className="text-xl font-semibold text-slate-800">Department Overview</h2>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Students" value={String(students.length)} />
          <Stat label="Courses" value={String(courses.length)} />
          <Stat label="Students owing" value={String(owing)} tone="amber" />
          <Stat label="Total outstanding" value={money(totalOutstanding)} tone="amber" />
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <Link key={c.href} href={c.href}
              className="group rounded-xl border border-slate-200 bg-white p-5 hover:border-brand hover:shadow-sm transition">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white transition">
                <c.Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-semibold text-slate-800 group-hover:text-brand">{c.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{c.desc}</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value, tone = "slate" }: { label: string; value: string; tone?: "slate" | "amber" }) {
  const tones = { slate: "border-slate-200 bg-white", amber: "border-amber-200 bg-amber-50" };
  return (
    <div className={`rounded-xl border p-5 ${tones[tone]}`}>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-800">{value}</p>
    </div>
  );
}
