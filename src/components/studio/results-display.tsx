"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MousePointer } from "lucide-react";

// Tipe data yang menerima imageUrl dari S3
type Candidate = {
  imageUrl: string;
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
      <h2 className="text-xl font-semibold mt-4 text-center">
        Pilih Kandidat Motif
      </h2>
      <div className="grid grid-cols-2 gap-4 flex-1 mx-10 mt-5">
        {candidates.map((candidate) => (
          // 1. Pastikan div induk memiliki class 'relative'
          <div
            key={candidate.idx}
            className="group relative aspect-square border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden"
          >
            {/* 2. Gunakan komponen Image dengan `layout="fill"` */}
            <Image
              src={candidate.imageUrl}
              alt={`Kandidat Motif #${candidate.idx}`}
              layout="fill"
              objectFit="cover"
              className="bg-zinc-100 dark:bg-zinc-900"
              unoptimized
            />

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
