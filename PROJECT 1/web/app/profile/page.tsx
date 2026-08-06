import { redirect } from "next/navigation";
import { apiGet, ApiError } from "@/lib/api";
import { requireToken } from "@/lib/session";
import type { Me } from "@/lib/types";
import Nav from "@/app/components/Nav";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const token = requireToken();

  let me: Me;
  try {
    me = await apiGet<Me>("/api/me", token);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 401 || e.status === 403)) redirect("/login");
    throw e;
  }
  const { student } = me;

  return (
    <main className="min-h-screen bg-slate-50">
      <Nav studentName={student.fullName} />
      <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        <h2 className="text-xl font-semibold text-slate-800">Personal Information</h2>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Read-only details</h3>
          <dl className="mt-3 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            <Row label="Full name" value={student.fullName} />
            <Row label="Student ID" value={String(student.studentId)} />
            <Row label="Programme" value={student.program} />
            <Row label="Level" value={String(student.level)} />
            <Row label="Date of birth" value={student.dateOfBirth ?? "—"} />
          </dl>
        </section>

        <ProfileForm email={student.email} phone={student.phone ?? ""} />
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-slate-100 py-1.5">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-800">{value}</dd>
    </div>
  );
}
