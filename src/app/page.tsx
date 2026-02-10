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
          .sort((a: Project, b: Project) => (a.order ?? 999) - (b.order ?? 999)) as Project[];

        setHero(data.find((p) => p.isHero) || data[0] || null);
        setFeatured(data.filter((p) => p.showOnHome && !p.isHero).slice(0, 6));
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
        wa: "TV stand / wall unit",
      },
      {
        icon: <PanelsTopLeft size={18} />,
        title: "Wall Panels (Slats / Marble)",
        desc: "Feature walls that elevate the whole room instantly.",
        wa: "Wall panels",
      },
      {
        icon: <Sofa size={18} />,
        title: "Wardrobes / Closets",
        desc: "Custom storage layouts, sliding or hinged, premium finishes.",
        wa: "Wardrobes",
      },
      {
        icon: <Home size={18} />,
        title: "Kitchens & Cabinets",
        desc: "Practical layouts, strong finishes, built for daily use.",
        wa: "Kitchens",
      },
    ],
    []
  );

  const whatsappQuote = (projectType?: string) =>
    waLink(
      `Hi AD Interior Design 👋
I’d like a quote.

Project: ${projectType || ""}
City/Town:
Measurements (W×H):
Finish (slats / marble / wood / gloss / matte):
Notes:

I will send photos/video of the space.`
    );

  return (
    <main id="main" className="bg-[--background] overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-6">
        {hero?.imageUrl ? (
          <Image
            src={hero.imageUrl}
            alt={hero.title || "AD Interior Design"}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-black" />
        )}

        {/* Strong overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90" />

        {/* HERO CONTENT */}
        <div
          className="relative z-10 text-center max-w-4xl text-white"
          style={{ textShadow: "0 2px 18px rgba(0,0,0,0.65)" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 text-xs text-white/90">
            <Sparkles size={14} />
            Botswana • Custom Interiors • Installations
          </div>

          <h1 className="mt-6 text-5xl md:text-6xl font-extrabold tracking-tight text-white">
            AD Interior Design
            <span className="block text-xl md:text-2xl text-white/85 mt-3">
              TV Stands • Wall Panels • Wardrobes • Kitchens
            </span>
          </h1>

          <p className="mt-5 text-white/80 max-w-2xl mx-auto leading-relaxed">
            Premium interior builds with clean finishes. Send measurements and a
            photo/video of your space — we quote fast on WhatsApp.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a href={whatsappQuote()} className="btn btn-primary">
              <MessageCircle size={18} />
              Get a Quote on WhatsApp
            </a>

            <Link href="/gallery" className="btn btn-outline">
              See Our Work <Images size={18} />
            </Link>

            <Link href="/services" className="btn btn-outline">
              Services <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <span className="badge"><Ruler size={14} /> Measurements guided</span>
            <span className="badge"><Wrench size={14} /> Installation available</span>
            <span className="badge"><Clock size={14} /> Clear timeline</span>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="py-14 px-6">
        <div className="container grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {serviceCards.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-[--border] bg-[--surface] p-5"
            >
              <div className="flex items-center gap-2 font-semibold">
                <span className="grid place-items-center h-9 w-9 rounded-xl border border-[--border] bg-[--surface-2]">
                  {s.icon}
                </span>
                {s.title}
              </div>

              <p className="text-sm text-[--muted] mt-2">{s.desc}</p>

              <a href={whatsappQuote(s.wa)} className="btn btn-primary w-full mt-4">
                <MessageCircle size={18} /> Quote on WhatsApp
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURED ================= */}
      <section className="py-14 px-6 bg-[--surface]">
        <div className="container">
          <h3 className="text-2xl font-extrabold mb-6">Featured work</h3>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 rounded-xl bg-black/10 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-[--border] bg-[--background] overflow-hidden"
                >
                  <div className="relative h-44">
                    {p.imageUrl && (
                      <Image src={p.imageUrl} alt={p.title || ""} fill className="object-cover" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="font-semibold">{p.title}</div>
                    <p className="text-sm text-[--muted] mt-1">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
