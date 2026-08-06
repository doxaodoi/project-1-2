"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Option, LecturerCourseRow, LecturerTaRow } from "@/lib/types";

export default function AssignmentsClient({
  lecturers,
  courses,
  tas,
  lecturerCourse,
  lecturerTa,
}: {
  lecturers: Option[];
  courses: Option[];
  tas: Option[];
  lecturerCourse: LecturerCourseRow[];
  lecturerTa: LecturerTaRow[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // lecturer -> course form
  const [lc, setLc] = useState({ lecturerId: "", courseId: "", semester: "2" });
  // lecturer -> TA form
  const [lt, setLt] = useState({ lecturerId: "", taId: "", courseId: "" });

  async function send(url: string, options: RequestInit) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? "Action failed");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }

  const assignCourse = (e: React.FormEvent) => {
    e.preventDefault();
    send("/api/admin/lecturer-course", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lecturerId: Number(lc.lecturerId),
        courseId: Number(lc.courseId),
        academicYear: "2025/2026",
        semester: Number(lc.semester),
      }),
    });
  };

  const assignTa = (e: React.FormEvent) => {
    e.preventDefault();
    send("/api/admin/lecturer-ta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lecturerId: Number(lt.lecturerId),
        taId: Number(lt.taId),
        courseId: Number(lt.courseId),
        academicYear: "2025/2026",
      }),
    });
  };

  return (
    <div className="space-y-8">
      {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      {/* Lecturer -> Course */}
      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-3"><h3 className="font-semibold">Lecturer → Course (functionality 4)</h3></div>
        <form onSubmit={assignCourse} className="flex flex-wrap items-end gap-3 px-5 py-4">
          <Field label="Lecturer">
            <Select value={lc.lecturerId} onChange={(v) => setLc({ ...lc, lecturerId: v })} options={lecturers} placeholder="Select lecturer" />
          </Field>
          <Field label="Course">
            <Select value={lc.courseId} onChange={(v) => setLc({ ...lc, courseId: v })} options={courses} placeholder="Select course" />
          </Field>
          <Field label="Semester">
            <select value={lc.semester} onChange={(e) => setLc({ ...lc, semester: e.target.value })}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </Field>
          <button disabled={busy} className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-light disabled:opacity-60">Assign</button>
        </form>
        <AssignTable
          head={["Course", "Title", "Lecturer", "Sem", ""]}
          rows={lecturerCourse.map((a) => [a.courseCode, a.courseTitle, a.lecturer, String(a.semester),
            <RemoveButton key={a.assignmentId} onClick={() => send(`/api/admin/lecturer-course?assignmentId=${a.assignmentId}`, { method: "DELETE" })} disabled={busy} />])}
          empty="No lecturer-course assignments yet."
        />
      </section>

      {/* Lecturer -> TA */}
      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-3"><h3 className="font-semibold">Lecturer → Teaching Assistant (functionality 5)</h3></div>
        <form onSubmit={assignTa} className="flex flex-wrap items-end gap-3 px-5 py-4">
          <Field label="Lecturer">
            <Select value={lt.lecturerId} onChange={(v) => setLt({ ...lt, lecturerId: v })} options={lecturers} placeholder="Select lecturer" />
          </Field>
          <Field label="Teaching Assistant">
            <Select value={lt.taId} onChange={(v) => setLt({ ...lt, taId: v })} options={tas} placeholder="Select TA" />
          </Field>
          <Field label="Course">
            <Select value={lt.courseId} onChange={(v) => setLt({ ...lt, courseId: v })} options={courses} placeholder="Select course" />
          </Field>
          <button disabled={busy} className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-light disabled:opacity-60">Assign</button>
        </form>
        <AssignTable
          head={["Lecturer", "TA", "Course", ""]}
          rows={lecturerTa.map((a) => [a.lecturer, a.ta, a.courseCode,
            <RemoveButton key={a.assignmentId} onClick={() => send(`/api/admin/lecturer-ta?assignmentId=${a.assignmentId}`, { method: "DELETE" })} disabled={busy} />])}
          empty="No lecturer-TA assignments yet."
        />
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

function Select({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: Option[]; placeholder: string }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} required
      className="min-w-48 rounded-md border border-slate-300 px-3 py-2 text-sm">
      <option value="" disabled>{placeholder}</option>
      {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
    </select>
  );
}

function RemoveButton({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="rounded-md border border-red-200 bg-red-50 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-60">
      Remove
    </button>
  );
}

function AssignTable({ head, rows, empty }: { head: string[]; rows: React.ReactNode[][]; empty: string }) {
  if (rows.length === 0) return <p className="px-5 py-5 text-sm text-slate-500">{empty}</p>;
  return (
    <div className="overflow-x-auto border-t border-slate-100">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-500">
          <tr>{head.map((h, i) => <th key={i} className={`px-5 py-2 font-medium ${i === head.length - 1 ? "text-right" : ""}`}>{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r, i) => (
            <tr key={i}>{r.map((cell, j) => <td key={j} className={`px-5 py-2 ${j === r.length - 1 ? "text-right" : ""}`}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
