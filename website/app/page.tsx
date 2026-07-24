import dynamic from "next/dynamic";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Footer } from "@/components/landing/footer";

const Features = dynamic(
  () => import("@/components/landing/features").then((m) => m.Features),
  { ssr: false },
);

const Pricing = dynamic(
  () => import("@/components/landing/pricing").then((m) => m.Pricing),
  { ssr: false },
);

const Testimonials = dynamic(
  () =>
    import("@/components/landing/testimonials").then((m) => m.Testimonials),
  { ssr: false },
);

const FAQ = dynamic(
  () => import("@/components/landing/faq").then((m) => m.FAQ),
  { ssr: false },
);

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
