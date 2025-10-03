"use client";

import { Button } from "@/components/ui/button";
import { Shirt, Square, Layers } from "lucide-react";

// Definisikan tipe untuk mode mockup yang tersedia
export type MockupMode = "tile" | "shirt" | "fabric";

type MockupToolbarProps = {
  activeMode: MockupMode;
  onModeChange: (mode: MockupMode) => void;
};

export function MockupToolbar({
  activeMode,
  onModeChange,
}: MockupToolbarProps) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg p-1.5 flex gap-1">
      <Button
        variant={activeMode === "tile" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onModeChange("tile")}
      >
        <Square className="w-4 h-4 mr-2" />
        Ubin
      </Button>
      <Button
        variant={activeMode === "shirt" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onModeChange("shirt")}
      >
        <Shirt className="w-4 h-4 mr-2" />
        Kemeja
      </Button>
      <Button
        variant={activeMode === "fabric" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onModeChange("fabric")}
      >
        <Layers className="w-4 h-4 mr-2" />
        Kain
      </Button>
    </div>
  );
}
