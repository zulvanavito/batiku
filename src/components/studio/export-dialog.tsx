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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Download,
  Loader2,
  FileImage,
  FileCode2,
  CheckCircle2,
} from "lucide-react";
import { RapportSize, ExportFormat } from "@/app/types/export";

interface ExportDialogProps {
  disabled?: boolean;
  isExporting?: boolean;
  exportProgress?: string;
  onExport: (rapportCm: RapportSize, format: ExportFormat) => void;
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
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [open, setOpen] = useState(false);

  const handleExport = () => {
    onExport(rapportSize, exportFormat);
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

        <div className="space-y-5 py-4">
          {/* Pilihan Ukuran Raport */}
          <div className="space-y-2">
            <Label htmlFor="rapport-size" className="text-sm font-medium">
              Ukuran Raport
            </Label>
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

          {/* Pilihan Format Export */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Format Export</Label>
            <RadioGroup
              value={exportFormat}
              onValueChange={(value) => setExportFormat(value as ExportFormat)}
              className="space-y-3"
            >
              <div className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem
                  value="png"
                  id="format-png"
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <Label
                    htmlFor="format-png"
                    className="font-normal cursor-pointer flex items-center gap-2"
                  >
                    <FileImage className="w-4 h-4 text-blue-600" />
                    <span>PNG Only</span>
                    {exportFormat === "png" && (
                      <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto" />
                    )}
                  </Label>
                  <p className="text-xs text-zinc-500 mt-1">
                    File raster siap cetak dengan resolusi tinggi
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem
                  value="png-svg"
                  id="format-png-svg"
                  disabled
                  className="mt-0.5"
                />
                <div className="flex-1 opacity-50">
                  <Label
                    htmlFor="format-png-svg"
                    className="font-normal cursor-not-allowed flex items-center gap-2"
                  >
                    <FileCode2 className="w-4 h-4 text-purple-600" />
                    <span>PNG + SVG</span>
                    <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded ml-auto">
                      Coming Soon
                    </span>
                  </Label>
                  <p className="text-xs text-zinc-500 mt-1">
                    Termasuk file vektor untuk editing lebih lanjut
                  </p>
                </div>
              </div>
            </RadioGroup>
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
              <span className="font-medium">
                {exportFormat === "png"
                  ? "PNG + Metadata"
                  : "PNG + SVG + Metadata"}
              </span>
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
            <Label className="text-sm font-medium">
              File yang akan diekspor:
            </Label>
            <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 ml-4">
              <li>
                • <span className="font-mono text-xs">batik.png</span> - Gambar
                raport siap cetak
              </li>
              <li>
                • <span className="font-mono text-xs">metadata.json</span> -
                Parameter desain
              </li>
              <li>
                • <span className="font-mono text-xs">README.txt</span> -
                Informasi ekspor
              </li>
              {exportFormat === "png-svg" && (
                <li>
                  • <span className="font-mono text-xs">batik.svg</span> - File
                  vektor (SVG)
                </li>
              )}
            </ul>
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
