// src/components/studio/export-dialog.tsx

"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Download, Loader2 } from "lucide-react";
import { RapportSize } from "@/app/types/export";

interface ExportDialogProps {
  disabled?: boolean;
  isExporting?: boolean;
  exportProgress?: string;
  onExport: (rapportCm: RapportSize) => void;
  children?: React.ReactNode;
}

export function ExportDialog({
  disabled = false,
  isExporting = false,
  exportProgress = "",
  onExport,
  children,
}: ExportDialogProps) {
  const [rapportSize, setRapportSize] = useState<RapportSize>(25);
  const [open, setOpen] = useState(false);

  const handleExport = () => {
    onExport(rapportSize);
    setOpen(false);
  };

  // Kalau ada children (custom trigger), pakai itu
  const trigger = children || (
    <Button size="sm" disabled={disabled || isExporting} className="gap-2">
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {exportProgress || "Memproses..."}
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Ekspor
        </>
      )}
    </Button>
  );

  const targetPx = rapportSize === 20 ? 2362 : 2953;
  const estimatedSize = rapportSize === 20 ? "~4-6 MB" : "~5-8 MB";

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Ekspor Desain Batik</AlertDialogTitle>
          <AlertDialogDescription>
            Atur pengaturan ekspor untuk desain batik Anda.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* Pilihan Ukuran Raport */}
          <div className="space-y-2">
            <Label htmlFor="rapport-size">Ukuran Raport</Label>
            <Select
              value={rapportSize.toString()}
              onValueChange={(value) =>
                setRapportSize(Number(value) as RapportSize)
              }
            >
              <SelectTrigger id="rapport-size">
                <SelectValue placeholder="Pilih ukuran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">20 x 20 cm</SelectItem>
                <SelectItem value="25">25 x 25 cm (Recommended)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-zinc-500">
              Ukuran standar industri untuk produksi batik
            </p>
          </div>

          {/* Info Detail */}
          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">
                Resolusi:
              </span>
              <span className="font-medium">
                {targetPx} x {targetPx} px
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">DPI:</span>
              <span className="font-medium">300 DPI</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Format:</span>
              <span className="font-medium">PNG + Metadata JSON</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">
                Est. Ukuran File:
              </span>
              <span className="font-medium">{estimatedSize}</span>
            </div>
          </div>

          {/* File yang Akan Diekspor */}
          <div className="space-y-2">
            <Label>File yang akan diekspor:</Label>
            <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 ml-4">
              <li>
                • <span className="font-mono">batik.png</span> - Gambar raport
                siap cetak
              </li>
              <li>
                • <span className="font-mono">metadata.json</span> - Parameter
                desain
              </li>
              <li>
                • <span className="font-mono">README.txt</span> - Informasi
                ekspor
              </li>
            </ul>
            <p className="text-xs text-zinc-500 italic">
              SVG vectorization akan tersedia di versi berikutnya
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isExporting}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleExport}
            disabled={isExporting}
            className="gap-2"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Ekspor Sekarang
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
