"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const money = (n: number) =>
  new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(n);

export default function PayForm({ outstanding }: { outstanding: number }) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("BANK");
  const [status, setStatus] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const paidUp = outstanding <= 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/me/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount), method }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message ?? "Payment failed");
      setStatus({ kind: "ok", msg: `Payment of ${money(Number(amount))} recorded (ref ${data.reference}).` });
      setAmount("");
      router.refresh();
    } catch (err) {
      setStatus({ kind: "err", msg: err instanceof Error ? err.message : "Payment failed" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Make a payment</h3>

      {paidUp ? (
        <p className="mt-3 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          Your fees are fully paid — nothing outstanding.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 flex flex-wrap items-end gap-4">
          {status && (
            <div
              className={`w-full rounded-md border px-3 py-2 text-sm ${
                status.kind === "ok"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {status.msg}
            </div>
          )}

          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-1">Amount (GHS)</label>
            <input
              id="amount"
              type="number"
              min="1"
              max={outstanding}
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`up to ${outstanding.toFixed(2)}`}
              className="w-44 rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-light"
            />
          </div>

          <div>
            <label htmlFor="method" className="block text-sm font-medium mb-1">Method</label>
            <select
              id="method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-light"
            >
              <option value="BANK">Bank</option>
              <option value="MOMO">Mobile Money</option>
              <option value="CARD">Card</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-light disabled:opacity-60"
          >
            {saving ? "Processing..." : "Pay now"}
          </button>
        </form>
      )}
    </section>
  );
}
