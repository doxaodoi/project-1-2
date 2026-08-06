"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/students", label: "Class & Fees" },
  { href: "/admin/assignments", label: "Assignments" },
  { href: "/admin/courses", label: "Courses" },
];

export default function AdminNav() {
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
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">CoE Admin Console</h1>
          <p className="text-xs text-white/70">Department of Computer Engineering &middot; University of Ghana</p>
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
        <div className="mx-auto max-w-6xl px-2 flex flex-wrap gap-1">
          {LINKS.map((l) => {
            const active = l.href === "/admin" ? pathname === l.href : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-2 text-sm font-medium border-b-2 transition ${
                  active ? "border-white text-white" : "border-transparent text-white/70 hover:text-white"
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
