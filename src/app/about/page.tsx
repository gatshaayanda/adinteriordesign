// src/app/about/page.tsx
"use client";

import Link from "next/link";
import {
  Sparkles,
  Ruler,
  Wrench,
  MessageCircle,
  ShieldCheck,
  ArrowRight,
  Home,
  PanelsTopLeft,
  LayoutGrid,
  Sofa,
} from "lucide-react";

const WHATSAPP_NUMBER = "+267 77 807 112";

function waLink(message: string) {
  const digits = WHATSAPP_NUMBER.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export default function AboutPage() {
  const whatsappMsg = waLink(
    [
      "Hi AD Interior Design 👋",
      "",
      "I’d like to ask about your services.",
      "",
      "Project type:",
      "City/Town:",
      "Measurements (W×H):",
      "Finish (slats/marble/wood/gloss/matte):",
      "",
      "I will send photos/video of the space.",
    ].join("\n")
  );

  return (
    <main id="main" className="bg-[--background] text-[--foreground]">
      {/* HERO */}
      <section className="border-b border-[--border] bg-[--background]">
        <div className="container py-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[--border] bg-[--surface] text-xs font-semibold text-[--muted]">
              <Sparkles size={14} className="text-[--brand-accent]" />
              AD Interior Design • Botswana
            </div>

            <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight">
              About AD Interior Design
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[--muted] leading-relaxed">
              AD Interior Design specializes in premium custom interior builds —
              TV stands, wall panels (slats & marble), wardrobes, kitchens,
              ceilings and clean modern finishes.
            </p>

            <p className="mt-4 text-base sm:text-lg text-[--muted] leading-relaxed">
              We focus on strong workmanship, clean lines, neat installation and
              a smooth quoting process. Send measurements + photos/video of your
              space and we’ll guide you from design to final installation.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <a href={whatsappMsg} className="btn btn-primary">
                <MessageCircle size={18} />
                WhatsApp Us
              </a>

              <Link href="/services" prefetch={false} className="btn btn-outline">
                View Services
                <ArrowRight size={18} />
              </Link>

              <Link href="/gallery" prefetch={false} className="btn btn-outline">
                View Gallery
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="badge inline-flex items-center gap-2">
                <Ruler size={14} /> Measurements guided
              </span>
              <span className="badge inline-flex items-center gap-2">
                <Wrench size={14} /> Installation available
              </span>
              <span className="badge inline-flex items-center gap-2">
                <ShieldCheck size={14} /> Clean premium finishes
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="py-14">
        <div className="container">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              What we do
            </h2>

            <p className="mt-3 text-[--muted] leading-relaxed">
              We build custom interior solutions for homes, apartments and small
              business spaces. Our work is designed to look modern, clean and
              premium — while still being practical for everyday use.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-8">
            {[
              {
                icon: <LayoutGrid size={18} />,
                title: "TV Stands / Wall Units",
                desc: "Modern floating designs, storage layouts and LED-ready builds.",
                href: "/c/tv-stands",
              },
              {
                icon: <PanelsTopLeft size={18} />,
                title: "Wall Panels",
                desc: "Slats & marble feature walls that upgrade the whole space instantly.",
                href: "/c/wall-panels",
              },
              {
                icon: <Sofa size={18} />,
                title: "Wardrobes",
                desc: "Sliding or hinged wardrobes, clean finishing and custom compartments.",
                href: "/c/wardrobes",
              },
              {
                icon: <Home size={18} />,
                title: "Kitchens & Cabinets",
                desc: "Strong cabinetry builds with clean lines and practical storage.",
                href: "/c/kitchens",
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                prefetch={false}
                className="rounded-2xl border border-[--border] bg-[--surface] p-5 shadow-[var(--shadow)] hover:bg-[--surface-2] transition"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <span className="grid place-items-center h-9 w-9 rounded-xl border border-[--border] bg-[--surface-2]">
                    {item.icon}
                  </span>
                  {item.title}
                </div>

                <p className="text-sm text-[--muted] mt-2 leading-relaxed">
                  {item.desc}
                </p>

                <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                  View category <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-14 bg-[--surface] border-y border-[--border]">
        <div className="container">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              How the process works
            </h2>

            <p className="mt-3 text-[--muted] leading-relaxed">
              We keep the process simple. You send the basics, we confirm the
              finish and layout, then we build and install.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 mt-8">
            {[
              {
                icon: <Ruler size={18} />,
                title: "Step 1: Send measurements",
                desc: "Send wall width & height, plus photos/video of the space.",
              },
              {
                icon: <Sparkles size={18} />,
                title: "Step 2: Confirm finish",
                desc: "Choose slats, marble, wood, gloss or matte finish.",
              },
              {
                icon: <Wrench size={18} />,
                title: "Step 3: Build + install",
                desc: "We confirm timeline and deliver a clean final installation.",
              },
            ].map((step) => (
              <div
                key={step.title}
                className="rounded-2xl border border-[--border] bg-[--background] p-5"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <span className="grid place-items-center h-9 w-9 rounded-xl border border-[--border] bg-[--surface]">
                    {step.icon}
                  </span>
                  {step.title}
                </div>

                <p className="text-sm text-[--muted] mt-2 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-14">
        <div className="container">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Why clients choose us
            </h2>

            <p className="mt-3 text-[--muted] leading-relaxed">
              We’re not just selling a build — we’re delivering a finished look.
              We focus on neat finishing, strong materials and professional
              installation.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            {[
              {
                title: "Clean finishing",
                desc: "Neat edges, clean panel alignment and professional installs.",
              },
              {
                title: "Fast quoting",
                desc: "Send measurements + photos/video and we quote quickly on WhatsApp.",
              },
              {
                title: "Guided recommendations",
                desc: "We help you choose the right layout and finish for your space.",
              },
              {
                title: "Modern styles",
                desc: "Minimal, premium interior looks that match current trends.",
              },
              {
                title: "Custom builds",
                desc: "Each project is built around your wall size, TV size and storage needs.",
              },
              {
                title: "Installation support",
                desc: "We confirm timeline clearly and handle installation where available.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[--border] bg-[--surface] p-5"
              >
                <div className="font-semibold">{item.title}</div>
                <p className="text-sm text-[--muted] mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-14 bg-[--surface] border-t border-[--border]">
        <div className="container">
          <div className="rounded-3xl border border-[--border] bg-[--background] p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Want a quote?
                </h3>
                <p className="text-[--muted] mt-2 max-w-2xl leading-relaxed">
                  Send your city/town + measurements + photos/video of the space.
                  We’ll confirm finish options, timeline, and total cost.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a href={whatsappMsg} className="btn btn-primary">
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
            WhatsApp: {WHATSAPP_NUMBER}
          </p>
        </div>
      </section>
    </main>
  );
}
