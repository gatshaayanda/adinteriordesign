// src/app/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  MessageCircle,
  Sparkles,
  FileText,
  Clock,
  ArrowRight,
  Landmark,
  Briefcase,
  Car,
  HeartPulse,
} from "lucide-react";

import { firestore } from "@/utils/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

type Highlight = {
  id: string;
  imageUrl?: string;
  title?: string;
  desc?: string;
  showOnHome?: boolean;
  order?: number;
  isHero?: boolean;
};

type Product = {
  id: string;
  name?: string;
  category?: string;
  brand?: string;
  price?: number;
  dealPrice?: number | null;
  isDeal?: boolean;
  inStock?: boolean;
  imageUrl?: string;
  description?: string | null;
};

const WHATSAPP_NUMBER = "+26772971852";

function waLink(message: string) {
  const digits = WHATSAPP_NUMBER.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export default function HomePage() {
  const [hero, setHero] = useState<Highlight | null>(null);
  const [gallery, setGallery] = useState<Highlight[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Highlights
        const hsnap = await getDocs(collection(firestore, "highlights"));
        const hdata = hsnap.docs
          .map((d) => ({ id: d.id, ...(d.data() as any) }))
          .sort((a: Highlight, b: Highlight) => (a.order ?? 999) - (b.order ?? 999)) as Highlight[];

        const heroPick = hdata.find((h) => !!h.isHero) || hdata[0] || null;
        const homeCards = hdata.filter((h) => h.showOnHome && !h.isHero).slice(0, 4);

        setHero(heroPick);
        setGallery(homeCards);

        // Products (legacy-safe)
        const psnap = await getDocs(collection(firestore, "products"));
        const pdata = psnap.docs
          .map((d) => ({ id: d.id, ...(d.data() as any) })) as Product[];

        setProducts(pdata.slice(0, 6));
      } catch (e) {
        console.error("Home load failed:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const quickCards = useMemo(
    () => [
      {
        icon: <Car size={18} />,
        title: "Short-Term Insurance",
        desc: "Motor, home & contents, travel, gadgets, liability.",
        href: "/c/short-term",
      },
      {
        icon: <HeartPulse size={18} />,
        title: "Long-Term Insurance",
        desc: "Life, funeral, disability, dread disease, credit life.",
        href: "/c/long-term",
      },
      {
        icon: <Briefcase size={18} />,
        title: "SME Cover",
        desc: "Business assets, liability, fleet, employee benefits.",
        href: "/c/business",
      },
      {
        icon: <Landmark size={18} />,
        title: "Retirement & Wealth",
        desc: "Planning, pensions, annuities, long-term security.",
        href: "/c/retirement",
      },
    ],
    []
  );

  return (
    <main id="main" className="bg-[--background] text-[--foreground] overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-6">
        {/* Background image (optional) */}
        {hero?.imageUrl ? (
          <Image
            src={hero.imageUrl}
            alt={hero?.title || "Sparkle Legacy"}
            fill
            priority
            className="object-cover opacity-25"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(900px 520px at 20% -10%, rgba(14,165,233,0.18), transparent 60%), radial-gradient(760px 460px at 90% 0%, rgba(20,184,166,0.14), transparent 55%), #070b14",
            }}
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/70 to-black/90" />

        <div className="relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/10 text-xs">
            <ShieldCheck size={14} />
            Botswana • Quotes • Claims • Policy Support
          </div>

          <h1 className="mt-6 text-5xl md:text-6xl font-extrabold tracking-tight">
            Sparkle Legacy
            <span className="block text-xl md:text-2xl text-white/70 mt-3">
              Insurance Brokers
            </span>
          </h1>

          <p className="mt-5 text-white/70 max-w-2xl mx-auto leading-relaxed">
            Clear cover explanations, fast quote requests, and transparent claim support — all in one place.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={waLink("Hi Sparkle Legacy 👋 I’d like a quote.\n\nCover type:\nProduct:\nCity/Town:\nName:")}
              className="btn btn-primary"
            >
              <MessageCircle size={18} />
              Get a Quote on WhatsApp
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

          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <span className="badge inline-flex items-center gap-2">
              <Sparkles size={14} /> Short-Term (things)
            </span>
            <span className="badge inline-flex items-center gap-2">
              <Sparkles size={14} /> Long-Term (people)
            </span>
            <span className="badge inline-flex items-center gap-2">
              <Clock size={14} /> Fast response
            </span>
          </div>

          {hero?.title || hero?.desc ? (
            <div className="mt-8 mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
              <div className="text-sm font-semibold text-white/90">
                {hero?.title || "Trusted guidance"}
              </div>
              <div className="text-sm text-white/65 mt-1 leading-relaxed">
                {hero?.desc ||
                  "Request quotes, understand your cover, and get help through claims with clear steps and fast follow-up."}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* QUICK START GRID */}
      <section className="py-14 px-6">
        <div className="container">
          <div className="flex items-end justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Start here
              </h2>
              <p className="text-[--muted] mt-2">
                Pick the cover type, then request a quote or ask a question.
              </p>
            </div>

            <Link href="/contact" className="btn btn-outline" prefetch={false}>
              Contact
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
            {quickCards.map((i) => (
              <Link
                key={i.title}
                href={i.href}
                prefetch={false}
                className="rounded-2xl border border-[--border] bg-[--surface] shadow-[var(--shadow)] p-5 hover:bg-[--surface-2] transition"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <span className="grid place-items-center h-9 w-9 rounded-xl border border-[--border] bg-[--surface-2]">
                    {i.icon}
                  </span>
                  {i.title}
                </div>
                <p className="text-sm text-[--muted] mt-2 leading-relaxed">{i.desc}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                  Explore <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="py-14 px-6 bg-[--surface] border-y border-[--border]">
        <div className="container grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: <ShieldCheck size={18} />,
              title: "Clear guidance",
              desc: "We explain cover in simple language before you commit.",
            },
            {
              icon: <FileText size={18} />,
              title: "Transparent steps",
              desc: "Know what’s needed for quotes and claims — upfront.",
            },
            {
              icon: <MessageCircle size={18} />,
              title: "WhatsApp-first support",
              desc: "Quick help for questions, follow-ups, and document sharing.",
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

      {/* HOME HIGHLIGHTS (from Firestore highlights) */}
      <section className="py-14 px-6">
        <div className="container">
          <div className="flex items-end justify-between gap-3 flex-wrap">
            <div>
              <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">
                Updates & highlights
              </h3>
              <p className="text-[--muted] mt-2">
                Latest info, promos, or announcements (managed in your admin).
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[--border] bg-[--surface] p-5 animate-pulse"
                >
                  <div className="h-32 rounded-xl bg-black/10 dark:bg-white/10" />
                  <div className="h-4 mt-4 w-3/4 rounded bg-black/10 dark:bg-white/10" />
                  <div className="h-3 mt-2 w-full rounded bg-black/10 dark:bg-white/10" />
                </div>
              ))}
            </div>
          ) : gallery.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
              {gallery.map((h) => (
                <div
                  key={h.id}
                  className="rounded-2xl border border-[--border] bg-[--surface] overflow-hidden"
                >
                  <div className="relative h-36">
                    {h.imageUrl ? (
                      <Image
                        src={h.imageUrl}
                        alt={h.title || "Highlight"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[--surface-2]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
                  </div>

                  <div className="p-4">
                    <div className="font-semibold">
                      {h.title || "Highlight"}
                    </div>
                    <p className="text-sm text-[--muted] mt-1 leading-relaxed line-clamp-3">
                      {h.desc || "New update available."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-[--border] bg-[--surface] p-5">
              <div className="font-semibold">No highlights yet</div>
              <p className="text-sm text-[--muted] mt-1">
                Add entries in the <b>highlights</b> collection with <b>showOnHome</b> enabled.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* LEGACY PRODUCTS (kept + lightly shown so it’s not “dead” data) */}
      <section className="py-14 px-6 bg-[--surface] border-t border-[--border]">
        <div className="container">
          <div className="flex items-end justify-between gap-3 flex-wrap">
            <div>
              <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">
                Featured items (legacy)
              </h3>
              <p className="text-[--muted] mt-2">
                This section is here to keep your existing “products” collection alive while you migrate.
              </p>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-[--border] bg-[--background] overflow-hidden"
                >
                  <div className="relative h-40">
                    {p.imageUrl ? (
                      <Image
                        src={p.imageUrl}
                        alt={p.name || "Item"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[--surface-2]" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="font-semibold">{p.name || "Item"}</div>
                    <div className="text-xs text-[--muted] mt-1">
                      {p.category || "Category"}
                      {p.brand ? ` • ${p.brand}` : ""}
                    </div>
                    {p.description ? (
                      <p className="text-sm text-[--muted] mt-2 line-clamp-2">
                        {p.description}
                      </p>
                    ) : null}

                    <div className="mt-4">
                      <a
                        href={waLink(
                          `Hi Sparkle Legacy 👋 I’m asking about:\n\nItem: ${p.name || "-"}\nCategory: ${
                            p.category || "-"
                          }\n\nPlease advise.`
                        )}
                        className="btn btn-outline w-full"
                      >
                        <MessageCircle size={18} />
                        Ask on WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-[--border] bg-[--background] p-5">
              <div className="font-semibold">No legacy items found</div>
              <p className="text-sm text-[--muted] mt-1">
                Your <b>products</b> collection is empty (or not accessible with current rules).
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
