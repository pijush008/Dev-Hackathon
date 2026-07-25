import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/toaster";
import { SpeedInsightsProvider } from "@/components/shared/speed-insights-provider";

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
    default: "CareCompass",
    template: "%s | CareCompass",
  },
  description:
    "AI-powered healthcare for rural and underserved communities. Symptom checker, medication reminders, mental health support, teleconsultation, and crisis detection — all in one PWA.",
  keywords: [
    "healthcare",
    "rural health",
    "teleconsultation",
    "mental health",
    "medication reminders",
    "symptom checker",
    "crisis detection",
    "medical reports",
    "community health",
    "PWA",
  ],
  authors: [{ name: "CareCompass" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CareCompass",
    title: "CareCompass - Healthcare for Everyone, Everywhere",
    description:
      "AI-powered symptom checking, medication reminders, mental health support, and teleconsultation for rural and underserved communities.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CareCompass - Healthcare for Everyone, Everywhere",
    description:
      "AI-powered symptom checking, medication reminders, mental health support, and teleconsultation for rural and underserved communities.",
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
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delay={300}>
            {children}
            <Toaster />
            <SpeedInsightsProvider />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
