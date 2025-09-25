import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center text-white overflow-hidden">
      {/* 1. Background Image */}
      <div
        className="absolute inset-[0] z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      />

      {/* 2. Dark Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-black/35" />

      {/* 3. Content */}
      <div className="container relative z-20 text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter !leading-tight">
          Ciptakan Mahakarya Batik Anda dengan Bantuan AI
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-white">
          Dari ide sederhana menjadi desain *seamless tile* yang siap produksi.
          Ekspor dalam format <strong>PNG 300 DPI</strong> dan{" "}
          <strong>SVG</strong> berkualitas tinggi.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button
          variant="secondary"
            asChild
            size="lg"
            className="bg-white hover:bg-zinc-200"
          >
            <Link href="/studio">
              Mulai Mendesain Sekarang <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}