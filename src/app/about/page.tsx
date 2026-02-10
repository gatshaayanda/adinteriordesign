// src/app/about/page.tsx
"use client";

import Link from "next/link";
import {
  ShieldCheck,
  MessageCircle,
  FileText,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const WHATSAPP_NUMBER = "+26772971852";

function waLink(message: string) {
  const digits = WHATSAPP_NUMBER.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export default function AboutPage() {
  return (
    <main id="main" className="bg-[--background] text-[--foreground]">
      {/* HERO */}
      <section className="container py-10 md:py-14">
        <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="p-6 md:p-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/10 text-xs">
              <ShieldCheck size={14} />
              Sparkle Legacy • About
            </div>

            <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight">
              A modern insurance broker experience — built for clarity.
            </h1>

            <p className="mt-4 text-white/70 max-w-3xl">
              Sparkle Legacy helps individuals and businesses in Botswana request quotes,
              understand cover, and navigate claims with confidence. We keep it simple,
              transparent, and WhatsApp-first for fast support.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href={waLink(
                  "Hi Sparkle Legacy 👋 I’d like help choosing the right cover.\n\nName:\nCity/Town:\nWhat do you need insured?"
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
              </a>

              <Link href="/c/short-term" className="btn btn-outline" prefetch={false}>
                Browse Cover Types
                <ArrowRight size={18} />
              </Link>

              <Link href="/claims" className="btn btn-outline" prefetch={false}>
                Claims Help
                <FileText size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="container pb-12">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
              <Sparkles size={18} />
              What we help with
            </h2>

            <ul className="mt-4 space-y-2 text-sm text-white/75">
              {[
                "Short-Term cover: motor, home & contents, travel, gadgets, liability",
                "Long-Term cover: life, funeral, disability, dread disease",
                "Retirement & wealth: planning, savings, annuities (product-dependent)",
                "SME cover: assets, liability, fleet, business continuity",
                "Claims support: guidance on steps, forms, and required documents",
              ].map((x) => (
                <li key={x} className="flex gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 opacity-80" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5">
              <Link href="/contact" className="btn btn-outline w-full" prefetch={false}>
                Contact
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
              <ShieldCheck size={18} />
              How it works
            </h2>

            <ol className="mt-4 space-y-3 text-sm text-white/75">
              {[
                {
                  title: "Tell us what you need",
                  desc: "Message us the product, city/town, and basic details.",
                },
                {
                  title: "We confirm requirements",
                  desc: "We’ll tell you what docs/info are needed for a clean quote or claim.",
                },
                {
                  title: "We help you choose",
                  desc: "We explain options in simple language before you commit.",
                },
                {
                  title: "We support you after",
                  desc: "Need help updating cover or submitting a claim? We guide the steps.",
                },
              ].map((s) => (
                <li key={s.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="font-semibold text-white/90">{s.title}</div>
                  <div className="mt-1 text-white/70">{s.desc}</div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
              <FileText size={18} />
              What to send (fastest results)
            </h2>

            <p className="mt-3 text-sm text-white/70">
              When requesting quotes or claims, sharing the right details saves time.
            </p>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white/85">Quotes</div>
              <ul className="mt-2 space-y-2 text-sm text-white/75">
                {[
                  "Cover type + product",
                  "City/Town",
                  "Key details (e.g. car model/registration, sum assured, dependants)",
                  "Name + phone (optional)",
                ].map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-white/40" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white/85">Claims</div>
              <ul className="mt-2 space-y-2 text-sm text-white/75">
                {[
                  "Incident date + what happened",
                  "Location + photos/evidence",
                  "Forms / supporting documents (as available)",
                  "Policy or reference (if you have it)",
                ].map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-white/40" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <a
                href={waLink(
                  "Hi Sparkle Legacy 👋 What documents do you need for my quote/claim?\n\nProduct:\nCover type:\nCity/Town:"
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full"
              >
                <MessageCircle size={18} />
                Ask on WhatsApp
              </a>

              <Link href="/claims" className="btn btn-outline w-full" prefetch={false}>
                Claims Page
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-8 text-xs text-white/55">
          Note: Cover terms, premiums, exclusions, and benefits depend on insurer underwriting
          and policy wording.
        </p>
      </section>
    </main>
  );
}
