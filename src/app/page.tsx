// src/app/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MessageCircle,
  Sparkles,
  Ruler,
  Wrench,
  Clock,
  ArrowRight,
  Images,
  Sofa,
  PanelsTopLeft,
  Home,
  LayoutGrid,
} from "lucide-react";

import { firestore } from "@/utils/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

type Project = {
  id: string;
  imageUrl?: string;
  title?: string;
  desc?: string;
  showOnHome?: boolean;
  order?: number;
  isHero?: boolean;
};

const WHATSAPP_NUMBER = "+267 77 807 112";

function waLink(message: string) {
  const digits = WHATSAPP_NUMBER.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export default function HomePage() {
  const [hero, setHero] = useState<Project | null>(null);
  const [featured, setFeatured] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(firestore, "projects"));
        const data = snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as any) }))
          .sort(
            (a: Project, b: Project) => (a.order ?? 999) - (b.order ?? 999)
          ) as Project[];

        const heroPick = data.find((p) => !!p.isHero) || data[0] || null;
        const homeCards = data.filter((p) => p.showOnHome && !p.isHero).slice(0, 6);

        setHero(heroPick);
        setFeatured(homeCards);
      } catch (e) {
        console.error("Home load failed:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const serviceCards = useMemo(
    () => [
      {
        icon: <LayoutGrid size={18} />,
        title: "TV Stands / Wall Units",
        desc: "Clean modern units, floating designs, storage + LED options.",
        href: "/services",
        wa: "TV stand / wall unit",
      },
      {
        icon: <PanelsTopLeft size={18} />,
        title: "Wall Panels (Slats / Marble)",
        desc: "Feature walls that elevate the whole room instantly.",
        href: "/services",
        wa: "Wall panels (slats / marble)",
      },
      {
        icon: <Sofa size={18} />,
        title: "Wardrobes / Closets",
        desc: "Custom storage layouts, sliding or hinged, premium finishes.",
        href: "/services",
        wa: "Wardrobes / closets",
      },
      {
        icon: <Home size={18} />,
        title: "Kitchens & Cabinets",
        desc: "Practical layouts, strong finishes, built for daily use.",
        href: "/services",
        wa: "Kitchen / cabinets",
      },
    ],
    []
  );

  const whatsappQuote = (projectType?: string) =>
    waLink(
      `Hi AD Interior Design 👋 I’d like a quote.\n\nProject: ${projectType || ""}\nCity/Town:\nMeasurements (W×H):\nFinish (slats/marble/wood/gloss/matte):\nNotes:\n\nI will send photos/video of the space.`
        .trim()
    );

  return (
    <main id="main" className="bg-[--background] text-[--foreground] overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-6">
        {/* Background image (optional) */}
        {hero?.imageUrl ? (
          <Image
            src={hero.imageUrl}
            alt={hero?.title || "AD Interior Design"}
            fill
            priority
            className="object-cover opacity-30"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(900px 520px at 20% -10%, rgba(14,165,233,0.22), transparent 60%), radial-gradient(760px 460px at 90% 0%, rgba(20,184,166,0.18), transparent 55%), #070b14",
            }}
          />
        )}

        {/* Strong overlay so text ALWAYS reads */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/95" />

        {/* FORCE HERO CONTENT WHITE */}
        <div className="relative z-10 text-center max-w-4xl text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 text-xs text-white">
            <Sparkles size={14} />
            Botswana • Custom Interiors • Installations
          </div>

          <h1 className="mt-6 text-5xl md:text-6xl font-extrabold tracking-tight text-white">
            AD Interior Design
            <span className="block text-xl md:text-2xl text-white/90 mt-3">
              TV Stands • Wall Panels • Wardrobes • Kitchens
            </span>
          </h1>

          {/* ✅ Make this paragraph clearly readable */}
<p
  className="mt-5 max-w-2xl mx-auto leading-relaxed"
  style={{
    color: "#ffffff",
    opacity: 1,
    position: "relative",
    zIndex: 30,
    textShadow: "0 4px 24px rgba(0,0,0,0.85)",
  }}
>
  Premium interior builds with clean finishes. Send measurements + a photo/video of your space
  and we’ll quote fast on WhatsApp.
</p>


          {/* ✅ ALL THREE BUTTONS SAME AS "Get a Quote on WhatsApp" */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a href={whatsappQuote()} className="btn btn-primary">
              <MessageCircle size={18} />
              Get a Quote on WhatsApp
            </a>

            <Link href="/gallery" className="btn btn-primary" prefetch={false}>
              See Our Work
              <Images size={18} />
            </Link>

            <Link href="/services" className="btn btn-primary" prefetch={false}>
              Services
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-extrabold text-white">
              <Ruler size={14} /> Measurements guided
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-extrabold text-white">
              <Wrench size={14} /> Installation available
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-extrabold text-white">
              <Clock size={14} /> Clear timeline
            </span>
          </div>

          {hero?.title || hero?.desc ? (
            <div className="mt-8 mx-auto max-w-2xl rounded-2xl border border-white/15 bg-white/10 p-4 text-left">
              <div className="text-sm font-semibold text-white">
                {hero?.title || "Featured work"}
              </div>
              <div className="text-sm text-white/80 mt-1 leading-relaxed">
                {hero?.desc ||
                  "Explore recent builds and request a quote with your measurements and photos."}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="py-14 px-6">
        <div className="container">
          <div className="flex items-end justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                What we build
              </h2>
              <p className="text-[--muted] mt-2">
                Choose a service, then send measurements + photos for a fast quote.
              </p>
            </div>

            <Link href="/contact" className="btn btn-outline" prefetch={false}>
              Contact
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
            {serviceCards.map((i) => (
              <div
                key={i.title}
                className="rounded-2xl border border-[--border] bg-[--surface] shadow-[var(--shadow)] p-5 hover:bg-[--surface-2] transition"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <span className="grid place-items-center h-9 w-9 rounded-xl border border-[--border] bg-[--surface-2]">
                    {i.icon}
                  </span>
                  {i.title}
                </div>

                <p className="text-sm text-[--muted] mt-2 leading-relaxed">{i.desc}</p>

                <div className="mt-4 flex flex-col gap-2">
                  <Link href={i.href} prefetch={false} className="btn btn-outline w-full">
                    View details <ArrowRight size={16} />
                  </Link>

                  <a href={whatsappQuote(i.wa)} className="btn btn-primary w-full">
                    <MessageCircle size={18} />
                    Quote on WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS STRIP */}
      <section className="py-14 px-6 bg-[--surface] border-y border-[--border]">
        <div className="container grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: <Ruler size={18} />,
              title: "Send measurements",
              desc: "Wall width & height, TV size (if needed), and a photo/video of the space.",
            },
            {
              icon: <Wrench size={18} />,
              title: "Confirm finish + layout",
              desc: "Pick slats/marble/wood + storage style. We align the design before build.",
            },
            {
              icon: <Clock size={18} />,
              title: "Build + install",
              desc: "We confirm a clear timeline and handle installation (where available).",
            },
          ].map((i) => (
            <div
              key={i.title}
              className="rounded-2xl border border-[--border] bg-[--background] p-5"
            >
              <div className="flex items-center gap-2 font-semibold">
                <span className="grid place-items-center h-9 w-9 rounded-xl border border-[--border] bg-[--surface]">
                  {i.icon}
                </span>
                {i.title}
              </div>
              <p className="text-sm text-[--muted] mt-2 leading-relaxed">{i.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED WORK (Firestore projects) */}
      <section className="py-14 px-6">
        <div className="container">
          <div className="flex items-end justify-between gap-3 flex-wrap">
            <div>
              <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">
                Featured work
              </h3>
              <p className="text-[--muted] mt-2">
                A few builds to show the finish and style. See more in the gallery.
              </p>
            </div>

            <Link href="/gallery" className="btn btn-outline" prefetch={false}>
              View Gallery <ArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[--border] bg-[--surface] p-5 animate-pulse"
                >
                  <div className="h-40 rounded-xl bg-black/10" />
                  <div className="h-4 mt-4 w-3/4 rounded bg-black/10" />
                  <div className="h-3 mt-2 w-full rounded bg-black/10" />
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
              {featured.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-[--border] bg-[--surface] overflow-hidden"
                >
                  <div className="relative h-44">
                    {p.imageUrl ? (
                      <Image
                        src={p.imageUrl}
                        alt={p.title || "Project"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[--surface-2]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
                  </div>

                  <div className="p-4">
                    <div className="font-semibold">{p.title || "Project"}</div>
                    <p className="text-sm text-[--muted] mt-1 leading-relaxed line-clamp-3">
                      {p.desc || "Custom interior build."}
                    </p>

                    <div className="mt-4 flex gap-2">
                      <a
                        href={whatsappQuote(p.title || "Project")}
                        className="btn btn-primary flex-1"
                      >
                        <MessageCircle size={18} />
                        Quote
                      </a>
                      <Link href="/gallery" className="btn btn-outline" prefetch={false}>
                        View <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-[--border] bg-[--surface] p-5">
              <div className="font-semibold">No featured projects yet</div>
              <p className="text-sm text-[--muted] mt-1">
                Add entries in the <b>projects</b> collection with <b>showOnHome</b> enabled
                (and optionally <b>isHero</b>).
              </p>
            </div>
          )}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-14 px-6 bg-[--surface] border-t border-[--border]">
        <div className="container">
          <div className="rounded-3xl border border-[--border] bg-[--background] p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Ready to build your space?
                </h3>
                <p className="text-[--muted] mt-2 max-w-2xl">
                  Send your city/town + measurements + photos/video of the space. We’ll confirm finish options,
                  timeline, and total cost.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a href={whatsappQuote()} className="btn btn-primary">
                  <MessageCircle size={18} />
                  WhatsApp Quote
                </a>
                <Link href="/services" className="btn btn-outline" prefetch={false}>
                  Browse Services <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
