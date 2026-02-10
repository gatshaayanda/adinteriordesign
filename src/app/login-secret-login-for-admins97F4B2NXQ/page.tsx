"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      const { error: msg } = await res.json().catch(() => ({ error: "" }));
      setError(msg || "Login failed");
      setPw("");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[--background] text-[--foreground] px-4">
      {/* Soft background accents (LIGHT safe) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 h-[32rem] w-[32rem] rounded-full blur-3xl opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(201,162,106,0.55), transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-40 right-1/2 translate-x-1/2 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-15"
          style={{
            background:
              "radial-gradient(circle, rgba(15,23,42,0.55), transparent 70%)",
          }}
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-2xl border border-[--border] bg-[--surface] shadow-[var(--shadow)] overflow-hidden"
      >
        {/* Accent bar */}
        <div className="h-[2px] w-full bg-gradient-to-r from-[--brand-primary] via-[--brand-accent] to-[--brand-secondary]" />

        <div className="p-7 sm:p-8 space-y-6">
          {/* Title */}
          <div className="text-center space-y-2">
            <div className="mx-auto h-12 w-12 rounded-2xl flex items-center justify-center border border-[--border] bg-[--surface-2]">
              <Lock size={18} />
            </div>

            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Admin Login
            </div>

            <p className="text-sm text-[--muted]">
              Protected access for AD Interior Design admins only.
            </p>
          </div>

          {/* Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[--muted]">
              Admin Password
            </label>

            <input
              type="password"
              placeholder="Enter admin password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="input"
              required
              autoComplete="current-password"
            />
          </div>

          {/* Button */}
          <button type="submit" className="btn btn-primary w-full">
            Login <ArrowRight size={18} />
          </button>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 font-semibold text-center">
              {error}
            </div>
          )}

          <p className="text-[11px] text-center text-[--muted-2]">
            Do not share this password with clients.
          </p>
        </div>
      </form>
    </main>
  );
}
