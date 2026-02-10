"use client";

import type React from "react";

type Props = React.SVGProps<SVGSVGElement>;

/**
 * Sparkle Legacy Mark — Shield
 *
 * This mark conveys trust and stability through a classic shield shape and
 * rich gradient colours. A subtle shimmer highlights the shield, and a
 * gentle pulse animation breathes life into the icon. The design aligns
 * with insurance‑website best practices by using an approachable yet
 * professional palette and restrained motion effects:contentReference[oaicite:1]{index=1}.
 */
export default function LogoMktMark(props: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="Sparkle Legacy Mark"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={`mark-pulse ${props.className || ""}`}
    >
      <defs>
        {/* Primary gradient across the shield */}
        <linearGradient id="insGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--brand-primary)" />
          <stop offset="55%" stopColor="var(--brand-secondary)" />
          <stop offset="100%" stopColor="var(--brand-accent)" />
        </linearGradient>

        {/* Inner glow radiates softly from the top */}
        <radialGradient id="insGlow" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.88)" />
          <stop offset="35%" stopColor="rgba(2,132,199,0.42)" />
          <stop offset="70%" stopColor="rgba(30,64,175,0.28)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        {/* Soft shimmer sweep traversing the shield */}
        <linearGradient id="sweep" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="45%" stopColor="rgba(255,255,255,0.85)">
            <animate
              attributeName="offset"
              values="-1; 2"
              dur="7.5s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        <mask id="sweepMask">
          <rect width="64" height="64" fill="url(#sweep)" />
        </mask>
      </defs>

      {/* Depth shadow below the shield */}
      <path
        d="M32 9c9.1 0 16.5 7.5 16.5 16.7 0 12.2-13.7 24.9-16.5 27.4-2.8-2.5-16.5-15.2-16.5-27.4C15.5 16.5 22.9 9 32 9Z"
        fill="#000"
        opacity="0.18"
        transform="translate(0 1.6)"
      />

      {/* Shield with sweeping highlight */}
      <g mask="url(#sweepMask)">
        <path
          d="M32 9c9.1 0 16.5 7.5 16.5 16.7 0 12.2-13.7 24.9-16.5 27.4-2.8-2.5-16.5-15.2-16.5-27.4C15.5 16.5 22.9 9 32 9Z"
          fill="url(#insGrad)"
        />
      </g>

      {/* Glow bloom behind the shield */}
      <path
        d="M32 3c12.7 0 23 10.4 23 23.2 0 17.3-19.3 35.1-23 38.4-3.7-3.3-23-21.1-23-38.4C9 13.4 19.3 3 32 3Z"
        fill="url(#insGlow)"
        opacity="0.78"
      />

      {/* Rim outlines the shield */}
      <path
        d="M32 9c9.1 0 16.5 7.5 16.5 16.7 0 12.2-13.7 24.9-16.5 27.4-2.8-2.5-16.5-15.2-16.5-27.4C15.5 16.5 22.9 9 32 9Z"
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.0"
      />

      {/* Check mark inside the shield */}
      <path
        d="M25.2 32.4l4.2 4.4L40 26.9"
        fill="none"
        stroke="rgba(31,41,55,0.84)"
        strokeWidth="3.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.92"
      />

      <style jsx>{`
        @keyframes pulseSoft {
          0%,
          100% {
            transform: scale(1);
            filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.18))
              drop-shadow(0 0 16px rgba(45, 212, 191, 0.12))
              drop-shadow(0 0 18px rgba(30, 64, 175, 0.10));
          }
          50% {
            transform: scale(1.05);
            filter: drop-shadow(0 0 14px rgba(56, 189, 248, 0.28))
              drop-shadow(0 0 22px rgba(45, 212, 191, 0.20))
              drop-shadow(0 0 26px rgba(30, 64, 175, 0.16));
          }
        }
        .mark-pulse {
          animation: pulseSoft 5.2s cubic-bezier(0.45, 0, 0.25, 1) infinite;
          transform-origin: center;
          transition: filter 0.8s ease;
        }
        .mark-pulse:hover {
          filter: drop-shadow(0 0 16px rgba(56, 189, 248, 0.34))
            drop-shadow(0 0 26px rgba(45, 212, 191, 0.26))
            drop-shadow(0 0 32px rgba(30, 64, 175, 0.20));
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
