import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE } from "@/lib/config";
import { apiGet, ApiError } from "@/lib/api";
import type { Me, Enrollment, Payment } from "@/lib/types";
import LogoutButton from "./LogoutButton";

const money = (n: number) =>
  new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(n);

export default async function DashboardPage() {
  const token = cookies().get(AUTH_COOKIE)?.value;
  if (!token) redirect("/login");

  let me: Me;
  let enrollments: Enrollment[];
  let payments: Payment[];

  try {
    me = await apiGet<Me>("/api/me", token);
    const id = me.student.studentId;
    [enrollments, payments] = await Promise.all([
      apiGet<Enrollment[]>(`/api/students/${id}/enrollments`, token),
      apiGet<Payment[]>(`/api/students/${id}/payments`, token),
    ]);
  } catch (e) {
    // Token expired/invalid, or the API is unreachable -> back to login.
    if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
      redirect("/login");
    }
    throw e;
  }

  const { student, outstanding } = me;

  return (
    <main className="min-h-screen">
      <header className="bg-brand text-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">CoE Department Portal</h1>
            <p className="text-xs text-white/70">Computer Engineering &middot; University of Ghana</p>
          </div>
          <LogoutButton />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        {/* Greeting + fee summary */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-1 rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-medium text-slate-500">Signed in as</h2>
            <p className="mt-1 text-lg font-semibold">{student.fullName}</p>
            <dl className="mt-3 space-y-1 text-sm text-slate-600">
              <div className="flex justify-between"><dt>Student ID</dt><dd className="font-medium">{student.studentId}</dd></div>
              <div className="flex justify-between"><dt>Email</dt><dd className="font-medium">{student.email}</dd></div>
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

        {/* Enrolled courses */}
        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-3">
            <h2 className="font-semibold">Enrolled Courses</h2>
          </div>
          {enrollments.length === 0 ? (
            <p className="px-5 py-6 text-sm text-slate-500">No course enrollments yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-500">
                  <tr>
                    <th className="px-5 py-2 font-medium">Code</th>
                    <th className="px-5 py-2 font-medium">Title</th>
                    <th className="px-5 py-2 font-medium">Credits</th>
                    <th className="px-5 py-2 font-medium">Lecturer</th>
                    <th className="px-5 py-2 font-medium">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {enrollments.map((c) => (
                    <tr key={c.courseCode}>
                      <td className="px-5 py-2 font-medium text-brand">{c.courseCode}</td>
                      <td className="px-5 py-2">{c.courseTitle}</td>
                      <td className="px-5 py-2">{c.creditHours}</td>
                      <td className="px-5 py-2">{c.lecturer || "—"}</td>
                      <td className="px-5 py-2">{c.grade ?? "In progress"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Payments */}
        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-3">
            <h2 className="font-semibold">Payment History</h2>
          </div>
          {payments.length === 0 ? (
            <p className="px-5 py-6 text-sm text-slate-500">No payments recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-500">
                  <tr>
                    <th className="px-5 py-2 font-medium">Date</th>
                    <th className="px-5 py-2 font-medium">Amount</th>
                    <th className="px-5 py-2 font-medium">Method</th>
                    <th className="px-5 py-2 font-medium">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((p) => (
                    <tr key={p.paymentId}>
                      <td className="px-5 py-2">{p.paidOn}</td>
                      <td className="px-5 py-2 font-medium">{money(p.amount)}</td>
                      <td className="px-5 py-2">{p.method}</td>
                      <td className="px-5 py-2 text-slate-500">{p.reference ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
