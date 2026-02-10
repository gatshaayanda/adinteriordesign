// src/components/Header.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Sparkles,
  Images,
  Wrench,
  BadgeInfo,
  PhoneCall,
  MessageCircle,
  Facebook,
  Instagram,
  Music,
  Tag,
} from "lucide-react";
import LogoMktMark from "@/components/LogoMktMark";

/**
 * Header — AD Interior Design
 * - Clear navigation (services, gallery, pricing, about, contact)
 * - Prominent WhatsApp quote CTA + Call
 * - Responsive mobile drawer
 *
 * Note: No client portal/auth logic for this project.
 */

const WHATSAPP_NUMBER = "+267 77 807 112";

// Add the REAL AD links later (do not ship Sparkle links)
const SOCIALS = {
  instagram: "",
  tiktok: "",
  facebook: "",
};

const nav = [
  { label: "Home", href: "/", icon: <Sparkles size={18} /> },
  { label: "Services", href: "/services", icon: <Wrench size={18} /> },
  { label: "Gallery", href: "/gallery", icon: <Images size={18} /> },
  { label: "About", href: "/about", icon: <BadgeInfo size={18} /> },
  { label: "Contact", href: "/contact", icon: <MessageCircle size={18} /> },
];

function waLink(message: string) {
  const digits = WHATSAPP_NUMBER.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function telLink() {
  return `tel:${WHATSAPP_NUMBER.replace(/[^\d+]/g, "")}`;
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  const close = () => setOpen(false);

  const brand = useMemo(
    () => (
      <Link
        href="/"
        onClick={close}
        aria-label="AD Interior Design — Home"
        className="flex items-center gap-2.5 select-none"
        prefetch={false}
      >
        <span className="grid place-items-center h-9 w-9 rounded-xl border border-[--border] bg-[--surface]">
          <LogoMktMark className="h-6 w-6" />
        </span>

        <span className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight text-[--foreground] whitespace-nowrap">
          AD&nbsp;Interior
        </span>

        <span className="hidden xl:inline text-xs md:text-sm font-medium text-[--muted] whitespace-nowrap">
          TV&nbsp;Stands&nbsp;•&nbsp;Wall&nbsp;Panels&nbsp;•&nbsp;Wardrobes&nbsp;•&nbsp;Kitchens
        </span>
      </Link>
    ),
    []
  );

  const whatsappMsg =
    "Hi AD Interior Design 👋 I’d like a quote. I’ll share my city/town, measurements, and photos of the space.";

  return (
    <header className="w-full z-50 bg-[--background] text-[--foreground] border-b border-[--border] overflow-x-hidden">
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white text-black px-3 py-2 rounded"
      >
        Skip to content
      </a>

      {/* Top row */}
      <div className="container flex items-center justify-between py-3 md:py-4 gap-3">
        {brand}

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-1 flex-wrap" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              prefetch={false}
              onClick={close}
              className={`menu-link ${
                isActive(item.href)
                  ? "bg-[--surface-2] border border-[--border] text-[--foreground]"
                  : ""
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <a href={waLink(whatsappMsg)} className="btn btn-primary" aria-label="WhatsApp quote">
            <MessageCircle size={18} />
            WhatsApp Quote
          </a>

          <a href={telLink()} className="btn btn-outline" aria-label="Call AD Interior Design">
            <PhoneCall size={18} />
            Call
          </a>

          {/* Social icons (only render if link exists) */}
          <div className="hidden lg:flex items-center gap-2">
            {SOCIALS.instagram ? (
              <a
                href={SOCIALS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-[--border] text-[--muted] hover:text-[--foreground] hover:bg-[--surface]"
              >
                <Instagram size={16} />
              </a>
            ) : null}

            {SOCIALS.tiktok ? (
              <a
                href={SOCIALS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-[--border] text-[--muted] hover:text-[--foreground] hover:bg-[--surface]"
              >
                <Music size={16} />
              </a>
            ) : null}

            {SOCIALS.facebook ? (
              <a
                href={SOCIALS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-[--border] text-[--muted] hover:text-[--foreground] hover:bg-[--surface]"
              >
                <Facebook size={16} />
              </a>
            ) : null}
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((s) => !s)}
          className="md:hidden p-2 rounded-lg border border-[--border] bg-[--surface]"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${
          open ? "max-h-[85vh]" : "max-h-0"
        }`}
        aria-hidden={!open}
      >
        <div className="px-4 pb-4 pt-3 border-t border-[--border]">
          <div className="flex flex-col gap-2" aria-label="Mobile navigation">
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={close}
                className={`menu-link justify-between ${
                  isActive(item.href) ? "bg-[--surface-2] border border-[--border]" : ""
                }`}
                prefetch={false}
              >
                <span className="inline-flex items-center gap-2">
                  {item.icon}
                  {item.label}
                </span>
                <span className="text-[--muted]">›</span>
              </Link>
            ))}

            <div className="h-px bg-white/10 my-3" />

            <a href={waLink(whatsappMsg)} onClick={close} className="btn btn-primary w-full">
              <MessageCircle size={18} /> WhatsApp Quote
            </a>

            <a href={telLink()} onClick={close} className="btn btn-outline w-full">
              <PhoneCall size={18} /> Call
            </a>

            {/* Mobile socials */}
            {(SOCIALS.instagram || SOCIALS.tiktok || SOCIALS.facebook) && (
              <>
                <div className="h-px bg-white/10 my-3" />
                <div className="flex gap-3">
                  {SOCIALS.instagram ? (
                    <a
                      href={SOCIALS.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-[--border] text-[--muted] hover:text-[--foreground] hover:bg-[--surface]"
                    >
                      <Instagram size={16} />
                    </a>
                  ) : null}
                  {SOCIALS.tiktok ? (
                    <a
                      href={SOCIALS.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="TikTok"
                      className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-[--border] text-[--muted] hover:text-[--foreground] hover:bg-[--surface]"
                    >
                      <Music size={16} />
                    </a>
                  ) : null}
                  {SOCIALS.facebook ? (
                    <a
                      href={SOCIALS.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-[--border] text-[--muted] hover:text-[--foreground] hover:bg-[--surface]"
                    >
                      <Facebook size={16} />
                    </a>
                  ) : null}
                </div>
              </>
            )}

            <div className="mt-3 text-xs text-[--muted]">
              WhatsApp / Call: {WHATSAPP_NUMBER}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
