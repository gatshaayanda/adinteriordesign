"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { firestore } from "@/utils/firebaseConfig";

type Category =
  | "tv-stands"
  | "wall-panels"
  | "wardrobes"
  | "kitchens"
  | "ceilings"
  | "doors";

function safeCat(raw: any): Category {
  const v = String(raw ?? "").trim().toLowerCase();
  if (v === "tv-stands") return "tv-stands";
  if (v === "wall-panels") return "wall-panels";
  if (v === "wardrobes") return "wardrobes";
  if (v === "kitchens") return "kitchens";
  if (v === "ceilings") return "ceilings";
  if (v === "doors") return "doors";
  return "tv-stands";
}

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "tv-stands" as Category,
    imageUrl: "",
    description: "",
  });

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        if (!id) return;

        setLoading(true);
        const ref = doc(firestore, "services", id);
        const snap = await getDoc(ref);
        if (!snap.exists()) throw new Error("Not found");

        const s = snap.data() as any;
        if (!alive) return;

        setForm({
          name: s.name ?? "",
          category: safeCat(s.category),
          imageUrl: s.imageUrl ?? "",
          description: s.description ?? "",
        });
      } catch (e) {
        console.error("Load service failed:", e);
        alert("Could not load service.");
        router.push("/admin/dashboard/services");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id, router]);

  const save = async () => {
    if (!id) return;

    if (!form.name.trim()) return alert("Name required");

    setSaving(true);
    try {
      await updateDoc(doc(firestore, "services", id), {
        name: form.name.trim(),
        category: form.category,
        imageUrl: form.imageUrl.trim() || "/placeholder.png",
        description: form.description.trim() || null,
        updatedAt: serverTimestamp(),
      });

      router.push("/admin/dashboard/services");
    } catch (e) {
      console.error("Update failed:", e);
      alert("Failed to update service");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-[--background] text-[--foreground]">
        <section className="container py-10 max-w-3xl">
          <div className="card">
            <div className="card-inner">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="badge">Admin • Edit</div>
                  <div className="mt-2 text-xl font-extrabold tracking-tight">
                    Loading service…
                  </div>
                  <div className="mt-1 text-sm text-[--muted]">
                    Fetching details from Firestore.
                  </div>
                </div>
                <div className="h-10 w-10 rounded-xl border border-[--border] bg-[--surface-2] animate-pulse" />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-11 rounded-xl border border-[--border] bg-[--surface-2] animate-pulse"
                  />
                ))}
                <div className="sm:col-span-2 h-28 rounded-xl border border-[--border] bg-[--surface-2] animate-pulse" />
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[--background] text-[--foreground]">
      <section className="container py-10 max-w-3xl">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="badge">Admin • Edit</div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight">
              Edit Service
            </h1>
            <p className="mt-2 text-sm text-[--muted]">
              Update service details. Changes go live on{" "}
              <span className="font-semibold">/services</span>.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => history.back()}
              className="btn btn-outline"
              disabled={saving}
            >
              Cancel
            </button>
            <button onClick={save} className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="mt-6 card">
          <div className="card-inner space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold">Service name</label>
              <input
                className="input"
                placeholder="e.g. Custom Wardrobe / Modern TV Stand"
                value={form.name}
                onChange={(e) =>
                  setForm((s) => ({ ...s, name: e.target.value }))
                }
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-bold">Category</label>
              <select
                className="input"
                value={form.category}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    category: e.target.value as Category,
                  }))
                }
              >
                <option value="tv-stands">TV Stands</option>
                <option value="wall-panels">Wall Panels</option>
                <option value="wardrobes">Wardrobes</option>
                <option value="kitchens">Kitchens</option>
                <option value="ceilings">Ceilings</option>
                <option value="doors">Doors</option>
              </select>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label className="text-sm font-bold">
                Image URL <span className="muted">(optional)</span>
              </label>
              <input
                className="input"
                placeholder="https://... (or leave blank to use /placeholder.png)"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((s) => ({ ...s, imageUrl: e.target.value }))
                }
              />
              <div className="text-xs text-[--muted-2] break-all">
                {form.imageUrl
                  ? `Current: ${form.imageUrl}`
                  : "No image URL set — will fallback to /placeholder.png"}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-bold">
                Description <span className="muted">(optional)</span>
              </label>
              <textarea
                className="input"
                rows={5}
                placeholder="Add materials, finish options, sizing notes, installation notes, etc."
                value={form.description}
                onChange={(e) =>
                  setForm((s) => ({ ...s, description: e.target.value }))
                }
              />
            </div>

            {/* Bottom actions */}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                onClick={() => history.back()}
                className="btn btn-outline"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
