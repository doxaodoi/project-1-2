import { redirect } from "next/navigation";
import { apiGet, ApiError } from "@/lib/api";
import { requireToken } from "@/lib/session";
import type { Me, Payment } from "@/lib/types";
import Nav from "@/app/components/Nav";
import PayForm from "./PayForm";

const money = (n: number) =>
  new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(n);

export default async function FeesPage() {
  const token = requireToken();

  let me: Me;
  let payments: Payment[];
  try {
    me = await apiGet<Me>("/api/me", token);
    payments = await apiGet<Payment[]>(`/api/students/${me.student.studentId}/payments`, token);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 401 || e.status === 403)) redirect("/login");
    throw e;
  }
  const { student, outstanding } = me;

  return (
    <main className="min-h-screen bg-slate-50">
      <Nav studentName={student.fullName} />
      <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
        <h2 className="text-xl font-semibold text-slate-800">Fees &amp; Payments</h2>

        <section className="grid grid-cols-3 gap-4">
          <StatCard label="Total billed" value={money(outstanding.totalBilled)} tone="slate" />
          <StatCard label="Total paid" value={money(outstanding.totalPaid)} tone="green" />
          <StatCard label="Outstanding" value={money(outstanding.outstanding)} tone="amber" />
        </section>

        <PayForm outstanding={outstanding.outstanding} />

        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-3">
            <h3 className="font-semibold">Payment History</h3>
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
