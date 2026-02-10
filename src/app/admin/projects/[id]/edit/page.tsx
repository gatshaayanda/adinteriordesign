"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "@/utils/firebaseConfig";
import AdminHubLoader from "@/components/AdminHubLoader";

type FormState = {
  client_name: string;
  client_email: string;
  business: string;
  industry: string;
  goals: string;
  painpoints: string;
  pages: string;
  content: string;
  features: string;
  admin_panel: boolean;
  design_prefs: string;
  examples: string;
  mood: string;
  resource_link: string;
  live_revisable_draft_link: string;
  admin_notes: string;
  progress_update: string;
};

const INDUSTRIES = [
  "Beauty",
  "Church",
  "Finance",
  "Media",
  "Events",
  "Fashion",
  "Gaming",
  "Education",
  "eCommerce",
  "Repair",
  "Insurance",
  "Food & Beverage",
  "Transport & Logistics",
  "Other",
] as const;

function safe(v: any) {
  return (v ?? "").toString();
}

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormState>({
    client_name: "",
    client_email: "",
    business: "",
    industry: "",
    goals: "",
    painpoints: "",
    pages: "",
    content: "",
    features: "",
    admin_panel: false,
    design_prefs: "",
    examples: "",
    mood: "",
    resource_link: "",
    live_revisable_draft_link: "",
    admin_notes: "",
    progress_update: "",
  });

  useEffect(() => {
    if (!id) {
      router.replace("/admin/project");
      return;
    }

    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const snap = await getDoc(doc(firestore, "projects", id));
        if (!snap.exists()) throw new Error("Project not found.");

        const data = snap.data() as any;

        if (!alive) return;

        setForm({
          client_name: safe(data.client_name),
          client_email: safe(data.client_email),
          business: safe(data.business),
          industry: safe(data.industry),
          goals: safe(data.goals),
          painpoints: safe(data.painpoints),
          pages: safe(data.pages),
          content: safe(data.content),
          features: safe(data.features),
          admin_panel: !!data.admin_panel,
          design_prefs: safe(data.design_prefs),
          examples: safe(data.examples),
          mood: safe(data.mood),
          resource_link: safe(data.resource_link),
          live_revisable_draft_link: safe(data.live_revisable_draft_link),
          admin_notes: safe(data.admin_notes),
          progress_update: safe(data.progress_update),
        });
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || "Failed to load project.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id, router]);

  const title = useMemo(() => {
    const name = form.client_name.trim();
    const biz = form.business.trim();
    return name || biz || "Edit Project";
  }, [form.client_name, form.business]);

  const handleChange = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setError("");
    setSaving(true);

    try {
      await updateDoc(doc(firestore, "projects", id), {
        ...form,
        client_name: form.client_name.trim(),
        client_email: form.client_email.trim(),
        business: form.business.trim(),
        industry: form.industry.trim(),
        goals: form.goals.trim(),
        painpoints: form.painpoints.trim(),
        pages: form.pages.trim(),
        content: form.content.trim(),
        features: form.features.trim(),
        design_prefs: form.design_prefs.trim(),
        examples: form.examples.trim(),
        mood: form.mood.trim(),
        resource_link: form.resource_link.trim(),
        live_revisable_draft_link: form.live_revisable_draft_link.trim(),
        admin_notes: form.admin_notes,
        progress_update: form.progress_update,
      });

      router.push("/admin/project");
    } catch (e: any) {
      setError(e?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setError("");

    const ok = confirm("Delete this project? This cannot be undone.");
    if (!ok) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/project/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Delete failed");
      }

      router.push("/admin/project");
    } catch (e: any) {
      setError(e?.message || "Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <AdminHubLoader />;

  return (
    <main className="bg-[--background] text-[--foreground]">
      <section className="container py-10 max-w-3xl">
        <button onClick={() => router.push("/admin/project")} className="menu-link">
          ← Back to Projects
        </button>

        <div className="mt-4 rounded-3xl border border-[--border] bg-[--surface] shadow-[var(--shadow)] overflow-hidden">
          <div className="p-6 md:p-7 border-b border-[--border]">
            <div className="text-xs font-extrabold tracking-wide text-[--muted]">
              Edit Project
            </div>
            <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-[--muted] mt-2">
              Update intake fields, links, notes, and the client-facing progress update.
            </p>

            {error ? (
              <div className="mt-4 rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm">
                <div className="font-extrabold text-red-600">Error</div>
                <div className="mt-1">{error}</div>
              </div>
            ) : null}
          </div>

          <form onSubmit={handleUpdate} className="p-6 md:p-7 space-y-4">
            {/* Top grid */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-extrabold tracking-wide text-[--muted] mb-2">
                  Client name
                </div>
                <input
                  value={form.client_name}
                  onChange={(e) => handleChange("client_name", e.target.value)}
                  placeholder="Client Name"
                  required
                  className="input"
                />
              </div>

              <div>
                <div className="text-xs font-extrabold tracking-wide text-[--muted] mb-2">
                  Client email
                </div>
                <input
                  value={form.client_email}
                  onChange={(e) => handleChange("client_email", e.target.value)}
                  placeholder="Client Email"
                  type="email"
                  required
                  className="input"
                />
              </div>

              <div>
                <div className="text-xs font-extrabold tracking-wide text-[--muted] mb-2">
                  Business
                </div>
                <input
                  value={form.business}
                  onChange={(e) => handleChange("business", e.target.value)}
                  placeholder="Business"
                  className="input"
                />
              </div>

              <div>
                <div className="text-xs font-extrabold tracking-wide text-[--muted] mb-2">
                  Industry
                </div>
                <select
                  value={form.industry}
                  onChange={(e) => handleChange("industry", e.target.value)}
                  required
                  className="input"
                >
                  <option value="">Select Industry</option>
                  {INDUSTRIES.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Links */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-extrabold tracking-wide text-[--muted] mb-2">
                  Resource link
                </div>
                <input
                  value={form.resource_link}
                  onChange={(e) => handleChange("resource_link", e.target.value)}
                  placeholder="Google Docs / File Link"
                  className="input"
                />
              </div>

              <div>
                <div className="text-xs font-extrabold tracking-wide text-[--muted] mb-2">
                  Live draft link
                </div>
                <input
                  value={form.live_revisable_draft_link}
                  onChange={(e) => handleChange("live_revisable_draft_link", e.target.value)}
                  placeholder="Live Draft Link (optional)"
                  className="input"
                />
              </div>
            </div>

            {/* Textareas */}
            {[
              ["goals", "Goals"] as const,
              ["painpoints", "Pain Points"] as const,
              ["pages", "Pages"] as const,
              ["content", "Content"] as const,
              ["features", "Features"] as const,
              ["design_prefs", "Design Preferences"] as const,
              ["examples", "Examples / Competitors"] as const,
              ["mood", "Mood / Branding"] as const,
            ].map(([key, label]) => (
              <div key={key}>
                <div className="text-xs font-extrabold tracking-wide text-[--muted] mb-2">
                  {label}
                </div>
                <textarea
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={label}
                  rows={3}
                  className="input"
                />
              </div>
            ))}

            {/* Admin panel access */}
            <div className="rounded-2xl border border-[--border] bg-[--surface-2] p-4 flex items-center justify-between gap-3">
              <div>
                <div className="font-extrabold">Client admin panel access</div>
                <div className="text-sm text-[--muted] mt-1">
                  Toggle if the client needs admin access in this build.
                </div>
              </div>

              <label className="inline-flex items-center gap-2 text-sm font-extrabold">
                <input
                  type="checkbox"
                  checked={form.admin_panel}
                  onChange={(e) => handleChange("admin_panel", e.target.checked)}
                />
                Enabled
              </label>
            </div>

            {/* Progress + Notes */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-extrabold tracking-wide text-[--muted] mb-2">
                  Progress update (client sees this)
                </div>
                <textarea
                  value={form.progress_update}
                  onChange={(e) => handleChange("progress_update", e.target.value)}
                  placeholder="Progress Update"
                  rows={5}
                  className="input"
                />
              </div>

              <div>
                <div className="text-xs font-extrabold tracking-wide text-[--muted] mb-2">
                  Admin notes (internal only)
                </div>
                <textarea
                  value={form.admin_notes}
                  onChange={(e) => handleChange("admin_notes", e.target.value)}
                  placeholder="Admin Notes (internal only)"
                  rows={5}
                  className="input"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Updating…" : "Update"}
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => router.push("/admin/project")}
                disabled={saving || deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={handleDelete}
                disabled={saving || deleting}
                style={{
                  borderColor: "rgba(239, 68, 68, 0.35)",
                  background: "rgba(239, 68, 68, 0.08)",
                }}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
