"use client";

import { useEffect, useState } from "react";

/**
 * ADLoader
 *
 * Polished full-screen loading overlay for AD Interior Design.
 * Visual language: clean whites, charcoal slats, marble panel, warm LED glow.
 * Fades out after a short delay to improve perceived performance.
 */
export default function AdminHubLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

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
      aria-label="Loading AD Interior Design"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-[1200ms] ${
        fading ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background:
          "radial-gradient(1000px 520px at 20% -10%, rgba(201,162,106,0.18), transparent 60%), radial-gradient(900px 520px at 90% 0%, rgba(15,23,42,0.08), transparent 55%), var(--background)",
        isolation: "isolate",
        color: "var(--foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Mark (slats + marble + warm accent) */}
      <div className="relative h-28 w-28 mb-6">
        {/* Reflection */}
        <svg
          viewBox="0 0 64 64"
          className="absolute inset-0 opacity-10 blur-sm scale-y-[-1] translate-y-8"
        >
          <rect x="10" y="10" width="44" height="44" rx="14" fill="rgba(15,23,42,0.35)" />
          <rect x="28" y="20" width="20" height="18" rx="5" fill="rgba(255,255,255,0.55)" />
          <rect x="24" y="41" width="28" height="3" rx="1.5" fill="rgba(201,162,106,0.55)" />
        </svg>

        {/* Main icon */}
        <svg viewBox="0 0 64 64" width="112" height="112" className="animate-float drop-glow">
          <defs>
            <linearGradient id="adTile" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--brand-primary)" />
              <stop offset="100%" stopColor="var(--brand-secondary)" />
            </linearGradient>

            <linearGradient id="adMarble" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#eef2f7" />
            </linearGradient>

            <linearGradient id="adVein" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(15,23,42,0.18)" />
              <stop offset="50%" stopColor="rgba(201,162,106,0.22)" />
              <stop offset="100%" stopColor="rgba(15,23,42,0.14)" />
            </linearGradient>

            <linearGradient id="adAccent" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--brand-accent)" />
              <stop offset="100%" stopColor="#e7c58d" />
            </linearGradient>

            <radialGradient id="adGlow" cx="50%" cy="90%" r="65%">
              <stop offset="0%" stopColor="rgba(255,193,7,0.40)" />
              <stop offset="55%" stopColor="rgba(255,193,7,0.16)" />
              <stop offset="100%" stopColor="rgba(255,193,7,0)" />
            </radialGradient>
          </defs>

          {/* Base tile */}
          <rect
            x="10"
            y="10"
            width="44"
            height="44"
            rx="14"
            fill="url(#adTile)"
            stroke="rgba(255,255,255,0.20)"
            strokeWidth="1.2"
          />

          {/* Warm glow */}
          <ellipse cx="32" cy="50" rx="16" ry="8" fill="url(#adGlow)" opacity="0.85" />

          {/* Slats */}
          <g opacity="0.9">
            {Array.from({ length: 7 }).map((_, i) => {
              const x = 16 + i * 5;
              return (
                <rect
                  key={i}
                  x={x}
                  y="18"
                  width="2.3"
                  height="26"
                  rx="1.15"
                  fill="rgba(255,255,255,0.16)"
                />
              );
            })}
          </g>

          {/* Marble panel inset */}
          <rect
            x="28"
            y="20"
            width="20"
            height="18"
            rx="5"
            fill="url(#adMarble)"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1"
          />

          {/* Marble veins */}
          <path
            d="M29.5 29.5c3-3 5-1 7-3.8 2-2.8 4 0 6-2.8"
            fill="none"
            stroke="url(#adVein)"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path
            d="M30.5 35c2.4-2 3.6-1.2 5.4-2.6 1.8-1.4 2.8 0 4.6-1.4"
            fill="none"
            stroke="url(#adVein)"
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity="0.55"
          />

          {/* Brass accent line */}
          <rect x="24" y="41" width="28" height="3" rx="1.5" fill="url(#adAccent)" opacity="0.95" />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="uppercase tracking-[0.22em] text-[1.05rem] sm:text-[1.2rem] fade-in-text font-extrabold">
        AD&nbsp;Interior&nbsp;Design
      </div>

      {/* Tagline */}
      <div className="text-xs sm:text-sm mt-2 text-[--brand-accent] tracking-widest fade-in-delayed">
        tv&nbsp;stands&nbsp;• wall&nbsp;panels&nbsp;• wardrobes&nbsp;• kitchens
      </div>

      {/* Progress bar */}
      <div className="w-52 h-1.5 bg-black/10 overflow-hidden rounded-full mt-8">
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
          animation: shimmer 2.35s cubic-bezier(0.45, 0, 0.25, 1) infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        .animate-float {
          animation: float 5.2s cubic-bezier(0.45, 0, 0.25, 1) infinite;
        }

        .drop-glow {
          filter: drop-shadow(0 14px 26px rgba(2, 6, 23, 0.18))
            drop-shadow(0 0 18px rgba(201, 162, 106, 0.18));
          transition: filter 0.9s ease;
        }
        .drop-glow:hover {
          filter: drop-shadow(0 16px 30px rgba(2, 6, 23, 0.22))
            drop-shadow(0 0 22px rgba(201, 162, 106, 0.22));
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
          animation: fadeInText 1.55s cubic-bezier(0.45, 0, 0.25, 1) forwards;
        }
        .fade-in-delayed {
          opacity: 0;
          animation: fadeInText 1.55s cubic-bezier(0.45, 0, 0.25, 1) 0.45s forwards;
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
