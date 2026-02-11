// src/app/c/[category]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";

import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/utils/firebaseConfig";

import {
  MessageCircle,
  FileText,
  ChevronRight,
  Ruler,
  Wrench,
  PanelsTopLeft,
  LayoutGrid,
  Sofa,
  Home,
  Sparkles,
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
  name: string;
  category: ServiceCategory;
  description?: string | null;
  imageUrl?: string | null;
  active?: boolean;
  order?: number;
};

const VALID_CATEGORIES: ServiceCategory[] = [
  "tv-stands",
  "wall-panels",
  "wardrobes",
  "kitchens",
  "ceilings",
  "doors",
];

const CATEGORY_META: Record<
  ServiceCategory,
  { title: string; subtitle: string; icon: ReactNode; ctaLabel: string }
> = {
  "tv-stands": {
    title: "TV Stands & Wall Units",
    subtitle: "Modern wall units, floating designs, storage & LED options.",
    icon: <LayoutGrid size={18} />,
    ctaLabel: "Request a TV Stand Quote",
  },
  "wall-panels": {
    title: "Wall Panels (Slats / Marble)",
    subtitle: "Feature walls with clean finishes that transform the room.",
    icon: <PanelsTopLeft size={18} />,
    ctaLabel: "Request a Wall Panel Quote",
  },
  wardrobes: {
    title: "Wardrobes & Closets",
    subtitle: "Custom storage layouts, sliding or hinged, premium finishes.",
    icon: <Sofa size={18} />,
    ctaLabel: "Request a Wardrobe Quote",
  },
  kitchens: {
    title: "Kitchens & Cabinets",
    subtitle: "Practical layouts, strong finishes, built for daily use.",
    icon: <Home size={18} />,
    ctaLabel: "Request a Kitchen Quote",
  },
  ceilings: {
    title: "Ceilings & Bulkheads",
    subtitle: "Neat ceilings, bulkheads, lighting-ready finishes.",
    icon: <Sparkles size={18} />,
    ctaLabel: "Request a Ceiling Quote",
  },
  doors: {
    title: "Doors & Finishes",
    subtitle: "Interior finishes and clean door solutions for a polished look.",
    icon: <Sparkles size={18} />,
    ctaLabel: "Request a Door Quote",
  },
};

export default function CategoryPage() {
  const params = useParams<{ category: string }>();
  const raw = (params?.category || "").toLowerCase();

  const category = (VALID_CATEGORIES.includes(raw as ServiceCategory)
    ? (raw as ServiceCategory)
    : "tv-stands") as ServiceCategory;

  const meta = useMemo(() => CATEGORY_META[category], [category]);

  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);

        const qRef = query(
          collection(firestore, "services"),
          where("category", "==", category)
        );

        const snap = await getDocs(qRef);
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
  }, [category]);

  const defaultQuoteMsg = useMemo(() => {
    return [
      "Hi AD Interior Design 👋",
      `I’d like a quote for: ${meta.title}`,
      "",
      "My details:",
      "Name: ",
      "Phone: ",
      "City/Town: ",
      "",
      "Measurements (W×H): ",
      "Finish (slats/marble/wood/gloss/matte): ",
      "Notes: ",
      "",
      "I will send photos/video of the space.",
    ].join("\n");
  }, [meta.title]);

  return (
    <main id="main" className="bg-[--background] text-[--foreground]">
      {/* HERO / HEADER */}
      <section className="border-b border-[--border] bg-[--background]">
        <div className="container py-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[--border] bg-[--surface] text-xs">
                <span className="text-[--brand-primary]">{meta.icon}</span>
                <span className="text-[--muted]">
                  AD Interior Design • Botswana
                </span>
              </div>

              <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[--foreground]">
                {meta.title}
              </h1>

              <p className="mt-2 text-[--muted] leading-relaxed">
                {meta.subtitle}
              </p>

              {/* Sub-nav */}
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href="/c/tv-stands"
                  prefetch={false}
                  className={`menu-link ${
                    category === "tv-stands"
                      ? "bg-[--surface-2] border border-[--border] text-[--foreground]"
                      : ""
                  }`}
                >
                  TV Stands
                </Link>

                <Link
                  href="/c/wall-panels"
                  prefetch={false}
                  className={`menu-link ${
                    category === "wall-panels"
                      ? "bg-[--surface-2] border border-[--border] text-[--foreground]"
                      : ""
                  }`}
                >
                  Wall Panels
                </Link>

                <Link
                  href="/c/wardrobes"
                  prefetch={false}
                  className={`menu-link ${
                    category === "wardrobes"
                      ? "bg-[--surface-2] border border-[--border] text-[--foreground]"
                      : ""
                  }`}
                >
                  Wardrobes
                </Link>

                <Link
                  href="/c/kitchens"
                  prefetch={false}
                  className={`menu-link ${
                    category === "kitchens"
                      ? "bg-[--surface-2] border border-[--border] text-[--foreground]"
                      : ""
                  }`}
                >
                  Kitchens
                </Link>

                <Link
                  href="/c/ceilings"
                  prefetch={false}
                  className={`menu-link ${
                    category === "ceilings"
                      ? "bg-[--surface-2] border border-[--border] text-[--foreground]"
                      : ""
                  }`}
                >
                  Ceilings
                </Link>

                <Link
                  href="/c/doors"
                  prefetch={false}
                  className={`menu-link ${
                    category === "doors"
                      ? "bg-[--surface-2] border border-[--border] text-[--foreground]"
                      : ""
                  }`}
                >
                  Doors
                </Link>

                <Link href="/services" prefetch={false} className="menu-link">
                  Services
                </Link>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Link href="/services" prefetch={false} className="btn btn-outline">
                <FileText size={18} />
                Services
              </Link>

              <a
                href={waLink(defaultQuoteMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <MessageCircle size={18} />
                {meta.ctaLabel}
              </a>
            </div>
          </div>

          {/* Helper card */}
          <div className="mt-8 rounded-2xl border border-[--border] bg-[--surface] p-5">
            <div className="font-semibold flex items-center gap-2 text-[--foreground]">
              <Ruler size={16} className="text-[--brand-primary]" />
              What to send for a fast quote
            </div>
            <p className="text-sm text-[--muted] mt-2 leading-relaxed">
              Send your <b>city/town</b>, <b>measurements (W×H)</b>, preferred{" "}
              <b>finish</b>, and a <b>photo/video</b> of the wall/space. If
              you’re unsure, describe the room and we’ll guide you.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="container py-10">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[--border] bg-[--surface] p-5 animate-pulse"
              >
                <div className="h-36 rounded-xl bg-[--surface-2]" />
                <div className="h-4 w-2/3 mt-4 rounded bg-[--surface-2]" />
                <div className="h-3 w-full mt-3 rounded bg-[--surface-2]" />
                <div className="h-10 w-full mt-5 rounded bg-[--surface-2]" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-[--border] bg-[--surface] p-8 text-center">
            <div className="text-lg font-semibold text-[--foreground]">
              No items listed here yet
            </div>
            <p className="text-[--muted] mt-2">
              You can still request a quote — we’ll guide measurements and finish
              options.
            </p>

            <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-center">
              <Link href="/services" prefetch={false} className="btn btn-outline">
                <FileText size={18} />
                Services
              </Link>

              <a
                href={waLink(defaultQuoteMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <MessageCircle size={18} />
                WhatsApp for Quote
              </a>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((s) => {
              const msg = [
                "Hi AD Interior Design 👋",
                `I’d like a quote for: ${s.name}`,
                `Category: ${meta.title}`,
                "",
                "My details:",
                "Name: ",
                "Phone: ",
                "City/Town: ",
                "",
                "Measurements (W×H): ",
                "Finish (slats/marble/wood/gloss/matte): ",
                "Notes: ",
                "",
                "I will send photos/video of the space.",
              ].join("\n");

              return (
                <div
                  key={s.id}
                  className="rounded-2xl border border-[--border] bg-[--surface] overflow-hidden hover:bg-[--surface-2] transition"
                >
                  <div className="relative h-40 bg-[--surface-2]">
                    <img
                      src={s.imageUrl?.trim() || "/placeholder.png"}
                      alt={s.name}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/placeholder.png";
                      }}
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-base text-[--foreground]">
                          {s.name}
                        </div>

                        {s.description ? (
                          <p className="text-sm text-[--muted] mt-2 leading-relaxed line-clamp-3">
                            {s.description}
                          </p>
                        ) : null}
                      </div>

                      <div className="shrink-0 text-[--muted] inline-flex items-center gap-1">
                        <ChevronRight size={18} />
                      </div>
                    </div>

                    <div className="mt-5 flex gap-2">
                      <a
                        href={waLink(msg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary flex-1 justify-center"
                      >
                        <MessageCircle size={18} />
                        Request Quote
                      </a>

                      <Link
                        href="/services"
                        prefetch={false}
                        className="btn btn-outline"
                      >
                        Services
                      </Link>
                    </div>

                    <p className="text-xs text-[--muted] mt-4 inline-flex items-center gap-2">
                      <Wrench size={14} /> Tip: send measurements + photos/video
                      for fastest pricing.
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
