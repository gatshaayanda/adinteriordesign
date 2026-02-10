// src/app/services/page.tsx
"use client";

import { useEffect, useMemo, useState, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/utils/firebaseConfig";

import {
  MessageCircle,
  ArrowRight,
  LayoutGrid,
  PanelsTopLeft,
  Sofa,
  Home,
  Sparkles,
  DoorClosed,
  Ruler,
  Wrench,
} from "lucide-react";

const WHATSAPP_NUMBER = "+267 77 807 112";

function waLink(text: string) {
  const digits = WHATSAPP_NUMBER.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

type ServiceCategory =
  | "tv-stands"
  | "wall-panels"
  | "wardrobes"
  | "kitchens"
  | "ceilings"
  | "doors";

type ServiceItem = {
  id: string;
  title: string;
  category: ServiceCategory;
  summary?: string;
  bullets?: string[];
  imageUrl?: string;
  active?: boolean;
  order?: number;
};

const CATEGORY_META: Record<
  ServiceCategory,
  { title: string; desc: string; href: string; icon: ReactNode }
> = {
  "tv-stands": {
    title: "TV Stands & Wall Units",
    desc: "Modern wall units, floating designs, storage & LED options.",
    href: "/c/tv-stands",
    icon: <LayoutGrid size={18} />,
  },
  "wall-panels": {
    title: "Wall Panels (Slats / Marble)",
    desc: "Feature walls with clean finishes that transform the room.",
    href: "/c/wall-panels",
    icon: <PanelsTopLeft size={18} />,
  },
  wardrobes: {
    title: "Wardrobes & Closets",
    desc: "Custom storage layouts, sliding or hinged, premium finishes.",
    href: "/c/wardrobes",
    icon: <Sofa size={18} />,
  },
  kitchens: {
    title: "Kitchens & Cabinets",
    desc: "Practical layouts, strong finishes, built for daily use.",
    href: "/c/kitchens",
    icon: <Home size={18} />,
  },
  ceilings: {
    title: "Ceilings & Bulkheads",
    desc: "Neat ceilings, bulkheads, lighting-ready finishes.",
    href: "/c/ceilings",
    icon: <Sparkles size={18} />,
  },
  doors: {
    title: "Doors & Finishes",
    desc: "Interior finishes and clean door solutions for a polished look.",
    href: "/c/doors",
    icon: <DoorClosed size={18} />,
  },
};

export default function ServicesPage() {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);

        const snap = await getDocs(collection(firestore, "services"));
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        })) as ServiceItem[];

        const cleaned = data
          .filter((s) => s.active !== false)
          .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

        if (alive) setItems(cleaned);
      } catch (e) {
        console.error("Load services failed:", e);
        if (alive) setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const grouped = useMemo(() => {
    const g: Record<ServiceCategory, ServiceItem[]> = {
      "tv-stands": [],
      "wall-panels": [],
      wardrobes: [],
      kitchens: [],
      ceilings: [],
      doors: [],
    };

    for (const s of items) {
      if (g[s.category]) g[s.category].push(s);
    }

    return g;
  }, [items]);

  const whatsappQuote = (service?: string) =>
    waLink(
      [
        "Hi AD Interior Design 👋 I’d like a quote.",
        "",
        `Project: ${service || ""}`.trim(),
        "City/Town:",
        "Measurements (W×H):",
        "Finish (slats/marble/wood/gloss/matte):",
        "Notes:",
        "",
        "I will send photos/video of the space.",
      ]
        .filter(Boolean)
        .join("\n")
    );

  const categories = useMemo(
    () =>
      (Object.keys(CATEGORY_META) as ServiceCategory[]).map((k) => ({
        key: k,
        ...CATEGORY_META[k],
        count: grouped[k]?.length || 0,
      })),
    [grouped]
  );

  return (
    <main id="main" className="bg-[--background] text-[--foreground]">
      {/* HERO */}
      <section className="border-b border-[--border] bg-[--background]">
        <div className="container py-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[--border] bg-[--surface] text-xs">
              <span className="text-[--brand-primary]">
                <Sparkles size={14} />
              </span>
              <span className="text-[--muted]">AD Interior Design • Services</span>
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[--foreground]">
              Services
            </h1>

            <p className="mt-3 text-[--muted] leading-relaxed">
              Choose what you want built, then send measurements + photos/video of your space.
              We’ll confirm finish options, timeline, and total cost on WhatsApp.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-2">
              <a href={whatsappQuote()} className="btn btn-primary">
                <MessageCircle size={18} />
                Get a Quote on WhatsApp
              </a>

              <Link href="/gallery" prefetch={false} className="btn btn-outline">
                See Our Work <ArrowRight size={18} />
              </Link>
            </div>

            <div className="mt-7 rounded-2xl border border-[--border] bg-[--surface] p-5">
              <div className="font-semibold flex items-center gap-2 text-[--foreground]">
                <Ruler size={16} className="text-[--brand-primary]" />
                What to send for fastest pricing
              </div>
              <p className="text-sm text-[--muted] mt-2 leading-relaxed">
                City/town, measurements (W×H), preferred finish (slats / marble / wood / gloss / matte),
                and a photo/video of the wall or space.
              </p>
              <p className="text-sm text-[--muted] mt-2 leading-relaxed inline-flex items-center gap-2">
                <Wrench size={16} className="text-[--brand-primary]" />
                If you’re not sure, just send the room photo and we’ll guide measurements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="py-12">
        <div className="container">
          <div className="flex items-end justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-[--foreground]">
                Browse categories
              </h2>
              <p className="text-[--muted] mt-2">
                Tap into a category page (your <code>/c/</code> routes) to see items.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
            {categories.map((c) => (
              <Link
                key={c.key}
                href={c.href}
                prefetch={false}
                className="rounded-2xl border border-[--border] bg-[--surface] p-5 hover:bg-[--surface-2] transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 font-semibold text-[--foreground]">
                    <span className="grid place-items-center h-9 w-9 rounded-xl border border-[--border] bg-[--surface-2]">
                      {c.icon}
                    </span>
                    {c.title}
                  </div>

                  <span className="text-xs px-2 py-1 rounded-full border border-[--border] bg-[--surface-2] text-[--muted]">
                    {c.count} item{c.count === 1 ? "" : "s"}
                  </span>
                </div>

                <p className="text-sm text-[--muted] mt-2 leading-relaxed">{c.desc}</p>

                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <span className="btn btn-outline w-full sm:w-auto justify-center">
                    View details <ArrowRight size={16} />
                  </span>

                  <a
                    href={whatsappQuote(c.title)}
                    className="btn btn-primary w-full sm:w-auto justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MessageCircle size={18} />
                    Quote on WhatsApp
                  </a>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED ITEMS (optional preview list) */}
      <section className="py-12 border-t border-[--border] bg-[--surface]">
        <div className="container">
          <div className="flex items-end justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-[--foreground]">
                Service items
              </h2>
              <p className="text-[--muted] mt-2">
                Pulled from Firestore <b>services</b>. (If empty, you’ll only see categories.)
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[--border] bg-[--background] p-5 animate-pulse"
                >
                  <div className="h-40 rounded-xl bg-[--surface-2]" />
                  <div className="h-4 mt-4 w-2/3 rounded bg-[--surface-2]" />
                  <div className="h-3 mt-2 w-full rounded bg-[--surface-2]" />
                  <div className="h-10 mt-5 w-full rounded bg-[--surface-2]" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-[--border] bg-[--background] p-6">
              <div className="font-semibold text-[--foreground]">No service items yet</div>
              <p className="text-sm text-[--muted] mt-1">
                Add entries in <b>services</b> with <b>category</b> set to:
                {" "}
                <code>tv-stands</code>, <code>wall-panels</code>, <code>wardrobes</code>,{" "}
                <code>kitchens</code>, <code>ceilings</code>, <code>doors</code>.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
              {items.slice(0, 9).map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl border border-[--border] bg-[--background] overflow-hidden"
                >
                  <div className="relative h-44">
                    {s.imageUrl ? (
                      <Image
                        src={s.imageUrl}
                        alt={s.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[--surface-2]" />
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-[--foreground]">{s.title}</div>
                        <div className="text-xs text-[--muted] mt-1">
                          Category:{" "}
                          <span className="font-semibold">
                            {CATEGORY_META[s.category]?.title || s.category}
                          </span>
                        </div>

                        {s.summary ? (
                          <p className="text-sm text-[--muted] mt-2 leading-relaxed">
                            {s.summary}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <a
                        href={whatsappQuote(s.title)}
                        className="btn btn-primary flex-1 justify-center"
                      >
                        <MessageCircle size={18} />
                        Quote
                      </a>

                      <Link
                        href={CATEGORY_META[s.category]?.href || "/services"}
                        prefetch={false}
                        className="btn btn-outline"
                      >
                        View <ArrowRight size={18} />
                      </Link>
                    </div>

                    <p className="text-xs text-[--muted] mt-4">
                      Tip: include measurements (W×H) + finish + photo/video.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {items.length > 9 ? (
            <div className="mt-6 text-center">
              <Link href="/gallery" prefetch={false} className="btn btn-outline">
                See more work in Gallery <ArrowRight size={18} />
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
