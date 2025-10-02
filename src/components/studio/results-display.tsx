"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MousePointer } from "lucide-react";

// Definisikan tipe data untuk kandidat gambar yang diterima dari API
type Candidate = {
  base64: string; // Properti ini akan berisi data gambar mentah
  idx: number;
};

// Definisikan tipe untuk props yang diterima komponen ini dari halaman Studio
type ResultsDisplayProps = {
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
};

export function ResultsDisplay({
  candidates,
  onSelectCandidate,
}: ResultsDisplayProps) {
  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Pilih Kandidat Motif
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
        {candidates.map((candidate) => (
          <div
            key={candidate.idx}
            className="group relative aspect-square border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden"
          >
            {/* Gunakan komponen Image dari Next.js untuk menampilkan gambar.
              Format src `data:image/png;base64,...` adalah cara standar
              untuk menampilkan gambar langsung dari data base64.
            */}
            <Image
              src={`data:image/png;base64,${candidate.base64}`}
              alt={`Kandidat Motif #${candidate.idx}`}
              layout="fill"
              objectFit="cover"
              className="bg-zinc-100 dark:bg-zinc-900" // Fallback background
            />

            {/* Overlay yang muncul saat kursor mouse di atas gambar */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
              <Button
                variant="secondary"
                onClick={() => onSelectCandidate(candidate)}
              >
                <MousePointer className="w-4 h-4 mr-2" />
                Pilih & Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
