"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/utils/firebaseConfig";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

type Category =
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
    name: "",
    category: "tv-stands" as Category,
    imageUrl: "",
    description: "",
  });

  const save = async () => {
    if (!form.name.trim()) return alert("Service name required");
    if (!form.category) return alert("Category required");

    setSaving(true);
    try {
      await addDoc(collection(firestore, "services"), {
        name: form.name.trim(),
        category: form.category,
        imageUrl: form.imageUrl.trim() || "/placeholder.png",
        description: form.description.trim() || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        admin_id: "admin",
      });

      router.push("/admin/dashboard/services");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="bg-[--background] text-[--foreground]">
      <section className="container py-10 max-w-3xl">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="badge mb-3">Admin • Create</div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              New Service
            </h1>
            <p className="mt-2 text-sm text-[--muted]">
              Add a service to the public catalog.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => history.back()}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              disabled={saving}
              onClick={save}
              className="btn btn-primary"
            >
              {saving ? "Saving…" : "Save Service"}
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
                placeholder="e.g. Modern TV Stand / Custom Wardrobe"
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

            {/* Upload Section */}
            <div className="rounded-xl border border-[--border] bg-[--surface] p-4">
              <div className="flex flex-col gap-3">
                <div>
                  <div className="font-extrabold">Service image</div>
                  <div className="text-sm text-[--muted]">
                    Upload an image.
                  </div>
                </div>

                <UploadButton<OurFileRouter, "fileUploader">
                  endpoint="fileUploader"
                  appearance={{
                    button:
                      "bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700",
                    allowedContent:
                      "text-sm text-gray-600",
                  }}
                  content={{
                    button: "Choose File",
                  }}
                  onClientUploadComplete={(res) => {
                    const first: UploadedFile = Array.isArray(res)
                      ? res[0]
                      : null;
                    const url = first?.url;
                    if (url) {
                      setForm((s) => ({ ...s, imageUrl: url }));
                    }
                  }}
                  onUploadError={(error: Error) => {
                    alert(`Upload failed: ${error.message}`);
                  }}
                />

                {form.imageUrl && (
                  <div className="text-xs text-[--muted-2] break-all">
                    Uploaded URL:
                    <div className="text-[--foreground] mt-1">
                      {form.imageUrl}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Manual URL */}
            <div className="space-y-2">
              <label className="text-sm font-bold">
                Image URL (optional)
              </label>
              <input
                className="input"
                placeholder="https://..."
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((s) => ({ ...s, imageUrl: e.target.value }))
                }
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-bold">
                Description (optional)
              </label>
              <textarea
                className="input"
                rows={5}
                placeholder="Add materials, finishes, sizing notes, etc."
                value={form.description}
                onChange={(e) =>
                  setForm((s) => ({ ...s, description: e.target.value }))
                }
              />
            </div>

            {/* Bottom Buttons */}
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
                {saving ? "Saving…" : "Save Service"}
              </button>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
