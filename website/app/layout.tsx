import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/toaster";

const SpeedInsights = dynamic(
  () => import("@vercel/speed-insights/next").then((m) => m.SpeedInsights),
  { ssr: false },
);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SaaS Platform",
    template: "%s | SaaS Platform",
  },
  description:
    "The all-in-one platform to build, deploy, and scale your SaaS. Ship faster, grow bigger.",
  keywords: ["SaaS", "platform", "deploy", "scale", "dashboard"],
  authors: [{ name: "SaaS Platform" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SaaS Platform",
    title: "SaaS Platform - Build, Deploy, Scale",
    description:
      "The all-in-one platform to build, deploy, and scale your SaaS.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaS Platform - Build, Deploy, Scale",
    description:
      "The all-in-one platform to build, deploy, and scale your SaaS.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
