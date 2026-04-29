import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/layout/site-header";

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VoteWise Guide",
  description:
    "AI-assisted election learning platform with personalized guidance, timelines, simulation, and misinformation checks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        notoSans.variable
      )}
    >
      <body className="min-h-full flex flex-col bg-zinc-50">
        <a
          href="#main-content"
          className="absolute left-0 top-0 z-50 -translate-y-full bg-primary p-3 text-primary-foreground transition-transform focus:translate-y-0"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
      </body>
    </html>
  );
}
