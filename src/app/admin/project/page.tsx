"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { firestore } from "@/utils/firebaseConfig";
import AdminHubLoader from "@/components/AdminHubLoader";
import { Star, Home } from "lucide-react";

type Project = {
  id: string;
  title?: string;
  isHero?: boolean;
  showOnHome?: boolean;
  order?: number;
};

export default function AdminProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const q = query(
          collection(firestore, "projects"),
          orderBy("order", "asc")
        );

        const snap = await getDocs(q);

        if (!alive) return;

        setProjects(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as any),
          }))
        );
      } catch (err) {
        console.error("Failed to load projects:", err);
        setProjects([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  if (loading) return <AdminHubLoader />;

  return (
    <main className="bg-[--background] text-[--foreground]">
      <section className="container py-10 max-w-3xl space-y-6">
        <Link
          href="/admin/dashboard"
          className="text-sm text-[--muted] hover:underline"
        >
          ← Back to Dashboard
        </Link>

        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>

          <Link
            href="/admin/dashboard/projects/new"
            className="btn btn-primary"
          >
            + New Project
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-[--border] bg-[--surface] p-6 text-[--muted]">
            No projects yet.
          </div>
        ) : (
          <ul className="space-y-3">
            {projects.map((p) => (
              <li
                key={p.id}
                className="rounded-2xl border border-[--border] bg-[--surface] p-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="font-semibold truncate">
                    {p.title || "Untitled Project"}
                  </div>

                  <div className="mt-1 flex items-center gap-3 text-xs text-[--muted]">
                    {p.isHero && (
                      <span className="inline-flex items-center gap-1">
                        <Star size={14} /> Hero
                      </span>
                    )}
                    {p.showOnHome && (
                      <span className="inline-flex items-center gap-1">
                        <Home size={14} /> Homepage
                      </span>
                    )}
                    {!p.isHero && !p.showOnHome && (
                      <span>Gallery only</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href={`/admin/dashboard/projects/${p.id}/edit`}
                    className="btn btn-outline"
                  >
                    Edit
                  </Link>

                  <Link
                    href="/gallery"
                    className="btn btn-outline"
                  >
                    View
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
