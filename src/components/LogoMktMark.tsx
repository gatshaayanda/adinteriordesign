"use client";

import type React from "react";

type Props = React.SVGProps<SVGSVGElement>;

/**
 * AD Interior Design Mark — Slat Wall + Marble Panel
 *
 * Visual idea:
 * - Vertical slats (signature wall panels)
 * - A clean marble panel inset (TV feature wall look)
 * - Subtle warm LED underglow (premium finish)
 *
 * Motion is restrained and respects prefers-reduced-motion.
 */
export default function LogoMktMark(props: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="AD Interior Design Mark"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={`ad-mark ${props.className || ""}`}
    >
      <defs>
        {/* Charcoal-to-slate background */}
        <linearGradient id="adBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--brand-primary)" />
          <stop offset="100%" stopColor="var(--brand-secondary)" />
        </linearGradient>

        {/* Warm accent line */}
        <linearGradient id="adAccent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--brand-accent)" />
          <stop offset="100%" stopColor="#e7c58d" />
        </linearGradient>

        {/* Marble panel */}
        <linearGradient id="adMarble" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#eef2f7" />
        </linearGradient>

        {/* Marble veins */}
        <linearGradient id="adVein" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(15,23,42,0.18)" />
          <stop offset="50%" stopColor="rgba(201,162,106,0.22)" />
          <stop offset="100%" stopColor="rgba(15,23,42,0.14)" />
        </linearGradient>

        {/* Warm LED glow */}
        <radialGradient id="adGlow" cx="50%" cy="92%" r="65%">
          <stop offset="0%" stopColor="rgba(255,193,7,0.40)" />
          <stop offset="55%" stopColor="rgba(255,193,7,0.16)" />
          <stop offset="100%" stopColor="rgba(255,193,7,0.0)" />
        </radialGradient>
      </defs>

      {/* Outer tile */}
      <rect x="6" y="6" width="52" height="52" rx="14" fill="url(#adBg)" />

      {/* Soft LED glow near bottom */}
      <ellipse cx="32" cy="52" rx="18" ry="9" fill="url(#adGlow)" opacity="0.9" />

      {/* Slat wall group */}
      <g opacity="0.92">
        {Array.from({ length: 9 }).map((_, i) => {
          const x = 12 + i * 4.6;
          return (
            <rect
              key={i}
              x={x}
              y={14}
              width="2.2"
              height="34"
              rx="1.1"
              fill="rgba(255,255,255,0.14)"
            />
          );
        })}
      </g>

      {/* Marble panel inset (like a TV feature panel) */}
      <rect
        x="20"
        y="18"
        width="30"
        height="24"
        rx="6"
        fill="url(#adMarble)"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1"
      />

      {/* Marble veins */}
      <path
        d="M22 30c6-6 10-2 14-8 4-6 8 0 12-6"
        fill="none"
        stroke="url(#adVein)"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M24 38c5-4 8-2 12-6 4-4 6 0 10-4"
        fill="none"
        stroke="url(#adVein)"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* Accent bar (brass line, premium finish) */}
      <rect x="18" y="44.5" width="34" height="2.6" rx="1.3" fill="url(#adAccent)" opacity="0.95" />

      {/* Minimal "AD" monogram (subtle, not loud) */}
      <g opacity="0.92">
        <path
          d="M26.5 27.8c1.8-2.2 4.9-2.2 6.7 0l1.6 2.0-1.7 1.2-1.2-1.5c-0.9-1.1-2.4-1.1-3.3 0l-2.0 2.5h6.6v2.2h-9.6v-1.6l2.9-3.6Z"
          fill="rgba(15,23,42,0.78)"
        />
        <path
          d="M39.5 27.8h3.4c2.8 0 5.1 2.3 5.1 5.1s-2.3 5.1-5.1 5.1h-3.4v-2.3h3.2c1.6 0 2.8-1.2 2.8-2.8S44.3 30 42.7 30h-3.2v-2.2Z"
          fill="rgba(15,23,42,0.78)"
        />
      </g>

      <style jsx>{`
        @keyframes adPulse {
          0%,
          100% {
            transform: scale(1);
            filter: drop-shadow(0 10px 20px rgba(2, 6, 23, 0.18))
              drop-shadow(0 0 14px rgba(201, 162, 106, 0.16));
          }
          50% {
            transform: scale(1.04);
            filter: drop-shadow(0 14px 26px rgba(2, 6, 23, 0.22))
              drop-shadow(0 0 18px rgba(201, 162, 106, 0.22));
          }
        }
        .ad-mark {
          animation: adPulse 5.6s cubic-bezier(0.45, 0, 0.25, 1) infinite;
          transform-origin: center;
          transition: filter 0.6s ease;
        }
        .ad-mark:hover {
          filter: drop-shadow(0 16px 30px rgba(2, 6, 23, 0.24))
            drop-shadow(0 0 22px rgba(201, 162, 106, 0.26));
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </svg>
  );
}
