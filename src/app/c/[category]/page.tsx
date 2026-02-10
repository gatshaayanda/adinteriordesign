// src/app/c/[category]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";

import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/utils/firebaseConfig";

import {
  ShieldCheck,
  Sparkles,
  MessageCircle,
  FileText,
  ChevronRight,
  Car,
  HeartPulse,
  Briefcase,
  Landmark,
} from "lucide-react";

const WHATSAPP_NUMBER = "+26772971852";

function waLink(text: string) {
  const digits = WHATSAPP_NUMBER.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

type InsuranceCategory =
  | "short-term"
  | "long-term"
  | "motor"
  | "home"
  | "travel"
  | "gadget"
  | "life"
  | "funeral"
  | "disability"
  | "retirement"
  | "business";

type InsuranceProduct = {
  id: string;
  name: string;
  category: InsuranceCategory;
  summary?: string;
  bullets?: string[];
  whatItCovers?: string[];
  whoItsFor?: string[];
  keyNotes?: string[];
  active?: boolean;
  order?: number;
};

const VALID_CATEGORIES: InsuranceCategory[] = [
  "short-term",
  "long-term",
  "motor",
  "home",
  "travel",
  "gadget",
  "life",
  "funeral",
  "disability",
  "retirement",
  "business",
];

const CATEGORY_META: Record<
  InsuranceCategory,
  { title: string; subtitle: string; icon: ReactNode; ctaLabel: string }
> = {
  "short-term": {
    title: "Short-Term Insurance",
    subtitle:
      "Covers things: car, home, travel, gadgets. Usually monthly/yearly renewal.",
    icon: <ShieldCheck size={18} />,
    ctaLabel: "Request a Short-Term Quote",
  },
  "long-term": {
    title: "Long-Term Insurance",
    subtitle:
      "Covers people/income: life, funeral, disability, dread disease, annuities.",
    icon: <Sparkles size={18} />,
    ctaLabel: "Request a Long-Term Quote",
  },
  motor: {
    title: "Motor Insurance",
    subtitle: "Third party / comprehensive cover for vehicles.",
    icon: <Car size={18} />,
    ctaLabel: "Request Motor Quote",
  },
  home: {
    title: "Home & Contents",
    subtitle: "Protect your house and belongings against loss/damage.",
    icon: <ShieldCheck size={18} />,
    ctaLabel: "Request Home Quote",
  },
  travel: {
    title: "Travel Insurance",
    subtitle: "Medical, cancellations, baggage and travel disruptions.",
    icon: <ShieldCheck size={18} />,
    ctaLabel: "Request Travel Quote",
  },
  gadget: {
    title: "Gadget Insurance",
    subtitle:
      "Cover for phones/laptops against theft or accidental damage (product-dependent).",
    icon: <ShieldCheck size={18} />,
    ctaLabel: "Request Gadget Quote",
  },
  life: {
    title: "Life Cover",
    subtitle: "Financial protection for your family if you pass away.",
    icon: <HeartPulse size={18} />,
    ctaLabel: "Request Life Quote",
  },
  funeral: {
    title: "Funeral Cover",
    subtitle: "Cash benefit to support funeral costs when a covered member passes.",
    icon: <Sparkles size={18} />,
    ctaLabel: "Request Funeral Quote",
  },
  disability: {
    title: "Disability & Income Protection",
    subtitle:
      "Support if illness/injury affects your ability to work (policy-dependent).",
    icon: <Sparkles size={18} />,
    ctaLabel: "Request Disability Quote",
  },
  retirement: {
    title: "Retirement & Annuities",
    subtitle: "Build savings or secure an income stream for retirement.",
    icon: <Landmark size={18} />,
    ctaLabel: "Request Retirement Quote",
  },
  business: {
    title: "Business & SME Cover",
    subtitle: "Protect assets, liability, fleet, and business continuity.",
    icon: <Briefcase size={18} />,
    ctaLabel: "Request Business Quote",
  },
};

export default function CategoryPage() {
  const params = useParams<{ category: string }>();
  const raw = (params?.category || "").toLowerCase();

  const category = (VALID_CATEGORIES.includes(raw as InsuranceCategory)
    ? (raw as InsuranceCategory)
    : "short-term") as InsuranceCategory;

  const meta = useMemo(() => CATEGORY_META[category], [category]);

  const [items, setItems] = useState<InsuranceProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);

        // ✅ no orderBy → no composite index required
        const qRef = query(
          collection(firestore, "insurance_products"),
          where("category", "==", category)
        );

        const snap = await getDocs(qRef);
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        })) as InsuranceProduct[];

        const cleaned = data
          .filter((p) => p.active !== false)
          .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

        if (alive) setItems(cleaned);
      } catch (e) {
        console.error("Load category insurance products failed:", e);
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
      "Hi Sparkle Legacy 👋",
      `I’d like a quote for: ${meta.title}`,
      "",
      "My details:",
      "Name: ",
      "Phone: ",
      "City/Town: ",
      "",
      "Notes (optional): ",
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
                <span className="text-[--muted]">Sparkle Legacy • Insurance Brokers</span>
              </div>

              <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">
                {meta.title}
              </h1>
              <p className="mt-2 text-[--muted] leading-relaxed">{meta.subtitle}</p>

              {/* Sub-nav (quick switching) */}
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href="/c/short-term"
                  prefetch={false}
                  className={`menu-link ${
                    category === "short-term"
                      ? "bg-[--surface-2] border border-[--border] text-[--foreground]"
                      : ""
                  }`}
                >
                  Short-Term
                </Link>
                <Link
                  href="/c/long-term"
                  prefetch={false}
                  className={`menu-link ${
                    category === "long-term"
                      ? "bg-[--surface-2] border border-[--border] text-[--foreground]"
                      : ""
                  }`}
                >
                  Long-Term
                </Link>
                <Link href="/c/business" prefetch={false} className="menu-link">
                  SME Cover
                </Link>
                <Link href="/c/retirement" prefetch={false} className="menu-link">
                  Retirement
                </Link>
                <Link href="/claims" prefetch={false} className="menu-link">
                  Claims
                </Link>
                <Link href="/contact" prefetch={false} className="menu-link">
                  Contact
                </Link>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Link href="/contact" prefetch={false} className="btn btn-outline">
                <FileText size={18} />
                Contact
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

          {/* Small helper card */}
          <div className="mt-8 rounded-2xl border border-[--border] bg-[--surface] p-5">
            <div className="font-semibold flex items-center gap-2">
              <ShieldCheck size={16} className="text-[--brand-primary]" />
              What to send for a fast quote
            </div>
            <p className="text-sm text-[--muted] mt-2 leading-relaxed">
              Share the product, your city/town, and key details (example: car model + registration,
              sum assured, dependants, or any special notes). If you’re unsure, just describe your situation.
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
                <div className="h-4 w-2/3 rounded bg-black/10 dark:bg-white/10" />
                <div className="h-3 w-full mt-3 rounded bg-black/10 dark:bg-white/10" />
                <div className="h-3 w-5/6 mt-2 rounded bg-black/10 dark:bg-white/10" />
                <div className="h-10 w-full mt-5 rounded bg-black/10 dark:bg-white/10" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-[--border] bg-[--surface] p-8 text-center">
            <div className="text-lg font-semibold">No items listed here yet</div>
            <p className="text-[--muted] mt-2">
              You can still request a quote — we’ll guide you with the right cover.
            </p>

            <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-center">
              <Link href="/contact" prefetch={false} className="btn btn-outline">
                <FileText size={18} />
                Contact
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
            {items.map((p) => {
              const msg = [
                "Hi Sparkle Legacy 👋",
                `I’d like a quote for: ${p.name}`,
                `Category: ${meta.title}`,
                "",
                "My details:",
                "Name: ",
                "Phone: ",
                "City/Town: ",
                "",
                "Notes (optional): ",
              ].join("\n");

              return (
                <div
                  key={p.id}
                  className="rounded-2xl border border-[--border] bg-[--surface] overflow-hidden hover:bg-[--surface-2] transition"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-base">{p.name}</div>
                        {p.summary ? (
                          <p className="text-sm text-[--muted] mt-2 leading-relaxed">
                            {p.summary}
                          </p>
                        ) : null}
                      </div>

                      <div className="shrink-0 text-[--muted] inline-flex items-center gap-1">
                        <ChevronRight size={18} />
                      </div>
                    </div>

                    {!!p.bullets?.length && (
                      <ul className="mt-4 space-y-2 text-sm text-[--muted]">
                        {p.bullets.slice(0, 4).map((b, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-black/30 dark:bg-white/30" />
                            <span className="leading-relaxed">{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}

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

                      <Link href="/contact" prefetch={false} className="btn btn-outline">
                        Contact
                      </Link>
                    </div>

                    <p className="text-xs text-[--muted] mt-4">
                      Tip: include key details (car model/registration, sum assured, dependants).
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
