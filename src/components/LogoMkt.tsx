"use client";

import type React from "react";

type Props = React.SVGProps<SVGSVGElement>;

/**
 * Logo — Sparkle Legacy wordmark + shield mark
 *
 * Combines the shield mark with a bold wordmark. The shield uses a rich
 * gradient palette and a shimmering sweep for subtle movement. The wordmark
 * reveals smoothly on load, reinforcing professionalism and trust:contentReference[oaicite:1]{index=1}.
 */
export default function LogoMkt(props: Props) {
  return (
    <svg
      viewBox="0 0 360 64"
      role="img"
      aria-label="Sparkle Legacy Insurance Brokers Logo"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={`logo-fade ${props.className || ""}`}
    >
      <defs>
        {/* Brand gradient for shield and wordmark */}
        <linearGradient id="insGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--brand-primary)" />
          <stop offset="55%" stopColor="var(--brand-secondary)" />
          <stop offset="100%" stopColor="var(--brand-accent)" />
        </linearGradient>

        {/* Soft inner glow behind the shield */}
        <radialGradient id="insGlow" cx="50%" cy="38%" r="72%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.92)" />
          <stop offset="35%" stopColor="rgba(56,189,248,0.45)" />
          <stop offset="70%" stopColor="rgba(29,78,216,0.28)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        {/* Moving shimmer highlight */}
        <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.9)">
            <animate
              attributeName="offset"
              values="-1; 2"
              dur="7.5s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        <mask id="shineMask">
          <rect width="360" height="64" fill="url(#shine)" />
        </mask>
      </defs>

      {/* Mark */}
      <g transform="translate(36,32)" className="float drop-glow">
        {/* Shield shape */}
        <path
          d="M0 -18c8.6 0 15.6 7 15.6 15.7 0 11.4-13 23.4-15.6 25.8-2.6-2.4-15.6-14.4-15.6-25.8C-15.6 -11-8.6 -18 0 -18Z"
          fill="url(#insGrad)"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="1.6"
        />
        {/* Soft glow behind shield */}
        <path
          d="M0 -25c12.1 0 22 9.9 22 22.1 0 16.1-18.4 32.9-22 36.1-3.6-3.2-22-20-22-36.1C-22 -15.1 -12.1 -25 0 -25Z"
          fill="url(#insGlow)"
          opacity="0.7"
        />

        {/* Shimmer sweep */}
        <path
          d="M0 -18c8.6 0 15.6 7 15.6 15.7 0 11.4-13 23.4-15.6 25.8-2.6-2.4-15.6-14.4-15.6-25.8C-15.6 -11-8.6 -18 0 -18Z"
          fill="url(#shine)"
          mask="url(#shineMask)"
          opacity="0.28"
        />

        {/* Check mark */}
        <path
          d="M-7.8 2.2l3.5 3.6L8.2 -7.2"
          fill="none"
          stroke="rgba(31,41,55,0.85)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
      </g>

      {/* Wordmark */}
      <text
        x="74"
        y="36"
        fill="url(#insGrad)"
        fontFamily="var(--font-sans)"
        fontWeight="900"
        fontSize="22"
        letterSpacing="0.6"
        className="tracking-text"
      >
        Sparkle Legacy
      </text>

      {/* Sub-label */}
      <text
        x="74"
        y="54"
        fill="rgba(31,41,55,0.55)"
        fontFamily="var(--font-sans)"
        fontWeight="800"
        fontSize="10.5"
        letterSpacing="2.0"
        className="subtle"
      >
        INSURANCE BROKERS • BOTSWANA
      </text>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        .float {
          animation: float 5.2s cubic-bezier(0.45, 0, 0.25, 1) infinite;
          transform-origin: center;
        }

        .drop-glow {
          filter: drop-shadow(0 0 12px rgba(56, 189, 248, 0.18))
            drop-shadow(0 0 22px rgba(45, 212, 191, 0.14))
            drop-shadow(0 0 26px rgba(29, 78, 216, 0.12));
          transition: filter 0.8s ease;
        }
        .drop-glow:hover {
          filter: drop-shadow(0 0 16px rgba(56, 189, 248, 0.28))
            drop-shadow(0 0 28px rgba(45, 212, 191, 0.22))
            drop-shadow(0 0 34px rgba(29, 78, 216, 0.18));
        }

        @keyframes textReveal {
          0% {
            opacity: 0;
            letter-spacing: 0.12em;
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
