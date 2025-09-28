"use client";

import { Button } from "@/components/ui/button";
import { MousePointer } from "lucide-react";

// Definisikan tipe data untuk kandidat gambar
type Candidate = {
  s3KeyPng: string;
  idx: number;
};

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
      <h2 className="text-xl font-semibold mt-5 mb-4 text-center">
        Pilih Kandidat Motif
      </h2>
      <div className="grid m-5 grid-cols-1 md:grid-cols-3 gap-4 flex-1">
        {candidates.map((candidate) => (
          <div
            key={candidate.idx}
            className="group relative aspect-square border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden"
          >
            <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
              <span className="text-zinc-500 text-sm">
                Kandidat #{candidate.idx}
              </span>
            </div>
            {/* Overlay yang muncul saat hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
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
