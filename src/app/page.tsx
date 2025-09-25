import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Faq } from "@/components/landing/faq";
import { Cta } from "@/components/landing/cta";

export default function HomePage() {
  return (
    <div className="bg-white text-zinc-900">
      <main>
        <Hero />
        <Features />
        <Faq />
        <Cta />
      </main>
    </div>
  );
}
