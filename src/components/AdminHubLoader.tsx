"use client";

import { useEffect, useState } from "react";

/**
 * AdminHubLoader
 *
 * A polished full‑screen loading overlay for Sparkle Legacy Insurance.
 * It uses a calm colour palette, a shield icon to evoke trust,
 * a brief tagline, and a shimmering progress bar. The loader fades
 * out after a short delay to improve perceived performance.
 *
 * This component leverages guidelines from modern insurance sites:
 * - Use of professional colours and subtle motion to build trust:contentReference[oaicite:2]{index=2}.
 * - Clear branding and concise messaging:contentReference[oaicite:3]{index=3}.
 *
 * The overlay disappears automatically once the fade completes.
 */
export default function AdminHubLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  // Start fade and hide timers on mount. We wait 2.3s before
  // fading and 3.1s before unmounting to allow animations to finish.
  useEffect(() => {
    const fade = setTimeout(() => setFading(true), 2300);
    const hide = setTimeout(() => setVisible(false), 3100);
    return () => {
      clearTimeout(fade);
      clearTimeout(hide);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-label="Loading Sparkle Legacy Insurance"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-[1200ms] ${
        fading ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background:
          "radial-gradient(900px 520px at 20% -10%, rgba(30,64,175,0.14), transparent 60%), radial-gradient(760px 460px at 90% 0%, rgba(2,132,199,0.12), transparent 55%), var(--background)",
        isolation: "isolate",
        color: "var(--foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Shield icon with subtle glow and check mark */}
      <div className="relative h-28 w-28 mb-6">
        {/* Reflection */}
        <svg
          viewBox="0 0 64 64"
          className="absolute inset-0 opacity-10 blur-sm scale-y-[-1] translate-y-8"
        >
          <path
            d="M32 8c8.2 0 14.8 6.7 14.8 15 0 11.2-12.3 22.9-14.8 25.2-2.5-2.3-14.8-14-14.8-25.2C17.2 14.7 23.8 8 32 8Z"
            fill="rgba(96,165,250,0.4)"
          />
        </svg>

        {/* Main icon */}
        <svg viewBox="0 0 64 64" width="112" height="112" className="animate-float drop-glow">
          <defs>
            <radialGradient id="shieldGlow" cx="50%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#bfdbfe">
                <animate attributeName="offset" values="0;0.4;0" dur="8s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="var(--brand-primary)" />
            </radialGradient>
            <linearGradient id="checkLine" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--brand-accent)" />
              <stop offset="100%" stopColor="var(--brand-secondary)" />
            </linearGradient>
          </defs>

          {/* Shield shape */}
          <path
            d="M32 8c8.2 0 14.8 6.7 14.8 15 0 11.2-12.3 22.9-14.8 25.2-2.5-2.3-14.8-14-14.8-25.2C17.2 14.7 23.8 8 32 8Z"
            fill="url(#shieldGlow)"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="1.4"
          />

          {/* Check mark */}
          <path
            d="M24.8 32.5l4.7 4.9L40 26.8"
            fill="none"
            stroke="url(#checkLine)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Soft inner divider line */}
          <path
            d="M22.5 22.5c2.4-2.8 5.8-4.5 9.5-4.5 3.7 0 7.1 1.7 9.5 4.5"
            stroke="rgba(31,41,55,0.3)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="uppercase tracking-[0.22em] text-[1.1rem] sm:text-[1.3rem] fade-in-text font-extrabold">
        Sparkle&nbsp;Legacy
      </div>

      {/* Tagline */}
      <div className="text-xs sm:text-sm mt-2 text-[--brand-accent] tracking-widest fade-in-delayed">
        insurance&nbsp;• quotes&nbsp;• claims&nbsp;• policies
      </div>

      {/* Progress bar */}
      <div className="w-48 h-1.5 bg-white/10 overflow-hidden rounded-full mt-8">
        <span
          className="block h-full w-1/3 shimmer"
          style={{
            background:
              "linear-gradient(90deg, var(--brand-primary), var(--brand-secondary), var(--brand-accent), var(--brand-primary))",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-150%);
          }
          50% {
            transform: translateX(30%);
          }
          100% {
            transform: translateX(150%);
          }
        }
        .shimmer {
          animation: shimmer 2.2s cubic-bezier(0.45, 0, 0.25, 1) infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-float {
          animation: float 4.5s cubic-bezier(0.45, 0, 0.25, 1) infinite;
        }

        .drop-glow {
          filter: drop-shadow(0 0 12px rgba(96, 165, 250, 0.22))
            drop-shadow(0 0 22px rgba(2, 6, 23, 0.35));
          transition: filter 1s ease;
        }

        @keyframes fadeInText {
          0% {
            opacity: 0;
            letter-spacing: 0.34em;
            transform: translateY(6px);
          }
          100% {
            opacity: 1;
            letter-spacing: 0.18em;
            transform: translateY(0);
          }
        }
        .fade-in-text {
          animation: fadeInText 1.6s cubic-bezier(0.45, 0, 0.25, 1) forwards;
        }
        .fade-in-delayed {
          opacity: 0;
          animation: fadeInText 1.6s cubic-bezier(0.45, 0, 0.25, 1) 0.5s forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
