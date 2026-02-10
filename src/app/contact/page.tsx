// src/app/contact/page.tsx
"use client";

import Link from "next/link";
import {
  MessageCircle,
  PhoneCall,
  MapPin,
  Clock,
  FileText,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const WHATSAPP_NUMBER = "+267 77 807 112";

function waLink(message: string) {
  const digits = WHATSAPP_NUMBER.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function telLink() {
  return `tel:${WHATSAPP_NUMBER.replace(/[^\d+]/g, "")}`;
}

export default function ContactPage() {
  const quoteTemplate = [
    "Hi AD Interior Design 👋",
    "",
    "I’d like a quote.",
    "",
    "Project type (TV stand / wall panels / wardrobe / kitchen / ceiling / doors):",
    "City/Town:",
    "Measurements (W×H):",
    "Finish (slats/marble/wood/gloss/matte):",
    "Notes:",
    "",
    "I will send photos/video of the space.",
  ].join("\n");

  const callbackTemplate = [
    "Hi AD Interior Design 👋",
    "",
    "Please call me back.",
    "",
    "Name:",
    "City/Town:",
    "Best time to call:",
    "Project type:",
  ].join("\n");

  const requirementsTemplate = [
    "Hi AD Interior Design 👋",
    "",
    "What do you need from me for an accurate quote?",
    "",
    "My project type is:",
    "My city/town is:",
  ].join("\n");

  return (
    <main id="main" className="bg-[--background] text-[--foreground]">
      {/* HERO */}
      <section className="border-b border-[--border] bg-[--background]">
        <div className="container py-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[--border] bg-[--surface] text-xs font-semibold text-[--muted]">
              <ShieldCheck size={14} className="text-[--brand-accent]" />
              AD Interior Design • Contact
            </div>

            <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight">
              Contact us on WhatsApp
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[--muted] leading-relaxed">
              Fastest way to get a quote is WhatsApp. Send your <b>city/town</b>,{" "}
              <b>measurements (W×H)</b>, and a <b>photo/video</b> of the space.
              We’ll guide finish options and confirm timeline + price.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <a href={waLink(quoteTemplate)} className="btn btn-primary">
                <MessageCircle size={18} />
                Get a Quote on WhatsApp
              </a>

              <a href={telLink()} className="btn btn-outline">
                <PhoneCall size={18} />
                Call
              </a>

              <Link href="/gallery" prefetch={false} className="btn btn-outline">
                View Gallery
                <ArrowRight size={18} />
              </Link>
            </div>

            <p className="mt-4 text-xs text-[--muted]">
              WhatsApp / Call: <b>{WHATSAPP_NUMBER}</b>
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT OPTIONS */}
      <section className="py-14">
        <div className="container">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Quote Card */}
            <div className="rounded-2xl border border-[--border] bg-[--surface] p-6 shadow-[var(--shadow)]">
              <div className="flex items-center gap-2 font-semibold">
                <span className="grid place-items-center h-9 w-9 rounded-xl border border-[--border] bg-[--surface-2]">
                  <MessageCircle size={18} />
                </span>
                Quote request
              </div>

              <p className="mt-3 text-sm text-[--muted] leading-relaxed">
                Tap below to open WhatsApp with a ready-to-send quote template.
              </p>

              <div className="mt-5 flex flex-col gap-2">
                <a href={waLink(quoteTemplate)} className="btn btn-primary w-full">
                  <MessageCircle size={18} />
                  WhatsApp Quote
                </a>

                <a
                  href={waLink(requirementsTemplate)}
                  className="btn btn-outline w-full"
                >
                  <FileText size={18} />
                  Ask what’s needed
                </a>
              </div>
            </div>

            {/* Callback Card */}
            <div className="rounded-2xl border border-[--border] bg-[--surface] p-6 shadow-[var(--shadow)]">
              <div className="flex items-center gap-2 font-semibold">
                <span className="grid place-items-center h-9 w-9 rounded-xl border border-[--border] bg-[--surface-2]">
                  <PhoneCall size={18} />
                </span>
                Request a callback
              </div>

              <p className="mt-3 text-sm text-[--muted] leading-relaxed">
                If you prefer a call, send your details and best time to call.
              </p>

              <div className="mt-5 flex flex-col gap-2">
                <a href={waLink(callbackTemplate)} className="btn btn-primary w-full">
                  <PhoneCall size={18} />
                  WhatsApp callback request
                </a>

                <a href={telLink()} className="btn btn-outline w-full">
                  <PhoneCall size={18} />
                  Call now
                </a>
              </div>
            </div>

            {/* Visit / Hours Card */}
            <div className="rounded-2xl border border-[--border] bg-[--surface] p-6 shadow-[var(--shadow)]">
              <div className="flex items-center gap-2 font-semibold">
                <span className="grid place-items-center h-9 w-9 rounded-xl border border-[--border] bg-[--surface-2]">
                  <MapPin size={18} />
                </span>
                Location & hours
              </div>

              <p className="mt-3 text-sm text-[--muted] leading-relaxed">
                We primarily work by WhatsApp quoting and scheduled installs.
                Share your city/town so we can confirm availability.
              </p>

              <div className="mt-5 rounded-2xl border border-[--border] bg-[--background] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Clock size={16} />
                  Typical response time
                </div>
                <p className="mt-2 text-sm text-[--muted] leading-relaxed">
                  Quick replies on WhatsApp during the day. Install timelines are
                  confirmed per project.
                </p>
              </div>

              <div className="mt-5">
                <a
                  href={waLink(
                    "Hi AD Interior Design 👋\n\nMy city/town is:\nMy project type is:\nCan you confirm availability and timeline?"
                  )}
                  className="btn btn-outline w-full"
                >
                  <MessageCircle size={18} />
                  Ask about availability
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SMALL HELP STRIP */}
      <section className="py-14 bg-[--surface] border-y border-[--border]">
        <div className="container">
          <div className="rounded-3xl border border-[--border] bg-[--background] p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Want the fastest quote?
                </h2>
                <p className="text-[--muted] mt-2 max-w-2xl leading-relaxed">
                  Send <b>measurements</b> + <b>photos/video</b> + your preferred{" "}
                  <b>finish</b>. If you don’t know measurements yet, just send a
                  photo and we’ll guide you.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a href={waLink(quoteTemplate)} className="btn btn-primary">
                  <MessageCircle size={18} />
                  WhatsApp Quote
                </a>

                <Link href="/services" prefetch={false} className="btn btn-outline">
                  Browse Services <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>

          <p className="mt-6 text-xs text-[--muted] text-center">
            WhatsApp / Call: <b>{WHATSAPP_NUMBER}</b>
          </p>
        </div>
      </section>
    </main>
  );
}
