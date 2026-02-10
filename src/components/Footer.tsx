"use client";

import Link from "next/link";
import {
  ShieldCheck,
  MessageCircle,
  FileText,
  PhoneCall,
  Facebook,
  Instagram,
  Music,
} from "lucide-react";

/*
 * Footer component for Sparkle Legacy
 *
 * Provides brand summary, WhatsApp support, quick navigation and information about how we work.
 */

const WHATSAPP_NUMBER = "+26772971852";

function waLink(message: string) {
  const digits = WHATSAPP_NUMBER.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
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
            Sparkle Legacy
          </h4>

          <p className="text-[--muted] leading-relaxed">
            Modern digital insurance concierge for Botswana. We simplify cover
            selection, provide fast quotes, track claims and keep you informed
            every step of the way.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="badge">Short-Term</span>
            <span className="badge">Long-Term</span>
            <span className="badge">Retirement</span>
            <span className="badge">SME</span>
            <span className="badge">Claims</span>
          </div>

          {/* Social media */}
          <div className="mt-4 flex gap-3 items-center">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/sparklelegacyinsurancebrokers/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-[--border] text-[--muted] hover:text-[--foreground] hover:bg-[--surface]"
            >
              <Instagram size={16} />
            </a>

            {/* TikTok (song icon) */}
            <a
              href="https://www.tiktok.com/@sparklelegacyinsurancebr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-[--border] text-[--muted] hover:text-[--foreground] hover:bg-[--surface]"
            >
              <Music size={16} />
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/Sparkle-Legacy-Insurance-Brokers-61557773288268/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-[--border] text-[--muted] hover:text-[--foreground] hover:bg-[--surface]"
            >
              <Facebook size={16} />
            </a>
          </div>
        </section>

        {/* WhatsApp support */}
        <section aria-labelledby="footer-contact">
          <h4 id="footer-contact" className="text-lg font-bold mb-2">
            Need Help?
          </h4>

          <ul className="space-y-2 text-[--muted]">
            <li>
              <a
                href={waLink(
                  "Hi Sparkle Legacy 👋 I need help with a quote / policy / claim."
                )}
                className="inline-flex items-center gap-2 hover:underline"
              >
                <MessageCircle size={18} />
                Chat: {WHATSAPP_NUMBER}
              </a>
            </li>

            <li>
              <a
                href={waLink(
                  "Hi Sparkle Legacy 👋 Please call me.\n\nName:\nBest time:\nTopic (quote/policy/claim):"
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
                "Hi Sparkle Legacy 👋 I’d like a quote:\n\nCover type:\nProduct:\nCity/Town:\nNotes:"
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
            <li><Link href="/c/short-term">Short-Term</Link></li>
            <li><Link href="/c/long-term">Long-Term</Link></li>
            <li><Link href="/c/retirement">Retirement</Link></li>
            <li><Link href="/c/business">SME Cover</Link></li>
            <li><Link href="/claims">Claims</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </nav>

        {/* How it works */}
        <section aria-labelledby="footer-info">
          <h4 id="footer-info" className="text-lg font-bold mb-2">
            How It Works
          </h4>

          <p className="text-[--muted] leading-relaxed">
            Browse the cover types and products, then request a quote. We’ll
            confirm requirements, help you choose the right cover and keep you
            updated throughout the process.
          </p>

          <div className="mt-4 card">
            <div className="card-inner">
              <p className="text-[--foreground] font-semibold inline-flex items-center gap-2">
                <ShieldCheck size={16} /> Tip
              </p>
              <p className="text-[--muted] mt-1">
                For faster quotes or claims, provide clear details and supporting
                documents. Not sure what’s required? Ask us directly.
              </p>

              <div className="mt-3">
                <a
                  href={waLink(
                    "Hi Sparkle Legacy 👋 What documents do you need for my quote/claim?"
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
          <div>&copy; {year} Sparkle Legacy Insurance Brokers. All rights reserved.</div>
          <div>Cover terms, premiums and benefits depend on insurer underwriting.</div>
        </div>
      </div>

      {/* Gradient animation */}
      <style jsx global>{`
        @keyframes neonflow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-neonflow {
          background-size: 200% 200%;
          animation: neonflow 7s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
}
