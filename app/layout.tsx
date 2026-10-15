import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Augustine Godwin — Web Developer",
  description:
    "Performance-driven web developer specializing in Next.js, Vercel and Tailwind CSS.",
};

export const viewport: Viewport = { themeColor: "#050706" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} bg-bg text-fg`}>
      {/* leading-[normal] restores the browser default that Tailwind's preflight (1.5) changes */}
      <body className="m-0 bg-bg text-fg leading-[normal] antialiased [text-rendering:optimizeLegibility]">
        {children}
      </body>
    </html>
  );
}