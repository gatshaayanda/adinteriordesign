// src/components/ChatWidget.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  MessageCircle,
  X,
  Send,
  ClipboardList,
  Phone,
  Sparkles,
  ExternalLink,
} from "lucide-react";

type Msg = { sender: "user" | "bot"; text: string };
type Stage = "browse" | "inquire" | "lead" | "handoff";

type Lead = {
  name: string;
  phone: string;
  projectType: string; // TV Stand / Wall Panels / Wardrobe / Kitchen / Other
  space: string; // Lounge / Bedroom / Office / Reception / etc.
  budget: string; // optional range
  city: string;
  timeline: string; // ASAP / This month / Next month
  note: string; // measurements / style / colors / link to inspo
};

const STORAGE_KEY = "ad_chat_history_v1";
const LEAD_KEY = "ad_chat_lead_v1";

const WHATSAPP_NUMBER = "+267 77 807 112";

function waLink(message: string) {
  const digits = WHATSAPP_NUMBER.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function clampText(s: string, max = 1200) {
  const t = (s || "").trim();
  return t.length > max ? `${t.slice(0, max)}…` : t;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("browse");

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);

  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [leadOpen, setLeadOpen] = useState(false);
  const [lead, setLead] = useState<Lead>({
    name: "",
    phone: "",
    projectType: "",
    space: "",
    budget: "",
    city: "",
    timeline: "",
    note: "",
  });

  const FALLBACKS = useMemo(
    () => [
      "I can help you get a quote fast. What do you want to build — TV stand, wall panels, wardrobe, kitchen, or something custom?",
      "If you share your city/town and rough measurements, I can draft a WhatsApp quote message for you.",
      "For quickest service, tap “Get a quote” — I’ll open WhatsApp with a ready-to-send request.",
    ],
    []
  );
  const fallbackIdx = useRef(0);
  const rotatedFallback = () => FALLBACKS[fallbackIdx.current++ % FALLBACKS.length];

  const DEFAULT_SUGGESTIONS = useMemo(
    () => ["Get a quote", "TV Stand / Wall Unit", "Wall Panels", "Wardrobes", "Kitchen", "Talk on WhatsApp"],
    []
  );

  // Load saved state
  useEffect(() => {
    try {
      const savedMsgs = safeJsonParse<Msg[]>(localStorage.getItem(STORAGE_KEY));
      if (Array.isArray(savedMsgs)) setMessages(savedMsgs);

      const savedLead = safeJsonParse<Partial<Lead>>(localStorage.getItem(LEAD_KEY));
      if (savedLead && typeof savedLead === "object") {
        setLead((prev) => ({ ...prev, ...savedLead }));
      }
    } catch {}
  }, []);

  // Persist messages + scroll
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}

    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    if (!open && messages.length) {
      const last = messages[messages.length - 1];
      if (last?.sender === "bot") setUnread((u) => u + 1);
    }
  }, [messages, open]);

  // Seed greeting
  useEffect(() => {
    if (!open) return;

    setUnread(0);

    if (open && messages.length === 0) {
      setStage("inquire");
      setMessages([
        {
          sender: "bot",
          text:
            "Hi 👋 I’m the AD Interior Design assistant.\nI can help you pick a design, estimate a quote, and open WhatsApp with a ready-to-send request.\n\nWhat do you want to build today?",
        },
      ]);
      setSuggestions(DEFAULT_SUGGESTIONS);
    }

    const t = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, [open, messages.length, DEFAULT_SUGGESTIONS]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const pushBot = (text: string, sugg?: string[]) => {
    setMessages((p) => [...p, { sender: "bot", text: clampText(text, 1800) }]);
    setSuggestions(Array.isArray(sugg) ? sugg : []);
  };

  const toWhatsAppQuote = (leadData: Lead, transcript: Msg[]) => {
    const cleanTranscript = transcript
      .slice(-10)
      .map((m) => `${m.sender === "user" ? "Me" : "Assistant"}: ${clampText(m.text, 220)}`);

    const lines = [
      "Hi AD Interior Design 👋 I’d like a quote:",
      "",
      `Name: ${leadData.name || "-"}`,
      `Phone: ${leadData.phone || "-"}`,
      `Project: ${leadData.projectType || "-"}`,
      `Space: ${leadData.space || "-"}`,
      `City/Town: ${leadData.city || "-"}`,
      `Budget range (optional): ${leadData.budget || "-"}`,
      `Timeline: ${leadData.timeline || "-"}`,
      `Notes / measurements / colors: ${leadData.note || "-"}`,
      "",
      "If possible, I’ll also send photos/videos of the space + inspiration examples.",
      "",
      cleanTranscript.length ? "— Chat context —" : "",
      ...cleanTranscript,
    ].filter(Boolean);

    return waLink(lines.join("\n"));
  };

  async function sendMessage(override?: string) {
    const text = (override ?? input).trim();
    if (!text) return;

    setMessages((p) => [...p, { sender: "user", text }]);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/fake-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json().catch(() => ({}));
      const botReply = (data?.reply || "").trim() || rotatedFallback();
      const botSugg = Array.isArray(data?.suggestions) ? data.suggestions : [];

      setTyping(false);
      pushBot(botReply, botSugg.length ? botSugg : DEFAULT_SUGGESTIONS);
      setStage((s) => (s === "browse" ? "inquire" : s));
    } catch {
      setTyping(false);
      pushBot(rotatedFallback(), DEFAULT_SUGGESTIONS);
    }
  }

  const onSuggestion = (s: string) => {
    if (s === "Talk on WhatsApp") {
      window.location.href = waLink("Hi AD Interior Design 👋 I need a quote for a TV stand / wall panels / wardrobes / kitchen.");
      return;
    }

    if (s === "Get a quote") {
      setLeadOpen(true);
      setStage("lead");
      pushBot(
        "Sure — fill this quick form and I’ll open WhatsApp with a ready-to-send quote request.",
        []
      );
      return;
    }

    // Service quick prompts (no route jumps — keep it simple + WhatsApp-first)
    if (s === "TV Stand / Wall Unit") {
      sendMessage("I want a TV stand / wall unit. What info do you need for a quote?");
      return;
    }
    if (s === "Wall Panels") {
      sendMessage("I want wall panels (slats / marble / feature wall). What info do you need for a quote?");
      return;
    }
    if (s === "Wardrobes") {
      sendMessage("I want a wardrobe / closet build. What measurements and options do you need?");
      return;
    }
    if (s === "Kitchen") {
      sendMessage("I want a kitchen build. What should I send for an accurate quote?");
      return;
    }

    sendMessage(s);
  };

  const submitLead = () => {
    const clean: Lead = {
      name: lead.name.trim(),
      phone: lead.phone.trim(),
      projectType: lead.projectType.trim(),
      space: lead.space.trim(),
      budget: lead.budget.trim(),
      city: lead.city.trim(),
      timeline: lead.timeline.trim(),
      note: lead.note.trim(),
    };

    try {
      localStorage.setItem(LEAD_KEY, JSON.stringify(clean));
    } catch {}

    const url = toWhatsAppQuote(clean, messages);
    setLeadOpen(false);
    setStage("handoff");
    pushBot("Opening WhatsApp now ✅", ["TV Stand / Wall Unit", "Wall Panels", "Wardrobes", "Kitchen", "Talk on WhatsApp"]);
    window.location.href = url;
  };

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed z-50 bottom-6 right-6 h-14 w-14 rounded-full grid place-items-center text-white shadow-lg select-none"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(201,162,106,0.95), rgba(15,23,42,0.96) 55%, rgba(51,65,85,0.94) 100%)",
            boxShadow: "0 14px 32px rgba(2, 6, 23, 0.20), 0 0 18px rgba(201,162,106,0.12)",
          }}
          aria-label="Open AD Interior Design chat"
        >
          <MessageCircle size={22} />
          {unread > 0 && (
            <span
              className="absolute -top-1 -right-1 rounded-full px-2 py-0.5 text-[11px] font-extrabold"
              style={{
                background: "rgba(239,68,68,0.95)",
                boxShadow: "0 8px 18px rgba(239,68,68,0.20)",
              }}
            >
              {unread}
            </span>
          )}
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          className="fixed z-50 bottom-6 right-6 flex flex-col overflow-hidden rounded-2xl border shadow-2xl"
          style={{
            width: "min(92vw, 22.5rem)",
            height: leadOpen ? "33.5rem" : "28.5rem",
            background: "rgba(255,255,255,0.96)",
            borderColor: "var(--border)",
            animation: "adSlideIn 0.42s cubic-bezier(0.45,0,0.25,1)",
          }}
          role="dialog"
          aria-label="AD Interior Design Assistant"
          aria-modal="false"
        >
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between bg-[--surface] text-[--foreground] border-b border-[--border]">
            <div className="flex items-center gap-2.5">
              <div
                className="h-8 w-8 rounded-full grid place-items-center font-extrabold text-[11px] border border-[--border]"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(201,162,106,0.22), rgba(15,23,42,0.08) 55%, rgba(51,65,85,0.10) 100%)",
                }}
                aria-hidden="true"
              >
                AD
              </div>

              <div className="leading-tight">
                <div className="font-extrabold text-sm inline-flex items-center gap-2">
                  AD Interior Assistant
                  <span className="badge" style={{ fontSize: 12, padding: "0.18rem 0.55rem" }}>
                    <Sparkles size={14} /> Quick quote
                  </span>
                </div>
                <div className="text-[11px] text-[--muted] mt-0.5">
                  {stage === "lead"
                    ? "Quote request"
                    : "Online • TV stands • Wall panels • Wardrobes • Kitchens"}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-9 w-9 rounded-lg grid place-items-center border border-[--border] bg-[--surface-2] hover:opacity-90"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm bg-[--background]">
            {messages.map((m, i) => {
              const isUser = m.sender === "user";
              return (
                <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`px-3 py-2 rounded-2xl max-w-[85%] whitespace-pre-line border ${
                      isUser
                        ? "bg-black/5 text-[--foreground] border-black/10"
                        : "bg-[--surface] text-[--foreground] border-[--border]"
                    }`}
                    style={{
                      boxShadow: isUser ? "none" : "0 10px 22px rgba(2,6,23,0.06)",
                      animation: "adBubbleIn 160ms ease-out",
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}

            {typing && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-2xl bg-[--surface] border border-[--border] text-[--foreground]">
                  <span className="ad-typing-dot" />
                  <span className="ad-typing-dot" style={{ animationDelay: "120ms" }} />
                  <span className="ad-typing-dot" style={{ animationDelay: "240ms" }} />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quote Form */}
          {leadOpen && (
            <div className="p-3 border-t border-[--border] bg-[--surface] space-y-2 text-sm text-[--foreground]">
              <div className="flex items-center justify-between">
                <div className="font-extrabold text-sm inline-flex items-center gap-2">
                  <ClipboardList size={16} />
                  Quote details
                </div>
                <a
                  href={waLink("Hi AD Interior Design 👋 I’d like a quote (I’ll send photos and measurements).")}
                  className="text-xs inline-flex items-center gap-1 text-[--muted] hover:underline"
                  aria-label="Open WhatsApp without form"
                >
                  Skip form <ExternalLink size={14} />
                </a>
              </div>

              <input
                value={lead.name}
                onChange={(e) => setLead((s) => ({ ...s, name: e.target.value }))}
                placeholder="Your name"
                className="input"
              />
              <input
                value={lead.phone}
                onChange={(e) => setLead((s) => ({ ...s, phone: e.target.value }))}
                placeholder="Phone (optional)"
                className="input"
              />

              <div className="flex gap-2">
                <input
                  value={lead.projectType}
                  onChange={(e) => setLead((s) => ({ ...s, projectType: e.target.value }))}
                  placeholder="Project (TV stand / Panels / Wardrobe / Kitchen)"
                  className="input"
                />
                <input
                  value={lead.city}
                  onChange={(e) => setLead((s) => ({ ...s, city: e.target.value }))}
                  placeholder="City/Town"
                  className="input"
                />
              </div>

              <div className="flex gap-2">
                <input
                  value={lead.space}
                  onChange={(e) => setLead((s) => ({ ...s, space: e.target.value }))}
                  placeholder="Space (Lounge / Bedroom / Office)"
                  className="input"
                />
                <input
                  value={lead.timeline}
                  onChange={(e) => setLead((s) => ({ ...s, timeline: e.target.value }))}
                  placeholder="Timeline (ASAP / This month / Next month)"
                  className="input"
                />
              </div>

              <input
                value={lead.budget}
                onChange={(e) => setLead((s) => ({ ...s, budget: e.target.value }))}
                placeholder="Budget range (optional)"
                className="input"
              />

              <textarea
                rows={2}
                value={lead.note}
                onChange={(e) => setLead((s) => ({ ...s, note: e.target.value }))}
                placeholder="Notes: measurements, colors, finish (gloss/matte), TV size, marble/slats, LED…"
                className="input"
              />

              <div className="flex gap-2 pt-1">
                <button type="button" onClick={submitLead} className="btn btn-whatsapp">
                  <Phone size={18} /> Send to WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLeadOpen(false);
                    setStage("inquire");
                    setSuggestions(DEFAULT_SUGGESTIONS);
                  }}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {!leadOpen && suggestions.length > 0 && (
            <div className="px-3 py-2 border-t border-[--border] bg-[--surface] flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button
                  key={`${s}-${i}`}
                  type="button"
                  onClick={() => onSuggestion(s)}
                  className="text-xs px-3 py-1 rounded-full border border-[--border] text-[--foreground] hover:bg-black/5 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          {!leadOpen && (
            <div className="flex p-3 border-t border-[--border] bg-[--surface] gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                placeholder="Ask: TV stand, wall panels, wardrobes, kitchen…"
                className="flex-1 input"
                aria-label="Type your message"
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => sendMessage()}
                aria-label="Send message"
              >
                <Send size={18} />
                Send
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        @keyframes adSlideIn {
          from {
            transform: translateY(18px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes adBubbleIn {
          from {
            transform: scale(0.985);
            opacity: 0.7;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes adTyping {
          0%,
          80%,
          100% {
            transform: scale(0);
            opacity: 0.35;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .ad-typing-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          margin-right: 4px;
          background: linear-gradient(
            90deg,
            rgba(15, 23, 42, 0.92),
            rgba(201, 162, 106, 0.92),
            rgba(51, 65, 85, 0.92)
          );
          border-radius: 999px;
          animation: adTyping 1.35s infinite ease-in-out;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </>
  );
}
