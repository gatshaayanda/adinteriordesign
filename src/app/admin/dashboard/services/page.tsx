"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { firestore } from "@/utils/firebaseConfig";
import { Plus, Trash2, Pencil, Tag, RefreshCw } from "lucide-react";
import { useSearchParams } from "next/navigation";

type ServiceItem = {
  id: string;
  title: string;
  category: string; // tv-stands | wall-panels | wardrobes | kitchens | ceilings | doors
  summary?: string;
  bullets?: string[];
  imageUrl?: string;
  active?: boolean;
  order?: number;
  featured?: boolean; // optional (if you want a tag)
  updatedAt?: any;
};

export default function AdminServicesPage() {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const cat = (searchParams.get("cat") || "").toLowerCase();

  const load = async () => {
    setLoading(true);
    try {
      // ✅ No orderBy -> no composite index requirements
      const snap = await getDocs(collection(firestore, "services"));
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      })) as ServiceItem[];

      // ✅ Client-side sort (stable + safe)
      const sorted = data.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
      setItems(sorted);
    } catch (e) {
      console.error("Admin services load failed:", e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (!cat) return items;
    if (cat === "inactive") return items.filter((s) => s.active === false);
    if (cat === "featured") return items.filter((s) => !!s.featured);
    return items.filter((s) => (s.category || "").toLowerCase() === cat);
  }, [items, cat]);

  const grouped = useMemo(() => {
    const map: Record<string, ServiceItem[]> = {};
    for (const s of filtered) {
      const k = (s.category || "other").toLowerCase();
      map[k] = map[k] || [];
      map[k].push(s);
    }
    return map;
  }, [filtered]);

  const onDelete = async (id: string) => {
    if (!confirm("Delete this service item?")) return;
    try {
      await deleteDoc(doc(firestore, "services", id));
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      console.error("Delete failed:", e);
      alert("Delete failed. Check console.");
    }
  };

  return (
    <main className="bg-[--background] text-[--foreground]">
      <section className="container py-10">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Services {cat ? `• ${cat}` : ""}
            </h1>
            <p className="text-sm text-[--muted] mt-1">
              Add, edit, and delete service items used by /c/[category].
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={load}
              className="btn btn-outline"
              aria-label="Refresh"
            >
              <RefreshCw size={18} />
              Refresh
            </button>

            <Link href="/admin/dashboard/services/new" className="btn btn-primary">
              <Plus size={18} /> New Service
            </Link>
          </div>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="rounded-2xl border border-[--border] bg-[--surface] p-8 shadow-[var(--shadow)]">
              Loading…
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-[--border] bg-[--surface] p-8 shadow-[var(--shadow)]">
              No services yet. Click “New Service”.
            </div>
          ) : (
            <div className="space-y-6">
              {Object.keys(grouped)
                .sort()
                .map((catKey) => (
                  <div
                    key={catKey}
                    className="rounded-2xl border border-[--border] bg-[--surface] overflow-hidden shadow-[var(--shadow)]"
                  >
                    <div className="px-5 py-4 border-b border-[--border] flex items-center justify-between gap-3">
                      <div className="font-extrabold capitalize">{catKey}</div>

                      <div className="text-xs text-[--muted]">
                        {grouped[catKey].length} item(s)
                      </div>
                    </div>

                    <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                      {grouped[catKey].map((s) => (
                        <div
                          key={s.id}
                          className="px-5 py-4 flex items-start justify-between gap-4"
                        >
                          <div className="min-w-0">
                            <div className="font-extrabold flex items-center gap-2 flex-wrap">
                              <span className="truncate">{s.title}</span>

                              {s.featured ? (
                                <span className="inline-flex items-center gap-1 text-xs font-extrabold px-2 py-0.5 rounded-full border border-[--border] bg-[--surface-2]">
                                  <Tag size={14} /> featured
                                </span>
                              ) : null}

                              {s.active === false ? (
                                <span className="text-xs font-extrabold px-2 py-0.5 rounded-full border border-[--border] bg-[--surface-2]">
                                  inactive
                                </span>
                              ) : null}
                            </div>

                            {s.summary ? (
                              <p className="text-sm text-[--muted] mt-1 leading-relaxed">
                                {s.summary}
                              </p>
                            ) : (
                              <p className="text-sm text-[--muted] mt-1 leading-relaxed">
                                No summary set.
                              </p>
                            )}

                            <div className="text-xs text-[--muted] mt-2">
                              Order: <b className="text-[--foreground]">{s.order ?? "—"}</b>
                              {s.imageUrl ? " • Image ✓" : " • Image —"}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <Link
                              href={`/admin/dashboard/services/${s.id}/edit`}
                              className="btn btn-outline"
                            >
                              <Pencil size={16} /> Edit
                            </Link>

                            <button
                              type="button"
                              onClick={() => onDelete(s.id)}
                              className="btn btn-outline"
                              style={{
                                borderColor: "rgba(239,68,68,0.35)",
                                background: "rgba(239,68,68,0.08)",
                                color: "rgba(239,68,68,0.95)",
                              }}
                            >
                              <Trash2 size={16} /> Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
