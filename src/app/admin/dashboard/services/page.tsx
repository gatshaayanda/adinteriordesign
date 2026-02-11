"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { firestore } from "@/utils/firebaseConfig";
import {
  Plus,
  Trash2,
  Pencil,
  RefreshCw,
  Tv,
  // If PanelsTopLeft errors in your lucide version, replace with: PanelTop
  PanelsTopLeft,
  Archive,
  ChefHat,
  Layers,
  DoorClosed,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

type Category =
  | "tv-stands"
  | "wall-panels"
  | "wardrobes"
  | "kitchens"
  | "ceilings"
  | "doors";

type Service = {
  id: string;
  name: string;
  category: Category | string;
  // Keep optional fields if your docs already have them
  description?: string;
  imageUrl?: string;
  updatedAt?: any;
};

const CAT_UI: Record<Category, { label: string; icon: React.ReactNode }> = {
  "tv-stands": { label: "TV Stands", icon: <Tv size={16} /> },
  "wall-panels": { label: "Wall Panels", icon: <PanelsTopLeft size={16} /> },
  wardrobes: { label: "Wardrobes", icon: <Archive size={16} /> },
  kitchens: { label: "Kitchens", icon: <ChefHat size={16} /> },
  ceilings: { label: "Ceilings", icon: <Layers size={16} /> },
  doors: { label: "Doors", icon: <DoorClosed size={16} /> },
};

function safeCat(x: string): Category | null {
  const v = (x || "").trim().toLowerCase();
  if (v === "tv-stands") return "tv-stands";
  if (v === "wall-panels") return "wall-panels";
  if (v === "wardrobes") return "wardrobes";
  if (v === "kitchens") return "kitchens";
  if (v === "ceilings") return "ceilings";
  if (v === "doors") return "doors";
  return null;
}

export default function AdminServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const rawCat = (searchParams.get("cat") || "").toLowerCase();
  const cat = safeCat(rawCat);

  const load = async () => {
    setLoading(true);
    try {
      // NOTE: orderBy(updatedAt) requires that field exists for all docs.
      // If some docs don't have updatedAt yet, add it or remove orderBy.
      const q = query(
        collection(firestore, "services"),
        orderBy("updatedAt", "desc")
      );
      const snap = await getDocs(q);
      setItems(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Service[]
      );
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
    return items.filter(
      (p) => (p.category || "").toLowerCase() === (cat as string)
    );
  }, [items, cat]);

  const grouped = useMemo(() => {
    const map: Record<string, Service[]> = {};
    for (const p of filtered) {
      const k = (p.category || "other").toLowerCase();
      map[k] = map[k] || [];
      map[k].push(p);
    }
    return map;
  }, [filtered]);

  const onDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    try {
      await deleteDoc(doc(firestore, "services", id));
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      console.error("Delete failed:", e);
      alert("Delete failed. Check console.");
    }
  };

  const pageTitle = cat ? `Services • ${CAT_UI[cat].label}` : "Services";

  return (
    <main className="bg-[--background] text-[--foreground]">
      <section className="container py-10">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 badge mb-3">
              Admin • Services
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight">
              {pageTitle}
            </h1>

            <p className="mt-2 text-sm text-[--muted]">
              Manage service listings. Public <span className="font-semibold">/services</span> updates automatically.
            </p>

            {/* Category pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/admin/dashboard/services" className="menu-link">
                All
              </Link>

              {(Object.keys(CAT_UI) as Array<keyof typeof CAT_UI>).map((k) => (
                <Link
                  key={k}
                  href={`/admin/dashboard/services?cat=${k}`}
                  className="menu-link"
                  style={
                    cat === k
                      ? {
                          background: "rgba(11,94,215,0.08)",
                          borderColor: "rgba(11,94,215,0.25)",
                          color: "var(--foreground)",
                        }
                      : undefined
                  }
                >
                  <span className="opacity-90">{CAT_UI[k].icon}</span>
                  {CAT_UI[k].label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={load} className="btn btn-outline">
              <RefreshCw size={16} />
              Refresh
            </button>

            <Link href="/admin/dashboard/services/new" className="btn btn-primary">
              <Plus size={18} /> New Service
            </Link>
          </div>
        </div>

        {/* Body */}
        <div className="mt-8">
          {loading ? (
            <div className="card">
              <div className="card-inner">
                <div className="text-sm text-[--muted]">Loading services…</div>
                <div className="mt-4 h-2.5 rounded-full bg-[--surface-2] overflow-hidden border border-[--border]">
                  <div
                    className="h-full w-[45%]"
                    style={{
                      background:
                        "linear-gradient(90deg,var(--brand-primary),var(--brand-secondary),var(--brand-primary))",
                      animation: "teBar 1.35s cubic-bezier(0.45,0,0.25,1) infinite",
                    }}
                  />
                </div>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="card">
              <div className="card-inner">
                <div className="text-lg font-extrabold">No items yet</div>
                <p className="mt-1 text-sm text-[--muted]">
                  Click <span className="font-semibold">New Service</span> to add your first listing.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.keys(grouped)
                .sort()
                .map((catKey) => (
                  <div key={catKey} className="card overflow-hidden">
                    {/* Group header */}
                    <div className="px-5 py-4 border-b border-[--border] bg-[--surface] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="font-extrabold">
                          {(CAT_UI[safeCat(catKey) as Category]?.label) ||
                            catKey.toUpperCase()}
                        </div>
                        <span className="badge">{grouped[catKey].length} item(s)</span>
                      </div>

                      <Link
                        href={`/admin/dashboard/services?cat=${catKey}`}
                        className="menu-link text-sm"
                      >
                        Filter view
                      </Link>
                    </div>

                    {/* Items */}
                    <div className="divide-y divide-[--border] bg-[--surface]">
                      {grouped[catKey].map((p) => (
                        <div
                          key={p.id}
                          className="px-5 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="font-bold truncate">{p.name}</div>
                              {!p.category ? (
                                <span className="badge">Uncategorized</span>
                              ) : null}
                            </div>

                            {p.description ? (
                              <div className="mt-1 text-sm text-[--muted] line-clamp-2">
                                {p.description}
                              </div>
                            ) : null}
                          </div>

                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/dashboard/services/${p.id}/edit`}
                              className="btn btn-outline"
                            >
                              <Pencil size={16} /> Edit
                            </Link>

                            <button
                              onClick={() => onDelete(p.id)}
                              className="btn"
                              style={{
                                background: "rgba(239,68,68,0.10)",
                                borderColor: "rgba(239,68,68,0.25)",
                                color: "rgba(239,68,68,0.95)",
                                borderWidth: 1,
                                borderStyle: "solid",
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

      <style jsx global>{`
        @keyframes teBar {
          0% {
            transform: translateX(-55%);
          }
          50% {
            transform: translateX(10%);
          }
          100% {
            transform: translateX(105%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}
