"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/utils/firebaseConfig";

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
  admin_notes: string;
  progress_update: string;
};

const INITIAL: FormState = {
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
  admin_notes: "",
  progress_update: "",
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
];

export default function CreateProjectPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(INITIAL);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (saving) return;

    setMessage("");
    setSuccess(false);

    // tiny sanity checks
    if (!form.client_name.trim()) return setMessage("Client name is required.");
    if (!form.client_email.trim()) return setMessage("Client email is required.");
    if (!form.industry.trim()) return setMessage("Industry is required.");

    setSaving(true);
    try {
      await addDoc(collection(firestore, "projects"), {
        ...form,
        admin_id: "admin",
        created_at: serverTimestamp(),
      });

      setMessage("✅ Project created!");
      setSuccess(true);
      setForm(INITIAL);

      // optional: bounce back to list so you see it immediately
      router.push("/admin/dashboard/projects");
    } catch (err: any) {
      setMessage("❌ Error: " + (err?.message || "Failed to create project"));
      setSuccess(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="bg-[--background] text-[--foreground]">
      <section className="container py-10 max-w-3xl">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <button onClick={() => router.push("/admin/dashboard")} className="menu-link">
            ← Back to Dashboard
          </button>

          <div className="flex gap-2">
            <button onClick={() => router.back()} className="btn btn-outline" type="button">
              Cancel
            </button>
            <button
              form="create-project-form"
              className="btn btn-primary"
              type="submit"
              disabled={saving}
            >
              {saving ? "Saving…" : "Create Project"}
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-[--border] bg-[--surface] shadow-[var(--shadow)] overflow-hidden">
          <div className="p-6 md:p-7 border-b border-[--border]">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Create New Project
            </h1>
            <p className="text-sm text-[--muted] mt-2">
              Save a project to Firestore (<b>projects</b>) and manage it in your dashboard.
            </p>
          </div>

          <form
            id="create-project-form"
            onSubmit={handleSubmit}
            className="p-6 md:p-7 space-y-6"
          >
            {/* Top grid */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[--muted]">Client name</label>
                <input
                  className="input"
                  placeholder="Client Full Name"
                  value={form.client_name}
                  onChange={(e) => handleChange("client_name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[--muted]">Client email</label>
                <input
                  className="input"
                  placeholder="Client Email"
                  type="email"
                  value={form.client_email}
                  onChange={(e) => handleChange("client_email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[--muted]">Business name</label>
                <input
                  className="input"
                  placeholder="Business Name (optional)"
                  value={form.business}
                  onChange={(e) => handleChange("business", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[--muted]">Industry</label>
                <select
                  className="input"
                  value={form.industry}
                  onChange={(e) => handleChange("industry", e.target.value)}
                  required
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

            {/* Link */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[--muted]">
                Resource link (optional)
              </label>
              <input
                className="input"
                placeholder="Google Docs / Sheets / File Link"
                value={form.resource_link}
                onChange={(e) => handleChange("resource_link", e.target.value)}
              />
            </div>

            {/* Text areas */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[--muted]">Goals</label>
                <textarea
                  className="input"
                  rows={4}
                  placeholder="Project Goals"
                  value={form.goals}
                  onChange={(e) => handleChange("goals", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[--muted]">Pain points</label>
                <textarea
                  className="input"
                  rows={4}
                  placeholder="Pain Points"
                  value={form.painpoints}
                  onChange={(e) => handleChange("painpoints", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[--muted]">Pages</label>
                <textarea
                  className="input"
                  rows={4}
                  placeholder="Pages"
                  value={form.pages}
                  onChange={(e) => handleChange("pages", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[--muted]">Content</label>
                <textarea
                  className="input"
                  rows={4}
                  placeholder="Content"
                  value={form.content}
                  onChange={(e) => handleChange("content", e.target.value)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[--muted]">Features</label>
                <textarea
                  className="input"
                  rows={4}
                  placeholder="Features"
                  value={form.features}
                  onChange={(e) => handleChange("features", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[--muted]">Design preferences</label>
                <textarea
                  className="input"
                  rows={4}
                  placeholder="Design Preferences"
                  value={form.design_prefs}
                  onChange={(e) => handleChange("design_prefs", e.target.value)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[--muted]">Examples / inspiration</label>
                <textarea
                  className="input"
                  rows={4}
                  placeholder="Examples / Inspiration"
                  value={form.examples}
                  onChange={(e) => handleChange("examples", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[--muted]">Mood / branding</label>
                <textarea
                  className="input"
                  rows={4}
                  placeholder="Mood / Branding"
                  value={form.mood}
                  onChange={(e) => handleChange("mood", e.target.value)}
                />
              </div>
            </div>

            {/* Admin panel toggle */}
            <div className="rounded-2xl border border-[--border] bg-[--surface-2] p-4">
              <label className="flex items-center gap-3 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={form.admin_panel}
                  onChange={(e) => handleChange("admin_panel", e.target.checked)}
                />
                Client wants admin panel access
              </label>
              <p className="text-xs text-[--muted] mt-1">
                Keep this as a note only (access control can be wired later if needed).
              </p>
            </div>

            {/* Notes + progress */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[--muted]">
                  Admin notes (internal)
                </label>
                <textarea
                  className="input"
                  rows={5}
                  placeholder="Admin Notes (Internal Only)"
                  value={form.admin_notes}
                  onChange={(e) => handleChange("admin_notes", e.target.value)}
                  style={{ background: "rgba(15, 23, 42, 0.03)" }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[--muted]">
                  Progress update (client-facing)
                </label>
                <textarea
                  className="input"
                  rows={5}
                  placeholder="Progress Update (Client will see this)"
                  value={form.progress_update}
                  onChange={(e) => handleChange("progress_update", e.target.value)}
                />
              </div>
            </div>

            {/* Message */}
            {message ? (
              <div
                className={`rounded-2xl border p-4 text-sm font-semibold ${
                  success
                    ? "border-[--border] bg-[--surface-2] text-[--foreground]"
                    : "border-red-500/25 bg-red-500/10 text-red-600"
                }`}
              >
                {message}
              </div>
            ) : null}
          </form>
        </div>
      </section>
    </main>
  );
}
