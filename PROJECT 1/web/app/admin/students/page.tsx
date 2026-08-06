import { redirect } from "next/navigation";
import { apiGet, ApiError } from "@/lib/api";
import { requireToken } from "@/lib/session";
import type { AdminStudent } from "@/lib/types";
import AdminNav from "@/app/components/AdminNav";

const money = (n: number) =>
  new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(n);

export default async function AdminStudentsPage() {
  const token = requireToken();
  let students: AdminStudent[];
  try {
    students = await apiGet<AdminStudent[]>("/api/admin/students", token);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 401 || e.status === 403)) redirect("/login");
    throw e;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <AdminNav />
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Class &amp; Fees</h2>
          <p className="text-sm text-slate-500">
            {students.length} students · balances from the <code>get_outstanding_fees()</code> database function.
          </p>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-2 font-medium">Student ID</th>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium text-right">Billed</th>
                <th className="px-4 py-2 font-medium text-right">Paid</th>
                <th className="px-4 py-2 font-medium text-right">Outstanding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((s) => (
                <tr key={s.studentId}>
                  <td className="px-4 py-2 font-medium text-brand">{s.studentId}</td>
                  <td className="px-4 py-2">{s.fullName}</td>
                  <td className="px-4 py-2 text-slate-500">{s.email}</td>
                  <td className="px-4 py-2 text-right">{money(s.totalBilled)}</td>
                  <td className="px-4 py-2 text-right">{money(s.totalPaid)}</td>
                  <td className={`px-4 py-2 text-right font-semibold ${s.outstanding > 0 ? "text-amber-700" : "text-green-700"}`}>
                    {money(s.outstanding)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}
