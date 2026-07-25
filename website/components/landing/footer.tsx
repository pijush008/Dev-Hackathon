import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Crisis Resources", href: "/crisis" },
      { label: "Provider Directory", href: "/care" },
      { label: "API Docs", href: "#" },
    ],
  },
  {
    title: "Health",
    links: [
      { label: "Symptom Checker", href: "/chat" },
      { label: "Medication Guide", href: "/chat" },
      { label: "Mental Health", href: "/mood" },
      { label: "Support Groups", href: "/community" },
      { label: "Health Reports", href: "/care/reports" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Partners", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Security", href: "#" },
      { label: "HIPAA", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t">
      {/* CTA Section */}
      <div className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Better healthcare starts here
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Join thousands of patients, families, and healthcare providers using
            CareCompass to bridge the access gap. Start for free today.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/auth/signup"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 text-base font-medium text-white shadow-lg shadow-emerald-600/25 transition-all hover:shadow-xl hover:shadow-emerald-600/30 hover:bg-emerald-700"
            >
              Start for free
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#features"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-8 text-base font-medium text-foreground transition-all hover:bg-muted"
            >
              Learn more
            </Link>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="border-t px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
                  <Heart className="size-4 fill-white" />
                </div>
                <span className="text-lg font-bold">CareCompass</span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                AI-powered healthcare access for rural and underserved
                communities. Symptom checking, mental health support, and
                teleconsultation — all in one PWA.
              </p>
              <div className="mt-6 flex gap-3">
                {["GitHub", "Twitter", "LinkedIn"].map((social) => (
                  <Link
                    key={social}
                    href="#"
                    className="flex size-9 items-center justify-center rounded-lg border bg-background text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {social[0]}
                  </Link>
                ))}
              </div>
            </div>

            {/* Link groups */}
            {footerLinks.map((group) => (
              <div key={group.title}>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {group.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} CareCompass. All rights reserved.
              Not a substitute for professional medical advice.
            </p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <Link href="#" className="hover:text-foreground">
                Privacy
              </Link>
              <Link href="#" className="hover:text-foreground">
                Terms
              </Link>
              <Link href="#" className="hover:text-foreground">
                HIPAA
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
