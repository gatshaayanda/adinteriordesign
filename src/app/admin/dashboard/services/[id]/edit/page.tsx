"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { firestore } from "@/utils/firebaseConfig";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

type ServiceCategory =
  | "tv-stands"
  | "wall-panels"
  | "wardrobes"
  | "kitchens"
  | "ceilings"
  | "doors";

type UploadedFile = { url?: string } | null | undefined;

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "tv-stands" as ServiceCategory,
    summary: "",
    bulletsText: "",
    order: "",
    active: true,
    featured: false,
    imageUrl: "",
  });

  useEffect(() => {
    if (!id) return;

    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const ref = doc(firestore, "services", id);
        const snap = await getDoc(ref);
        if (!snap.exists()) throw new Error("Not found");

        const s = snap.data() as any;
        if (!alive) return;

        setForm({
          title: s.title ?? "",
          category: (s.category ?? "tv-stands") as ServiceCategory,
          summary: s.summary ?? "",
          bulletsText: Array.isArray(s.bullets) ? s.bullets.join("\n") : "",
          order:
            typeof s.order === "number" || typeof s.order === "string"
              ? String(s.order)
              : "",
          active: s.active !== false,
          featured: !!s.featured,
          imageUrl: s.imageUrl ?? "",
        });
      } catch (e) {
        console.error("Load service failed:", e);
        alert("Could not load service item.");
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
    if (!form.title.trim()) return alert("Title is required.");

    const order = form.order.trim() ? Number(form.order) : null;
    if (form.order.trim() && !Number.isFinite(order)) {
      return alert("Order must be a number.");
    }

    const bullets = form.bulletsText
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

    setSaving(true);
    try {
      await updateDoc(doc(firestore, "services", id), {
        title: form.title.trim(),
        category: form.category,
        summary: form.summary.trim() || null,
        bullets: bullets.length ? bullets : null,
        order: order ?? null,
        active: !!form.active,
        featured: !!form.featured,
        imageUrl: form.imageUrl.trim() || "/placeholder.png",
        updatedAt: serverTimestamp(),
      });

      router.push("/admin/dashboard/services");
    } catch (e) {
      console.error("Update failed:", e);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-[--background] text-[--foreground]">
        <section className="container py-10 max-w-2xl">
          <div className="rounded-2xl border border-[--border] bg-[--surface] p-6 shadow-[var(--shadow)]">
            Loading…
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[--background] text-[--foreground]">
      <section className="container py-10 max-w-2xl">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Edit Service Item
            </h1>
            <p className="text-sm text-[--muted] mt-1">
              Update details for /c/{form.category}
            </p>
          </div>

          <button onClick={() => history.back()} className="btn btn-outline">
            Cancel
          </button>
        </div>

        <div className="mt-6 space-y-4 rounded-2xl border border-[--border] bg-[--surface] p-6 shadow-[var(--shadow)]">
          <div className="space-y-2">
            <label className="text-sm font-extrabold">Title</label>
            <input
              className="input"
              placeholder="e.g. Floating TV Stand (LED + Storage)"
              value={form.title}
              onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-extrabold">Category</label>
              <select
                className="input"
                value={form.category}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    category: e.target.value as ServiceCategory,
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

            <div className="space-y-2">
              <label className="text-sm font-extrabold">Order (optional)</label>
              <input
                className="input"
                placeholder="e.g. 1"
                value={form.order}
                onChange={(e) => setForm((s) => ({ ...s, order: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-extrabold">Summary (optional)</label>
            <textarea
              className="input"
              rows={3}
              placeholder="Short summary shown on cards."
              value={form.summary}
              onChange={(e) => setForm((s) => ({ ...s, summary: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-extrabold">
              Bullets (optional)
            </label>
            <textarea
              className="input"
              rows={5}
              placeholder={"One bullet per line.\nLED strip option\nSoft-close hinges\nMatte / gloss finishes"}
              value={form.bulletsText}
              onChange={(e) =>
                setForm((s) => ({ ...s, bulletsText: e.target.value }))
              }
            />
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) =>
                  setForm((s) => ({ ...s, active: e.target.checked }))
                }
              />
              Active
            </label>

            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  setForm((s) => ({ ...s, featured: e.target.checked }))
                }
              />
              Featured
            </label>
          </div>

          {/* UploadThing */}
          <div className="space-y-2 pt-2">
            <div className="text-sm font-extrabold">Upload image</div>

            <UploadButton<OurFileRouter, "fileUploader">
              endpoint="fileUploader"
              onClientUploadComplete={(res) => {
                const first: UploadedFile = Array.isArray(res) ? res[0] : null;
                const url = first?.url;
                if (url) setForm((s) => ({ ...s, imageUrl: url }));
              }}
              onUploadError={(error: Error) => {
                alert(`Upload failed: ${error.message}`);
              }}
            />

            {form.imageUrl ? (
              <div className="text-xs text-[--muted] break-all">
                Current image URL: {form.imageUrl}
              </div>
            ) : (
              <div className="text-xs text-[--muted]">
                If empty, we’ll use /placeholder.png
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-extrabold">Or paste image URL</label>
            <input
              className="input"
              placeholder="https://..."
              value={form.imageUrl}
              onChange={(e) =>
                setForm((s) => ({ ...s, imageUrl: e.target.value }))
              }
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              disabled={saving}
              onClick={save}
              className="btn btn-primary"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>

            <button
              type="button"
              onClick={() => history.back()}
              className="btn btn-outline"
            >
              Cancel
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
