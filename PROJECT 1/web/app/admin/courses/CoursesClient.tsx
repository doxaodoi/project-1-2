"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminCourse } from "@/lib/types";

export default function CoursesClient({ courses }: { courses: AdminCourse[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ code: "", title: "", creditHours: "3", level: "200", semester: "2" });
  const [status, setStatus] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code,
          title: form.title,
          creditHours: Number(form.creditHours),
          level: Number(form.level),
          semester: Number(form.semester),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message ?? "Could not add course");
      setStatus({ kind: "ok", msg: `Added ${data.code}.` });
      setForm({ ...form, code: "", title: "" });
      router.refresh();
    } catch (err) {
      setStatus({ kind: "err", msg: err instanceof Error ? err.message : "Could not add course" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Add a course</h3>
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          {status && (
            <div className={`rounded-md border px-3 py-2 text-sm ${status.kind === "ok" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
              {status.msg}
            </div>
          )}
          <div className="flex flex-wrap gap-4">
            <Field label="Code" width="w-32">
              <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="CPEN 220"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </Field>
            <Field label="Title" width="flex-1 min-w-56">
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Course title"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </Field>
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <Field label="Credits" width="w-24">
              <input type="number" min="1" max="6" value={form.creditHours} onChange={(e) => setForm({ ...form, creditHours: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </Field>
            <Field label="Level" width="w-28">
              <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                {["100", "200", "300", "400"].map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Semester" width="w-28">
              <select value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </Field>
            <button disabled={busy} className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-light disabled:opacity-60">
              {busy ? "Adding..." : "Add course"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-5 py-2 font-medium">Code</th>
              <th className="px-5 py-2 font-medium">Title</th>
              <th className="px-5 py-2 font-medium">Credits</th>
              <th className="px-5 py-2 font-medium">Level</th>
              <th className="px-5 py-2 font-medium">Sem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {courses.map((c) => (
              <tr key={c.courseId}>
                <td className="px-5 py-2 font-medium text-brand">{c.code}</td>
                <td className="px-5 py-2">{c.title}</td>
                <td className="px-5 py-2">{c.creditHours}</td>
                <td className="px-5 py-2">{c.level}</td>
                <td className="px-5 py-2">{c.semester}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Field({ label, width, children }: { label: string; width: string; children: React.ReactNode }) {
  return (
    <div className={width}>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      {children}
    </div>
  );
}
