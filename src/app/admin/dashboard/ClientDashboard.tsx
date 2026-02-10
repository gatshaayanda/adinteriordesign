"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  LayoutGrid,
  PanelsTopLeft,
  Sofa,
  Home as HomeIcon,
  Sparkles,
  Images,
  LogOut,
  Wrench,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    router.replace("/admin/login");
  };

  const sections = useMemo(
    () => [
      {
        title: "Projects (Featured Work)",
        desc: "Manage homepage hero + featured work cards (Firestore: projects).",
        icon: <Images size={22} />,
        href: "/admin/dashboard/projects",
      },
      {
        title: "Services (Categories)",
        desc: "Manage service items used by /c/[category] routing (Firestore: services).",
        icon: <LayoutGrid size={22} />,
        href: "/admin/dashboard/services",
      },
      {
        title: "TV Stands / Wall Units",
        desc: "Jump straight into the TV stands category (/c/tv-stands).",
        icon: <PanelsTopLeft size={22} />,
        href: "/c/tv-stands",
      },
      {
        title: "Wall Panels (Slats / Marble)",
        desc: "Jump straight into wall panels category (/c/wall-panels).",
        icon: <PanelsTopLeft size={22} />,
        href: "/c/wall-panels",
      },
      {
        title: "Wardrobes / Closets",
        desc: "Jump straight into wardrobes category (/c/wardrobes).",
        icon: <Sofa size={22} />,
        href: "/c/wardrobes",
      },
      {
        title: "Kitchens & Cabinets",
        desc: "Jump straight into kitchens category (/c/kitchens).",
        icon: <HomeIcon size={22} />,
        href: "/c/kitchens",
      },
      {
        title: "Ceilings & Bulkheads",
        desc: "Jump straight into ceilings category (/c/ceilings).",
        icon: <Sparkles size={22} />,
        href: "/c/ceilings",
      },
      {
        title: "Doors & Finishes",
        desc: "Jump straight into doors category (/c/doors).",
        icon: <Wrench size={22} />,
        href: "/c/doors",
      },
    ],
    []
  );

  return (
    <main className="min-h-screen bg-[--background] text-[--foreground] px-6 py-12">
      {/* Header */}
      <header className="flex items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            AD Interior Design — Admin
          </h1>
          <p className="text-sm text-[--muted] mt-1">
            Manage projects + services without breaking the site styling.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="btn btn-outline"
          style={{
            borderColor: "rgba(239,68,68,0.35)",
            background: "rgba(239,68,68,0.08)",
            color: "rgba(239,68,68,0.95)",
          }}
        >
          <LogOut size={18} /> Logout
        </button>
      </header>

      {/* Sections */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((s) => (
          <button
            key={s.title}
            type="button"
            onClick={() => router.push(s.href)}
            className="p-6 rounded-2xl text-left border border-[--border] bg-[--surface] hover:bg-[--surface-2] transition shadow-[var(--shadow)]"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="grid place-items-center h-10 w-10 rounded-xl border border-[--border] bg-[--surface-2] text-[--brand-secondary]">
                {s.icon}
              </span>
              <h2 className="text-lg font-extrabold text-[--foreground]">
                {s.title}
              </h2>
            </div>

            <p className="text-sm text-[--muted] leading-relaxed">{s.desc}</p>

            <div className="mt-4 text-sm font-extrabold text-[--brand-primary]">
              Open →
            </div>
          </button>
        ))}
      </section>

      {/* Metrics (placeholders; wiring stays yours) */}
      <section className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          ["Projects", "—"],
          ["Services", "—"],
          ["Featured", "—"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="border border-[--border] bg-[--surface] p-5 rounded-2xl text-center shadow-[var(--shadow)]"
          >
            <div className="text-xs uppercase text-[--muted] tracking-wide">
              {label}
            </div>
            <div className="text-3xl font-extrabold text-[--foreground] mt-1">
              {value}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
