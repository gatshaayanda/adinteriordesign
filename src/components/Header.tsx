// src/components/Header.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Car,
  HeartPulse,
  Briefcase,
  Landmark,
  FileText,
  MessageCircle,
  LogOut,
  Sparkles,
  Facebook,
  Instagram,
  Music,
  BadgeInfo,
  PhoneCall,
} from "lucide-react";
import LogoMktMark from "@/components/LogoMktMark";

/*
 * Header component for Sparkle Legacy Insurance Brokers
 *
 * Features:
 *  - Clear navigation for cover types
 *  - Prominent WhatsApp CTA
 *  - Social media buttons (Instagram, TikTok via Music icon, Facebook)
 *  - Auth-aware actions
 *  - Responsive mobile drawer
 *
 * NOTE: Dark-only theme → ThemeToggle removed completely.
 */

const WHATSAPP_NUMBER = "+26772971852";
const CLIENT_LOGIN_PATH = "/client/login";
const CLIENT_PORTAL_PATH = "/client/dashboard";

const SOCIALS = {
  instagram: "https://www.instagram.com/sparklelegacyinsurancebrokers/",
  tiktok: "https://www.tiktok.com/@sparklelegacyinsurancebr",
  facebook:
    "https://www.facebook.com/Sparkle-Legacy-Insurance-Brokers-61557773288268/",
};

const nav = [
  { label: "Home", href: "/", icon: <Sparkles size={18} /> },
  { label: "Short-Term", href: "/c/short-term", icon: <Car size={18} /> },
  { label: "Long-Term", href: "/c/long-term", icon: <HeartPulse size={18} /> },
  { label: "SME Cover", href: "/c/business", icon: <Briefcase size={18} /> },
  { label: "Retirement", href: "/c/retirement", icon: <Landmark size={18} /> },
  { label: "Claims", href: "/claims", icon: <FileText size={18} /> },
  { label: "Contact", href: "/contact", icon: <MessageCircle size={18} /> },
  { label: "About", href: "/about", icon: <BadgeInfo size={18} /> },
];

function waLink(message: string) {
  const digits = WHATSAPP_NUMBER.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function telLink() {
  // tel:+26772971852
  return `tel:${WHATSAPP_NUMBER.replace(/[^\d+]/g, "")}`;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const hasRole = (document.cookie || "")
      .split(";")
      .some((c) => c.trim().startsWith("role="));
    setAuthed(hasRole);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  const close = () => setOpen(false);

  const onLogout = () => {
    try {
      document.cookie = `role=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
      localStorage.removeItem("mkt_client_authed");
    } catch {}
    setAuthed(false);
    router.push("/");
  };

  const brand = useMemo(
    () => (
      <Link
        href="/"
        onClick={close}
        aria-label="Sparkle Legacy Insurance Brokers — Home"
        className="flex items-center gap-2.5 select-none"
        prefetch={false}
      >
        <span className="grid place-items-center h-9 w-9 rounded-xl border border-[--border] bg-[--surface]">
          <LogoMktMark className="h-6 w-6" />
        </span>

        <span className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight text-[--foreground] whitespace-nowrap">
          Sparkle&nbsp;Legacy
        </span>

        <span className="hidden xl:inline text-xs md:text-sm font-medium text-[--muted] whitespace-nowrap">
          Insurance&nbsp;•&nbsp;Quotes&nbsp;•&nbsp;Claims
        </span>
      </Link>
    ),
    []
  );

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
        <nav
          className="hidden md:flex items-center gap-1 flex-wrap"
          aria-label="Primary"
        >
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
          {/* WhatsApp CTA */}
          <a
            href={waLink(
              "Hi Sparkle Legacy 👋 I need help with a quote / policy / claim."
            )}
            className="btn btn-outline"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle size={18} />
            WhatsApp
          </a>

          {/* Social icons */}
          <div className="hidden lg:flex items-center gap-2">
            <a
              href={SOCIALS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-[--border] text-[--muted] hover:text-[--foreground] hover:bg-[--surface]"
            >
              <Instagram size={16} />
            </a>

            <a
              href={SOCIALS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-[--border] text-[--muted] hover:text-[--foreground] hover:bg-[--surface]"
            >
              <Music size={16} />
            </a>

            <a
              href={SOCIALS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-[--border] text-[--muted] hover:text-[--foreground] hover:bg-[--surface]"
            >
              <Facebook size={16} />
            </a>
          </div>

          {/* Auth actions */}
          {!authed ? (
            <Link
              href={CLIENT_LOGIN_PATH}
              className="btn btn-primary"
              prefetch={false}
            >
              Client Login
            </Link>
          ) : (
            <>
              <Link
                href={CLIENT_PORTAL_PATH}
                className="btn btn-outline"
                prefetch={false}
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="btn btn-outline"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          )}
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
                  isActive(item.href)
                    ? "bg-[--surface-2] border border-[--border]"
                    : ""
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

            <a
              href={waLink(
                "Hi Sparkle Legacy 👋 I’d like help with a quote / policy / claim."
              )}
              onClick={close}
              className="btn btn-primary w-full"
            >
              <MessageCircle size={18} /> WhatsApp
            </a>

            <a
              href={telLink()}
              onClick={close}
              className="btn btn-outline w-full"
            >
              <PhoneCall size={18} /> Call
            </a>

            {!authed ? (
              <Link
                href={CLIENT_LOGIN_PATH}
                onClick={close}
                className="btn btn-outline w-full"
                prefetch={false}
              >
                Client Login
              </Link>
            ) : (
              <>
                <Link
                  href={CLIENT_PORTAL_PATH}
                  onClick={close}
                  className="btn btn-outline w-full"
                  prefetch={false}
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    close();
                    onLogout();
                  }}
                  className="btn btn-outline w-full"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            )}

            <div className="h-px bg-white/10 my-3" />

            {/* Mobile socials (clickable, not just icons) */}
            <div className="flex gap-3">
              <a
                href={SOCIALS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-[--border] text-[--muted] hover:text-[--foreground] hover:bg-[--surface]"
              >
                <Instagram size={16} />
              </a>
              <a
                href={SOCIALS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-[--border] text-[--muted] hover:text-[--foreground] hover:bg-[--surface]"
              >
                <Music size={16} />
              </a>
              <a
                href={SOCIALS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-[--border] text-[--muted] hover:text-[--foreground] hover:bg-[--surface]"
              >
                <Facebook size={16} />
              </a>
            </div>

            <div className="mt-3 text-xs text-[--muted]">
              WhatsApp: {WHATSAPP_NUMBER}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
