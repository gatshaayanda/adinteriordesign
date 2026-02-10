// src/app/claims/page.tsx
"use client";

import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  MessageCircle,
  AlertTriangle,
  Clock,
  Car,
  Home,
  HeartPulse,
  Briefcase,
  CheckCircle2,
} from "lucide-react";

const WHATSAPP_NUMBER = "+26772971852";

function waLink(message: string) {
  const digits = WHATSAPP_NUMBER.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

const BASE_WHATSAPP = "Hi Sparkle Legacy 👋 I need help with a claim.";

export default function ClaimsPage() {
  return (
    <main id="main" className="bg-[--background] text-[--foreground]">
      {/* HERO */}
      <section className="container py-10 md:py-14">
        <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="p-6 md:p-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/10 text-xs">
              <ShieldCheck size={14} />
              Sparkle Legacy • Claims Support
            </div>

            <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight">
              Claims help — clear steps, fast guidance
            </h1>

            <p className="mt-3 text-white/70 max-w-2xl">
              If something happened, don’t stress. Share the basics and we’ll guide you
              on the next steps, required documents, and timelines.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href={waLink(
                  `${BASE_WHATSAPP}\n\nClaim type (Motor/Home/Life/Funeral/Business):\nDate of incident:\nWhat happened:\nLocation:\nYour name:\nPhone:\n\n(Attach photos/documents if you have them.)`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <MessageCircle size={18} />
                Start Claim on WhatsApp
              </a>

              <Link href="/contact" className="btn btn-outline" prefetch={false}>
                <FileText size={18} />
                Contact / Office Info
              </Link>

              <Link href="/c/short-term" className="btn btn-outline" prefetch={false}>
                Browse Cover Types
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 font-semibold">
                  <Clock size={16} />
                  Faster processing
                </div>
                <p className="text-sm text-white/70 mt-2">
                  Submit clear photos and documents early to reduce back-and-forth.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 size={16} />
                  Clear requirements
                </div>
                <p className="text-sm text-white/70 mt-2">
                  We’ll tell you exactly what’s needed based on your product.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertTriangle size={16} />
                  Avoid delays
                </div>
                <p className="text-sm text-white/70 mt-2">
                  Report incidents ASAP and keep claim details consistent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLAIM TYPE QUICK PICKS */}
      <section className="container pb-8">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">
          Choose your claim type
        </h2>
        <p className="text-white/70 mt-2 max-w-2xl">
          Tap one — it opens WhatsApp with a ready-to-send message template.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ClaimCard
            title="Motor claim"
            icon={<Car size={18} />}
            desc="Accident, theft, windscreen, damage."
            message={`${BASE_WHATSAPP}\n\nType: Motor\nIncident date:\nLocation:\nWhat happened:\nVehicle:\nRegistration:\nPolice report (if any):\nYour name & phone:\n\nAttachments: photos, police report, license/ID, repair quote (if available).`}
          />
          <ClaimCard
            title="Home / contents"
            icon={<Home size={18} />}
            desc="Fire, theft, storm damage, burglary."
            message={`${BASE_WHATSAPP}\n\nType: Home/Contents\nIncident date:\nLocation:\nWhat happened:\nItems affected:\nPolice report (if theft):\nYour name & phone:\n\nAttachments: photos, inventory/list, receipts (if any), police report (if theft).`}
          />
          <ClaimCard
            title="Life / disability"
            icon={<HeartPulse size={18} />}
            desc="Life claim, disability/income protection."
            message={`${BASE_WHATSAPP}\n\nType: Life/Disability\nEvent date:\nPolicy holder name:\nClaimant name:\nWhat happened:\nYour contact:\n\nAttachments: ID, claim forms, medical docs (if applicable), any policy reference.`}
          />
          <ClaimCard
            title="Business / SME"
            icon={<Briefcase size={18} />}
            desc="Assets, liability, fleet, interruption."
            message={`${BASE_WHATSAPP}\n\nType: Business/SME\nIncident date:\nBusiness name:\nLocation:\nWhat happened:\nItems/asset affected:\nYour contact:\n\nAttachments: photos, invoices/asset list, police report (if theft), supporting docs.`}
          />
        </div>
      </section>

      {/* STEP-BY-STEP */}
      <section className="container py-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
            <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
              <ShieldCheck size={18} />
              How claims usually work
            </h3>

            <ol className="mt-4 space-y-3 text-sm text-white/75">
              <li className="flex gap-3">
                <span className="mt-0.5 h-6 w-6 rounded-full bg-white/10 border border-white/10 grid place-items-center text-xs font-bold">
                  1
                </span>
                <span>
                  <b className="text-white/90">Report the incident</b> — share the date,
                  what happened, and where.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 h-6 w-6 rounded-full bg-white/10 border border-white/10 grid place-items-center text-xs font-bold">
                  2
                </span>
                <span>
                  <b className="text-white/90">Send supporting evidence</b> — photos,
                  forms, police report (if required), medical/repair documents.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 h-6 w-6 rounded-full bg-white/10 border border-white/10 grid place-items-center text-xs font-bold">
                  3
                </span>
                <span>
                  <b className="text-white/90">Assessment</b> — insurer reviews and may
                  request additional info.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 h-6 w-6 rounded-full bg-white/10 border border-white/10 grid place-items-center text-xs font-bold">
                  4
                </span>
                <span>
                  <b className="text-white/90">Decision & settlement</b> — repair, replace,
                  or pay-out based on policy terms.
                </span>
              </li>
            </ol>

            <div className="mt-5 flex flex-col sm:flex-row gap-2">
              <a
                href={waLink(`${BASE_WHATSAPP}\n\nWhat documents do you need for my claim?`)}
                className="btn btn-outline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText size={18} />
                Ask for required documents
              </a>
              <a
                href={waLink(BASE_WHATSAPP)}
                className="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={18} />
                Chat now
              </a>
            </div>
          </div>

          {/* CHECKLIST */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
            <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
              <FileText size={18} />
              Helpful checklist (general)
            </h3>

            <p className="text-sm text-white/70 mt-3">
              Exact requirements depend on the insurer/product — but this usually helps:
            </p>

            <ul className="mt-4 space-y-2 text-sm text-white/75">
              {[
                "ID / Omang (or passport) for policyholder/claimant",
                "Policy number or quote reference (if available)",
                "Incident date/time and location",
                "Clear photos/videos of damage / scene",
                "Police report (theft/accident where required)",
                "Medical report / death certificate (life/funeral, where applicable)",
                "Repair quotes / invoices (motor/home/business)",
                "Any claim forms provided by the insurer",
              ].map((x) => (
                <li key={x} className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-white/40" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="mt-0.5" />
                <p className="text-sm text-white/75">
                  If it’s urgent (injury, theft, major damage), message us immediately on
                  WhatsApp so we can guide the safest next steps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOT NOTE */}
      <section className="container pb-14">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
          <b className="text-white/85">Note:</b> Cover terms, premiums, and benefits depend on
          insurer underwriting and your policy wording. If you’re unsure, ask us and we’ll
          clarify.
        </div>
      </section>
    </main>
  );
}

function ClaimCard({
  title,
  desc,
  icon,
  message,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  message: string;
}) {
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition block"
    >
      <div className="flex items-center gap-2 font-semibold">
        {icon}
        {title}
      </div>
      <p className="text-sm text-white/70 mt-2">{desc}</p>
      <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[--foreground]">
        <MessageCircle size={16} />
        Start on WhatsApp
      </div>
    </a>
  );
}
