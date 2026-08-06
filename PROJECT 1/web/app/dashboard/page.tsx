import Link from "next/link";
import { redirect } from "next/navigation";
import { apiGet, ApiError } from "@/lib/api";
import { requireToken } from "@/lib/session";
import type { Me } from "@/lib/types";
import Nav from "@/app/components/Nav";

const money = (n: number) =>
  new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(n);

const FEATURES = [
  { href: "/profile", title: "Personal Information", desc: "View and update your contact details.", icon: "👤" },
  { href: "/fees", title: "Fees & Payments", desc: "See your statement and make a payment.", icon: "💳" },
  { href: "/registration", title: "Course Registration", desc: "Register or drop courses this semester.", icon: "📝" },
  { href: "/grades", title: "Grades / Results", desc: "Your results for completed courses.", icon: "🎓" },
  { href: "/assignments", title: "Lecturers & TAs", desc: "Who teaches what, and TA assignments.", icon: "🧑‍🏫" },
];

export default async function DashboardPage() {
  const token = requireToken();

  let me: Me;
  try {
    me = await apiGet<Me>("/api/me", token);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 401 || e.status === 403)) redirect("/login");
    throw e;
  }
  const { student, outstanding } = me;

  return (
    <main className="min-h-screen bg-slate-50">
      <Nav studentName={student.fullName} />

      <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        <section className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-1 rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-medium text-slate-500">Signed in as</h2>
            <p className="mt-1 text-lg font-semibold">{student.fullName}</p>
            <dl className="mt-3 space-y-1 text-sm text-slate-600">
              <div className="flex justify-between"><dt>Student ID</dt><dd className="font-medium">{student.studentId}</dd></div>
              <div className="flex justify-between"><dt>Programme</dt><dd className="font-medium">{student.program}</dd></div>
              <div className="flex justify-between"><dt>Level</dt><dd className="font-medium">{student.level}</dd></div>
            </dl>
          </div>
          <div className="md:col-span-2 grid grid-cols-3 gap-4">
            <StatCard label="Total billed" value={money(outstanding.totalBilled)} tone="slate" />
            <StatCard label="Total paid" value={money(outstanding.totalPaid)} tone="green" />
            <StatCard label="Outstanding" value={money(outstanding.outstanding)} tone="amber" />
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">What would you like to do?</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <Link
                key={f.href}
                href={f.href}
                className="group rounded-xl border border-slate-200 bg-white p-5 hover:border-brand hover:shadow-sm transition"
              >
                <div className="text-2xl">{f.icon}</div>
                <h3 className="mt-2 font-semibold text-slate-800 group-hover:text-brand">{f.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{f.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string; tone: "slate" | "green" | "amber" }) {
  const tones: Record<string, string> = {
    slate: "border-slate-200 bg-white",
    green: "border-green-200 bg-green-50",
    amber: "border-amber-200 bg-amber-50",
  };
  return (
    <div className={`rounded-xl border p-5 ${tones[tone]}`}>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}
