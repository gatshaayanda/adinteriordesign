"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { firestore } from "@/utils/firebaseConfig";

import AdminHubLoader from "@/components/AdminHubLoader";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

type Message = {
  text?: string;
  sender: string;
  link?: string;
  fileUrl?: string;
  timestamp?: any;
};

function safeText(v: any) {
  return (v ?? "").toString().trim();
}

function isUrl(v: string) {
  try {
    new URL(v);
    return true;
  } catch {
    return false;
  }
}

export default function ViewProjectPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const SENDER = "AD Interior Design"; // ✅ stop leaking AdminHub branding
  const isAdmin = true;

  const [project, setProject] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [optionalLink, setOptionalLink] = useState("");
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  // Load project
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const snap = await getDoc(doc(firestore, "projects", id));
        if (!snap.exists()) throw new Error("Project not found.");
        if (!alive) return;
        setProject({ id: snap.id, ...snap.data() });
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
  }, [id]);

  // Live messages
  useEffect(() => {
    const qRef = query(
      collection(firestore, "projects", id, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsub = onSnapshot(qRef, (snap) => {
      setMessages(snap.docs.map((d) => d.data() as Message));
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    });

    return () => unsub();
  }, [id]);

  const canSend = useMemo(() => {
    const txt = safeText(newMessage);
    const link = safeText(optionalLink);
    return !!txt || !!uploadedFileUrl || !!link;
  }, [newMessage, optionalLink, uploadedFileUrl]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend || sending) return;

    const txt = safeText(newMessage);
    const link = safeText(optionalLink);

    const msg: Message = {
      sender: SENDER,
      timestamp: serverTimestamp(),
    };

    if (txt) msg.text = txt;
    if (link && isUrl(link)) msg.link = link;
    if (uploadedFileUrl) msg.fileUrl = uploadedFileUrl;

    setSending(true);
    try {
      await addDoc(collection(firestore, "projects", id, "messages"), msg);
      setNewMessage("");
      setOptionalLink("");
      setUploadedFileUrl("");
    } catch (e) {
      console.error("Send message failed:", e);
      alert("Send failed. Check console.");
    } finally {
      setSending(false);
    }
  }

  async function handleDeleteAllMessages() {
    if (!isAdmin) return;
    const ok = confirm("Delete ALL messages for this project?");
    if (!ok) return;

    try {
      const snap = await getDocs(collection(firestore, "projects", id, "messages"));
      await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
    } catch (e) {
      console.error("Delete all failed:", e);
      alert("Delete failed. Check console.");
    }
  }

  if (loading) return <AdminHubLoader />;
  if (error) {
    return (
      <main className="bg-[--background] text-[--foreground]">
        <section className="container py-12">
          <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-6">
            <div className="font-extrabold text-red-600">Error</div>
            <div className="text-sm mt-2">{error}</div>
            <div className="mt-4">
              <button onClick={() => router.back()} className="btn btn-outline">
                Go back
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!project) return null;

  return (
    <main className="bg-[--background] text-[--foreground]">
      <section className="container py-10 max-w-5xl">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <button onClick={() => router.push("/admin/project")} className="menu-link">
            ← Back to Projects
          </button>

          <div className="flex gap-2">
            {isAdmin && (
              <button onClick={handleDeleteAllMessages} className="btn btn-outline">
                Delete all messages
              </button>
            )}
          </div>
        </div>

        {/* Header card */}
        <div className="mt-6 rounded-3xl border border-[--border] bg-[--surface] shadow-[var(--shadow)] overflow-hidden">
          <div className="p-6 md:p-7 border-b border-[--border]">
            <div className="text-xs font-extrabold tracking-wide text-[--muted]">
              Project Overview
            </div>

            <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight">
              {project.client_name || project.business || "Untitled Project"}
            </h1>

            <p className="text-sm text-[--muted] mt-2">
              Manage messages + view intake details. Everything here follows your global styles — no random colors.
            </p>
          </div>

          {/* Messages */}
          <div className="p-6 md:p-7">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="text-lg md:text-xl font-extrabold tracking-tight">
                Project Messages
              </h2>

              <span className="badge">
                {messages.length} message{messages.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="mt-4 rounded-2xl border border-[--border] bg-[--surface-2] p-4 max-h-[420px] overflow-y-auto space-y-3">
              {messages.length === 0 ? (
                <div className="text-sm text-[--muted]">
                  No messages yet. Send the first update to the client.
                </div>
              ) : (
                messages.map((m, idx) => {
                  const mine = m.sender === SENDER;
                  return (
                    <div
                      key={idx}
                      className={`max-w-[560px] rounded-2xl border border-[--border] p-4 ${
                        mine ? "ml-auto bg-[--surface]" : "bg-[--background]"
                      }`}
                    >
                      {m.text ? (
                        <p className="text-sm text-[--foreground] whitespace-pre-line leading-relaxed">
                          {m.text}
                        </p>
                      ) : null}

                      {(m.link || m.fileUrl) ? (
                        <div className="mt-3 flex flex-col gap-2">
                          {m.link ? (
                            <a
                              href={m.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="menu-link inline-flex w-fit"
                            >
                              🔗 View link
                            </a>
                          ) : null}

                          {m.fileUrl ? (
                            <a
                              href={m.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="menu-link inline-flex w-fit"
                            >
                              📎 View file
                            </a>
                          ) : null}
                        </div>
                      ) : null}

                      <div className="mt-3 text-xs text-[--muted] font-semibold text-right">
                        {m.sender || "—"}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* Composer */}
            <form onSubmit={handleSendMessage} className="mt-5 space-y-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message…"
                rows={3}
                className="input"
              />

              <input
                type="url"
                value={optionalLink}
                onChange={(e) => setOptionalLink(e.target.value)}
                placeholder="Optional link (https://...)"
                className="input"
              />

              {/* UploadThing */}
              <div className="rounded-2xl border border-[--border] bg-[--surface] p-4">
                <div className="text-sm font-extrabold">Attach a file (optional)</div>
                <p className="text-xs text-[--muted] mt-1">
                  Upload an image/PDF and it will be sent as a link inside the message.
                </p>

                <div className="mt-3">
                  <UploadButton<OurFileRouter, "fileUploader">
                    endpoint="fileUploader"
                    onClientUploadComplete={(res) => {
                      const first = Array.isArray(res) ? res[0] : null;
                      const url = (first as any)?.url;
                      if (url) setUploadedFileUrl(url);
                    }}
                    onUploadError={(err: Error) => {
                      alert(`Upload failed: ${err.message}`);
                    }}
                  />
                </div>

                {uploadedFileUrl ? (
                  <div className="mt-2 text-xs text-[--muted] break-all">
                    File ready: {uploadedFileUrl}
                  </div>
                ) : null}
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!canSend || sending}
                >
                  {sending ? "Sending…" : "Send Message"}
                </button>

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setNewMessage("");
                    setOptionalLink("");
                    setUploadedFileUrl("");
                  }}
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Intake Info */}
        <div className="mt-8 rounded-3xl border border-[--border] bg-[--surface] shadow-[var(--shadow)] overflow-hidden">
          <div className="p-6 md:p-7 border-b border-[--border]">
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
              Preliminary Intake Info
            </h2>
            <p className="text-sm text-[--muted] mt-2">
              These fields come from the create-project form.
            </p>
          </div>

          <div className="p-6 md:p-7 space-y-4 text-sm">
            {project.live_revisable_draft_link ? (
              <div className="rounded-2xl border border-[--border] bg-[--surface-2] p-4">
                <div className="font-extrabold">Live Draft</div>
                <a
                  href={project.live_revisable_draft_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="menu-link inline-flex mt-2"
                >
                  View live site →
                </a>
              </div>
            ) : null}

            {project.resource_link ? (
              <div className="rounded-2xl border border-[--border] bg-[--surface-2] p-4">
                <div className="font-extrabold">Resource Link</div>
                <a
                  href={project.resource_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="menu-link inline-flex mt-2"
                >
                  Open shared file →
                </a>
              </div>
            ) : null}

            <Read label="Progress Update" value={project.progress_update} />

            <div className="grid md:grid-cols-2 gap-4">
              <Read label="Client Name" value={project.client_name} />
              <Read label="Client Email" value={project.client_email} />
              <Read label="Business" value={project.business} />
              <Read label="Industry" value={project.industry} />
            </div>

            <Read label="Goals" value={project.goals} />
            <Read label="Pain Points" value={project.painpoints} />
            <Read label="Pages" value={project.pages} />
            <Read label="Content" value={project.content} />
            <Read label="Features" value={project.features} />
            <Read label="Design Preferences" value={project.design_prefs} />
            <Read label="Examples / Competitors" value={project.examples} />
            <Read label="Mood / Branding" value={project.mood} />

            <div className="rounded-2xl border border-[--border] bg-[--surface-2] p-4">
              <div className="font-extrabold">Admin Notes</div>
              <div className="text-[--foreground] mt-2 whitespace-pre-line">
                {safeText(project.admin_notes) || "—"}
              </div>
            </div>

            <Read
              label="Client Admin Panel Access"
              value={project.admin_panel ? "Yes" : "No"}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function Read({ label, value }: { label: string; value: any }) {
  const v = (value ?? "").toString().trim();
  return (
    <div className="rounded-2xl border border-[--border] bg-[--background] p-4">
      <div className="text-xs font-extrabold tracking-wide text-[--muted]">
        {label}
      </div>
      <div className="mt-1 text-[--foreground]">{v || "—"}</div>
    </div>
  );
}
