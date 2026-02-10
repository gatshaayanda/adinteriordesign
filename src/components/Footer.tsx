"use client";

import Link from "next/link";
import {
  Sparkles,
  MessageCircle,
  PhoneCall,
  FileText,
  Facebook,
  Instagram,
  Music,
} from "lucide-react";

/**
 * Footer — AD Interior Design
 * - Brand summary
 * - WhatsApp quote CTA + callback request
 * - Quick links
 * - How it works (measurements + photos)
 */

const WHATSAPP_NUMBER = "+267 77 807 112";

// Add real links later (do not ship wrong socials)
const SOCIALS = {
  instagram: "",
  tiktok: "",
  facebook: "",
};

function waLink(message: string) {
  const digits = WHATSAPP_NUMBER.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function telLink() {
  return `tel:${WHATSAPP_NUMBER.replace(/[^\d+]/g, "")}`;
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 text-[--foreground] bg-[--background] relative overflow-hidden border-t border-[--border]">
      {/* Top gradient bar */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[--brand-primary]/30 via-[--brand-secondary]/50 to-[--brand-accent]/30 animate-neonflow" />

      <div className="container grid gap-10 sm:grid-cols-2 lg:grid-cols-4 py-12 text-sm relative z-10">
        {/* Brand overview */}
        <section aria-labelledby="footer-brand">
          <h4 id="footer-brand" className="text-lg font-extrabold tracking-tight mb-2">
            AD Interior Design
          </h4>

          <p className="text-[--muted] leading-relaxed">
            Custom interior builds made clean and premium — TV stands & wall units, wall panels,
            wardrobes/closets, and kitchens. Send your measurements + photos and we’ll quote fast.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="badge">TV Stands</span>
            <span className="badge">Wall Panels</span>
            <span className="badge">Wardrobes</span>
            <span className="badge">Kitchens</span>
            <span className="badge">Installation</span>
          </div>

          {/* Social media (only show if set) */}
          <div className="mt-4 flex gap-3 items-center">
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
        </section>

        {/* WhatsApp support */}
        <section aria-labelledby="footer-contact">
          <h4 id="footer-contact" className="text-lg font-bold mb-2">
            Need a Quote?
          </h4>

          <ul className="space-y-2 text-[--muted]">
            <li>
              <a
                href={waLink(
                  "Hi AD Interior Design 👋 I’d like a quote. I’ll share my city/town, measurements, and photos of the space."
                )}
                className="inline-flex items-center gap-2 hover:underline"
              >
                <MessageCircle size={18} />
                Chat: {WHATSAPP_NUMBER}
              </a>
            </li>

            <li>
              <a
                href={telLink()}
                className="inline-flex items-center gap-2 hover:underline"
              >
                <PhoneCall size={18} />
                Call us
              </a>
            </li>

            <li>
              <a
                href={waLink(
                  "Hi AD Interior Design 👋 Please call me.\n\nName:\nBest time:\nProject (TV stand / panels / wardrobe / kitchen):\nCity/Town:"
                )}
                className="inline-flex items-center gap-2 hover:underline"
              >
                <PhoneCall size={18} />
                Request a callback
              </a>
            </li>
          </ul>

          <div className="mt-4">
            <a
              href={waLink(
                "Hi AD Interior Design 👋 I’d like a quote:\n\nProject:\nSpace (lounge/bedroom/etc):\nCity/Town:\nMeasurements (W×H):\nFinish (slats/marble/wood/gloss/matte):\nNotes:\n\nI will also send photos/videos of the space."
              )}
              className="btn btn-primary w-full"
            >
              <MessageCircle size={18} />
              Get a Quote via WhatsApp
            </a>
          </div>
        </section>

        {/* Quick links */}
        <nav aria-labelledby="footer-links">
          <h4 id="footer-links" className="text-lg font-bold mb-2">
            Quick Links
          </h4>

          <ul className="space-y-2 text-[--muted]">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/gallery">Gallery</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </nav>

        {/* How it works */}
        <section aria-labelledby="footer-info">
          <h4 id="footer-info" className="text-lg font-bold mb-2">
            How It Works
          </h4>

          <p className="text-[--muted] leading-relaxed">
            Pick what you want to build, send your measurements and a photo/video of the space, and
            we’ll confirm the design, materials, timeline, and total price before we start.
          </p>

          <div className="mt-4 card">
            <div className="card-inner">
              <p className="text-[--foreground] font-semibold inline-flex items-center gap-2">
                <Sparkles size={16} /> Tip
              </p>
              <p className="text-[--muted] mt-1">
                For the fastest quote, send: (1) wall width & height, (2) TV size (if TV stand),
                (3) finish choice (slats/marble/wood), and (4) clear photos/video of the space.
              </p>

              <div className="mt-3">
                <a
                  href={waLink(
                    "Hi AD Interior Design 👋 What measurements do you need for an accurate quote? I can send photos/video too."
                  )}
                  className="btn btn-outline w-full"
                >
                  <FileText size={18} />
                  Ask for Requirements
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-[--border] relative z-10">
        <div className="container py-4 flex flex-col md:flex-row justify-between text-xs text-[--muted] gap-2">
          <div>&copy; {year} AD Interior Design. All rights reserved.</div>
          <div>Final pricing depends on measurements, materials, and installation requirements.</div>
        </div>
      </div>

      {/* Gradient animation */}
      <style jsx global>{`
        @keyframes neonflow {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-neonflow {
          background-size: 200% 200%;
          animation: neonflow 7s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
}
