"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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

export default function NewServicePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "tv-stands" as ServiceCategory,
    summary: "",
    bulletsText: "", // newline separated
    order: "",
    active: true,
    featured: false,
    imageUrl: "",
  });

  const save = async () => {
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
      await addDoc(collection(firestore, "services"), {
        title: form.title.trim(),
        category: form.category,
        summary: form.summary.trim() || null,
        bullets: bullets.length ? bullets : null,
        order: order ?? null,
        active: !!form.active,
        featured: !!form.featured,
        imageUrl: form.imageUrl.trim() || "/placeholder.png",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      router.push("/admin/dashboard/services");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save service item.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="bg-[--background] text-[--foreground]">
      <section className="container py-10 max-w-2xl">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              New Service Item
            </h1>
            <p className="text-sm text-[--muted] mt-1">
              This powers /c/[category] and can be featured on the site.
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
              <p className="text-xs text-[--muted]">
                Must match /c/{form.category}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-extrabold">Order (optional)</label>
              <input
                className="input"
                placeholder="e.g. 1"
                value={form.order}
                onChange={(e) => setForm((s) => ({ ...s, order: e.target.value }))}
              />
              <p className="text-xs text-[--muted]">
                Lower numbers show first.
              </p>
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

          {/* Toggles */}
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
                If you don’t upload, we’ll use /placeholder.png
              </div>
            )}
          </div>

          {/* Manual URL */}
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
              {saving ? "Saving…" : "Save"}
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
