import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Cta() {
  return (
    <section className="flex items-center justify-center w-full min-h-screen">
      <div className="mx-10 w-full">
        <div className="rounded-2xl border border-zinc-800 bg-deep-ocean p-24 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Mulai Ciptakan Motif Batik Anda
          </h2>
          <p className="text-zinc-300 max-w-xl mx-auto">
            Buka studio, tuliskan ide Anda, dan biarkan AI membantu mewujudkan
            visi kreatif Anda menjadi karya yang siap produksi.
          </p>
          <Button
            variant="secondary"
            asChild
            size="lg"
            className="bg-white hover:bg-zinc-200"
          >
            <Link href="/studio">Buka Studio Gratis</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
