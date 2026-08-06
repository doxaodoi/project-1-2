"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Personal Info" },
  { href: "/fees", label: "Fees" },
  { href: "/registration", label: "Registration" },
  { href: "/grades", label: "Grades" },
  { href: "/assignments", label: "Assignments" },
];

export default function Nav({ studentName }: { studentName?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="bg-brand text-white">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">CoE Department Portal</h1>
          <p className="text-xs text-white/70">
            Computer Engineering &middot; University of Ghana
            {studentName ? ` · ${studentName}` : ""}
          </p>
        </div>
        <button
          onClick={logout}
          disabled={loading}
          className="rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20 disabled:opacity-60"
        >
          {loading ? "Signing out..." : "Sign out"}
        </button>
      </div>
      <nav className="bg-brand-light/95">
        <div className="mx-auto max-w-5xl px-2 flex flex-wrap gap-1">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-2 text-sm font-medium border-b-2 transition ${
                  active
                    ? "border-white text-white"
                    : "border-transparent text-white/70 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
