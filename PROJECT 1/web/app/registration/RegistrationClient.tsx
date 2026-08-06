"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Course } from "@/lib/types";

export default function RegistrationClient({
  registered,
  available,
}: {
  registered: Course[];
  available: Course[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function act(courseId: number, action: "add" | "drop") {
    setBusy(courseId);
    setError(null);
    try {
      const res =
        action === "add"
          ? await fetch("/api/me/enrollments", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ courseId }),
            })
          : await fetch(`/api/me/enrollments?courseId=${courseId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? "Action failed");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusy(null);
    }
  }

  const credits = registered.reduce((sum, c) => sum + c.creditHours, 0);

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <h3 className="font-semibold">Registered courses</h3>
          <span className="text-sm text-slate-500">{registered.length} course(s) · {credits} credits</span>
        </div>
        <CourseTable
          courses={registered}
          empty="You have not registered for any course this semester."
          action={(c) => (
            <button
              onClick={() => act(c.courseId, "drop")}
              disabled={busy === c.courseId}
              className="rounded-md border border-red-200 bg-red-50 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-60"
            >
              {busy === c.courseId ? "..." : "Drop"}
            </button>
          )}
        />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-3">
          <h3 className="font-semibold">Available courses</h3>
        </div>
        <CourseTable
          courses={available}
          empty="No more courses available to register this semester."
          action={(c) => (
            <button
              onClick={() => act(c.courseId, "add")}
              disabled={busy === c.courseId}
              className="rounded-md bg-brand px-3 py-1 text-sm font-medium text-white hover:bg-brand-light disabled:opacity-60"
            >
              {busy === c.courseId ? "..." : "Register"}
            </button>
          )}
        />
      </section>
    </div>
  );
}

function CourseTable({
  courses,
  empty,
  action,
}: {
  courses: Course[];
  empty: string;
  action: (c: Course) => React.ReactNode;
}) {
  if (courses.length === 0) return <p className="px-5 py-6 text-sm text-slate-500">{empty}</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-500">
          <tr>
            <th className="px-5 py-2 font-medium">Code</th>
            <th className="px-5 py-2 font-medium">Title</th>
            <th className="px-5 py-2 font-medium">Credits</th>
            <th className="px-5 py-2 font-medium">Lecturer</th>
            <th className="px-5 py-2 font-medium text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {courses.map((c) => (
            <tr key={c.courseId}>
              <td className="px-5 py-2 font-medium text-brand">{c.courseCode}</td>
              <td className="px-5 py-2">{c.courseTitle}</td>
              <td className="px-5 py-2">{c.creditHours}</td>
              <td className="px-5 py-2">{c.lecturer || "—"}</td>
              <td className="px-5 py-2 text-right">{action(c)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
