"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { firestore } from "@/utils/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

import {
  X,
  ArrowRight,
  MessageCircle,
  Images,
  LayoutGrid,
  PanelsTopLeft,
  Sofa,
  Home,
  Sparkles,
} from "lucide-react";

type ServiceCategory =
  | "tv-stands"
  | "wall-panels"
  | "wardrobes"
  | "kitchens"
  | "ceilings"
  | "doors";

type Project = {
  id: string;
  title?: string;
  desc?: string;
  imageUrl?: string;
  category?: ServiceCategory;
  order?: number;
  active?: boolean;
};

const WHATSAPP_NUMBER = "+267 77 807 112";

function waLink(message: string) {
  const digits = WHATSAPP_NUMBER.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

const CATEGORY_META: Record<
  ServiceCategory,
  { label: string; icon: ReactNode }
> = {
  "tv-stands": {
    label: "TV Stands",
    icon: <LayoutGrid size={16} />,
  },
  "wall-panels": {
    label: "Wall Panels",
    icon: <PanelsTopLeft size={16} />,
  },
  wardrobes: {
    label: "Wardrobes",
    icon: <Sofa size={16} />,
  },
  kitchens: {
    label: "Kitchens",
    icon: <Home size={16} />,
  },
  ceilings: {
    label: "Ceilings",
    icon: <Sparkles size={16} />,
  },
  doors: {
    label: "Doors",
    icon: <Sparkles size={16} />,
  },
};

export default function GalleryPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState<
    ServiceCategory | "all"
  >("all");

  const [openItem, setOpenItem] = useState<Project | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const snap = await getDocs(collection(firestore, "projects"));
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        })) as Project[];

        const cleaned = data
          .filter((p) => p.active !== false)
          .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

        setItems(cleaned);
      } catch (e) {
        console.error("Gallery load failed:", e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((p) => p.category === activeCategory);
  }, [items, activeCategory]);

  const whatsappQuote = (project?: Project) => {
    return waLink(
      [
        "Hi AD Interior Design 👋 I’d like a quote.",
        "",
        `Project type: ${project?.category || "-"}`,
        `Project name: ${project?.title || "-"}`,
        "",
        "City/Town:",
        "Measurements (W×H):",
        "Finish (slats/marble/wood/gloss/matte):",
        "Notes:",
        "",
        "I will send photos/video of the space.",
      ].join("\n")
    );
  };

  return (
    <main id="main" className="bg-[--background] text-[--foreground]">
      {/* HERO */}
      <section className="border-b border-[--border] bg-[--background]">
        <div className="container py-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[--border] bg-[--surface] text-xs">
              <Images size={14} />
              <span className="text-[--muted]">AD Interior Design • Gallery</span>
            </div>

            <h1 className="mt-5 text-3xl sm:text-4xl font-extrabold tracking-tight">
              Our Work
            </h1>

            <p className="mt-3 text-[--muted] leading-relaxed">
              Browse real installs and finishes. Tap a project to preview, then
              request a quote on WhatsApp with measurements + photos.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href={waLink("Hi AD Interior Design 👋 I’d like a quote.")}
                className="btn btn-primary"
              >
                <MessageCircle size={18} />
                Quote on WhatsApp
              </a>

              <Link href="/services" className="btn btn-outline" prefetch={false}>
                View Services
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="container py-8">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`menu-link ${
              activeCategory === "all"
                ? "bg-[--surface-2] border border-[--border] text-[--foreground]"
                : ""
            }`}
          >
            <LayoutGrid size={16} />
            All
          </button>

          {Object.entries(CATEGORY_META).map(([key, meta]) => {
            const cat = key as ServiceCategory;
            const active = activeCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`menu-link ${
                  active
                    ? "bg-[--surface-2] border border-[--border] text-[--foreground]"
                    : ""
                }`}
              >
                {meta.icon}
                {meta.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* GRID */}
      <section className="container pb-16">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[--border] bg-[--surface] p-5 animate-pulse"
              >
                <div className="h-44 rounded-xl bg-black/10 dark:bg-white/10" />
                <div className="h-4 mt-4 w-3/4 rounded bg-black/10 dark:bg-white/10" />
                <div className="h-3 mt-2 w-full rounded bg-black/10 dark:bg-white/10" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-[--border] bg-[--surface] p-10 text-center">
            <div className="text-lg font-semibold">No projects found</div>
            <p className="text-[--muted] mt-2">
              Add images to your <b>projects</b> collection in Firestore.
            </p>

            <div className="mt-5">
              <a
                href={waLink("Hi AD Interior Design 👋 I’d like a quote.")}
                className="btn btn-primary"
              >
                <MessageCircle size={18} />
                Request Quote
              </a>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setOpenItem(p)}
                className="text-left rounded-2xl border border-[--border] bg-[--surface] overflow-hidden hover:bg-[--surface-2] transition"
              >
                <div className="relative h-52">
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

                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="text-white font-extrabold text-base leading-tight">
                      {p.title || "Project"}
                    </div>

                    <div className="text-white/80 text-xs mt-1">
                      {p.category
                        ? CATEGORY_META[p.category]?.label
                        : "Interior build"}
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-sm text-[--muted] leading-relaxed line-clamp-2">
                    {p.desc || "Tap to view full preview."}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* MODAL PREVIEW */}
      {openItem && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4">
          <div className="w-full max-w-4xl rounded-2xl overflow-hidden border border-white/10 bg-[--background] shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[--border] bg-[--surface]">
              <div className="font-extrabold text-sm">
                {openItem.title || "Project Preview"}
              </div>

              <button
                type="button"
                onClick={() => setOpenItem(null)}
                className="h-9 w-9 rounded-lg grid place-items-center border border-[--border] bg-[--surface-2]"
                aria-label="Close preview"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative h-[55vh] bg-black">
              {openItem.imageUrl ? (
                <Image
                  src={openItem.imageUrl}
                  alt={openItem.title || "Project"}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-[--muted]">
                  No image available
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="font-extrabold text-lg">
                {openItem.title || "Project"}
              </div>

              <p className="text-sm text-[--muted] mt-2 leading-relaxed">
                {openItem.desc || "No description provided."}
              </p>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <a href={whatsappQuote(openItem)} className="btn btn-primary">
                  <MessageCircle size={18} />
                  Quote on WhatsApp
                </a>

                <Link href="/services" className="btn btn-outline" prefetch={false}>
                  View Services
                  <ArrowRight size={18} />
                </Link>
              </div>

              <div className="mt-4 text-xs text-[--muted]">
                WhatsApp: {WHATSAPP_NUMBER}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
