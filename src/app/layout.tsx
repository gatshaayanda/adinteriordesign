// src/app/layout.tsx
import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loader from "@/components/AdminHubLoader";
import ChatWidget from "@/components/ChatWidget";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AD Interior Design — TV Stands, Wall Panels & Custom Interiors | Botswana",
  description:
    "Premium TV stands, slat wall panels, marble panels, floating cabinets, wardrobes and custom interior builds. Based in Botswana. WhatsApp for a quote: +267 77 807 112.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="bg-[--background] text-[--foreground] antialiased font-sans">
        <Loader />

        <AnalyticsProvider>
          <div className="min-h-screen flex flex-col">
            <div className="sticky top-0 z-40 bg-[--background]/85 backdrop-blur border-b border-[--border]">
              <Header />
            </div>

            <main className="flex-1">{children}</main>

            <Footer />
          </div>

          <ChatWidget />
          <Analytics />
          <SpeedInsights />
        </AnalyticsProvider>
      </body>
    </html>
  );
}
