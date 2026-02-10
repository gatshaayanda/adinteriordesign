"use client";

import type React from "react";

type Props = React.SVGProps<SVGSVGElement>;

/**
 * Logo — AD Interior Design wordmark + slat/marble mark
 *
 * Premium interior feel:
 * - Slat wall texture
 * - Marble feature panel
 * - Warm brass accent line
 * Motion is restrained and respects prefers-reduced-motion.
 */
export default function LogoMkt(props: Props) {
  return (
    <svg
      viewBox="0 0 360 64"
      role="img"
      aria-label="AD Interior Design Logo"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={`logo-fade ${props.className || ""}`}
    >
      <defs>
        {/* Brand gradient for wordmark + accents */}
        <linearGradient id="adGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--brand-primary)" />
          <stop offset="55%" stopColor="var(--brand-secondary)" />
          <stop offset="100%" stopColor="var(--brand-accent)" />
        </linearGradient>

        {/* Marble panel */}
        <linearGradient id="adMarble" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#eef2f7" />
        </linearGradient>

        {/* Veins */}
        <linearGradient id="adVein" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(15,23,42,0.18)" />
          <stop offset="50%" stopColor="rgba(201,162,106,0.22)" />
          <stop offset="100%" stopColor="rgba(15,23,42,0.14)" />
        </linearGradient>

        {/* Shimmer sweep (very subtle) */}
        <linearGradient id="adShine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.75)">
            <animate
              attributeName="offset"
              values="-1; 2"
              dur="8.8s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        <mask id="adShineMask">
          <rect width="360" height="64" fill="url(#adShine)" />
        </mask>
      </defs>

      {/* MARK (left) */}
      <g transform="translate(38,32)" className="float drop-glow">
        {/* Mark base tile */}
        <rect
          x="-22"
          y="-22"
          width="44"
          height="44"
          rx="12"
          fill="rgba(15,23,42,0.92)"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1"
        />

        {/* Slat wall */}
        <g opacity="0.9">
          {Array.from({ length: 7 }).map((_, i) => {
            const x = -16 + i * 5;
            return (
              <rect
                key={i}
                x={x}
                y="-14"
                width="2.2"
                height="28"
                rx="1.1"
                fill="rgba(255,255,255,0.16)"
              />
            );
          })}
        </g>

        {/* Marble inset */}
        <rect
          x="-4"
          y="-10"
          width="22"
          height="20"
          rx="5"
          fill="url(#adMarble)"
          stroke="rgba(255,255,255,0.20)"
          strokeWidth="1"
        />

        {/* Marble veins */}
        <path
          d="M-2 1c4-4 7-1 10-5 3-4 6 0 9-4"
          fill="none"
          stroke="url(#adVein)"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M0 7c3-2.5 5-1.5 8-3.5 3-2 4 0 7-2"
          fill="none"
          stroke="url(#adVein)"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.55"
        />

        {/* Brass accent line */}
        <rect
          x="-6"
          y="12"
          width="26"
          height="2.6"
          rx="1.3"
          fill="url(#adGrad)"
          opacity="0.95"
        />

        {/* Subtle shimmer sweep over the tile */}
        <rect
          x="-22"
          y="-22"
          width="44"
          height="44"
          rx="12"
          fill="url(#adShine)"
          mask="url(#adShineMask)"
          opacity="0.14"
        />
      </g>

      {/* WORDMARK */}
      <text
        x="74"
        y="36"
        fill="url(#adGrad)"
        fontFamily="var(--font-sans)"
        fontWeight="900"
        fontSize="22"
        letterSpacing="0.4"
        className="tracking-text"
      >
        AD Interior Design
      </text>

      {/* SUB-LABEL */}
      <text
        x="74"
        y="54"
        fill="rgba(15,23,42,0.55)"
        fontFamily="var(--font-sans)"
        fontWeight="800"
        fontSize="10.5"
        letterSpacing="2.0"
        className="subtle"
      >
        CUSTOM INTERIORS • BOTSWANA
      </text>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }
        .float {
          animation: float 6.2s cubic-bezier(0.45, 0, 0.25, 1) infinite;
          transform-origin: center;
        }

        .drop-glow {
          filter: drop-shadow(0 10px 20px rgba(2, 6, 23, 0.18))
            drop-shadow(0 0 14px rgba(201, 162, 106, 0.14));
          transition: filter 0.8s ease;
        }
        .drop-glow:hover {
          filter: drop-shadow(0 14px 26px rgba(2, 6, 23, 0.22))
            drop-shadow(0 0 18px rgba(201, 162, 106, 0.20));
        }

        @keyframes textReveal {
          0% {
            opacity: 0;
            letter-spacing: 0.10em;
            transform: translateY(6px);
          }
          100% {
            opacity: 1;
            letter-spacing: 0.04em;
            transform: translateY(0);
          }
        }
        .tracking-text {
          animation: textReveal 1.05s cubic-bezier(0.45, 0, 0.25, 1) forwards;
        }

        @keyframes fadeInLogo {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .logo-fade {
          animation: fadeInLogo 0.6s ease-in forwards;
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
