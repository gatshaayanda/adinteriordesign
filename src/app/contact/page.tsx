// src/app/contact/page.tsx
"use client";

import Link from "next/link";
import {
  MessageCircle,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  FileText,
  ArrowRight,
} from "lucide-react";

const WHATSAPP_NUMBER = "+26772971852";
const EMAIL = "sparklelegacyinsurancebrokers@gmail.com"; // change if needed

function waLink(message: string) {
  const digits = WHATSAPP_NUMBER.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export default function ContactPage() {
  const waGeneral = waLink(
    "Hi Sparkle Legacy 👋 I need help with a quote / policy / claim.\n\nName:\nCity/Town:\nTopic:\nDetails:"
  );

  const waQuote = waLink(
    "Hi Sparkle Legacy 👋 I’d like a quote.\n\nCover type (Short-Term / Long-Term / SME / Retirement):\nProduct:\nCity/Town:\nName:\nPhone (optional):\nNotes (optional):"
  );

  const waClaim = waLink(
    "Hi Sparkle Legacy 👋 I need help with a claim.\n\nClaim type (Motor/Home/Life/Funeral/Business):\nIncident date:\nLocation:\nWhat happened:\nName:\nPhone:\n\n(Attach photos/documents if available.)"
  );

  return (
    <main id="main" className="bg-[--background] text-[--foreground]">
      {/* HERO */}
      <section className="container py-10 md:py-14">
        <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="p-6 md:p-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/10 text-xs">
              <ShieldCheck size={14} />
              Sparkle Legacy • Contact
            </div>

            <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight">
              Contact Sparkle Legacy
            </h1>

            <p className="mt-3 text-white/70 max-w-2xl">
              WhatsApp-first support for quotes, policies, and claims. If you prefer email,
              you can reach us there too.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href={waGeneral}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
              </a>

              <a href={`mailto:${EMAIL}`} className="btn btn-outline">
                <Mail size={18} />
                Email Us
              </a>

              <Link href="/claims" className="btn btn-outline" prefetch={false}>
                <FileText size={18} />
                Claims Help
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT GRID */}
      <section className="container pb-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* WhatsApp */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
              <MessageCircle size={18} />
              WhatsApp Support
            </h2>

            <p className="text-sm text-white/70 mt-2">
              Best for fast replies, document sharing, and quote requests.
            </p>

            <div className="mt-4 space-y-2 text-sm text-white/75">
              <div className="flex items-center gap-2">
                <PhoneCall size={16} />
                <span>{WHATSAPP_NUMBER}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>Typical response: ASAP (WhatsApp-first)</span>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <a
                href={waQuote}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full"
              >
                <MessageCircle size={18} />
                Request a Quote
              </a>
              <a
                href={waClaim}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline w-full"
              >
                <FileText size={18} />
                Start a Claim
              </a>
              <a
                href={waLink(
                  "Hi Sparkle Legacy 👋 Please call me back.\n\nName:\nBest time:\nTopic (quote/policy/claim):"
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline w-full"
              >
                <PhoneCall size={18} />
                Request a Callback
              </a>
            </div>

            <p className="mt-4 text-xs text-white/55">
              Tip: Attach clear photos/PDFs (ID, forms, evidence) to speed things up.
            </p>
          </div>

          {/* Email */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
              <Mail size={18} />
              Email
            </h2>

            <p className="text-sm text-white/70 mt-2">
              Use email for longer detail, formal submissions, or follow-ups.
            </p>

            <div className="mt-4 space-y-2 text-sm text-white/75">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <a className="hover:underline" href={`mailto:${EMAIL}`}>
                  {EMAIL}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>Response: same day where possible</span>
              </div>
            </div>

            <div className="mt-5">
              <a href={`mailto:${EMAIL}`} className="btn btn-primary w-full">
                <Mail size={18} />
                Compose Email
              </a>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-white/75">
                Include: cover type, product, city/town, and key details (e.g. car model,
                sum assured, dependants).
              </p>
            </div>
          </div>

          {/* Location / Notes */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
              <MapPin size={18} />
              Details
            </h2>

            <p className="text-sm text-white/70 mt-2">
              If you want us to guide you faster, send the basics below.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-white/75">
              {[
                "Your name + city/town",
                "Cover type (Short-Term / Long-Term / SME / Retirement)",
                "Product (Motor, Home, Funeral, Life, etc.)",
                "If claim: incident date + what happened",
                "Any supporting docs/photos",
              ].map((x) => (
                <li key={x} className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-white/40" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-col gap-2">
              <Link href="/c/short-term" className="btn btn-outline w-full" prefetch={false}>
                Browse Short-Term
                <ArrowRight size={18} />
              </Link>
              <Link href="/c/long-term" className="btn btn-outline w-full" prefetch={false}>
                Browse Long-Term
                <ArrowRight size={18} />
              </Link>
              <Link href="/c/retirement" className="btn btn-outline w-full" prefetch={false}>
                Retirement & Wealth
                <ArrowRight size={18} />
              </Link>
            </div>

            <p className="mt-4 text-xs text-white/55">
              Cover terms, premiums, and benefits depend on insurer underwriting and policy
              wording.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
