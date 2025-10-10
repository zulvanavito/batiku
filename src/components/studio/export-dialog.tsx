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
import { cn } from "@/lib/utils"; 

// FIX: Tambahkan asChild dan className ke interface
export interface ExportDialogProps {
  disabled?: boolean;
  isExporting?: boolean;
  exportProgress?: string;
  onExport: (rapportCm: RapportSize, format: ExportFormat) => void;
  children?: React.ReactNode;
  asChild?: boolean; 
  className?: string; 
}

export function ExportDialog({
  disabled = false,
  isExporting = false,
  onExport,
  children,
  asChild = false, // FIX: Destructure asChild
  className, // FIX: Destructure className
}: ExportDialogProps) {
  const [rapportSize, setRapportSize] = useState<RapportSize>(25);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [open, setOpen] = useState(false);

  const handleExport = () => {
    // Tutup dialog sebelum memulai proses ekspor (yang akan ditunjukkan di ProgressDialog)
    setOpen(false);
    // Jalankan fungsi ekspor utama yang ada di page.tsx
    onExport(rapportSize, exportFormat);
  };

  // Konten tombol trigger default
  const defaultTrigger = (
    <Button
      variant="default"
      size="sm"
      disabled={disabled}
      className={cn("gap-2", className)} // FIX: Gunakan className di sini
    >
      <Download className="w-4 h-4" />
      Ekspor
    </Button>
  );

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {asChild ? children : defaultTrigger}
      </AlertDialogTrigger>
      {/* FIX 1: Hapus padding default (p-0) dari AlertDialogContent */}
      <AlertDialogContent className="p-0 max-w-[95vw] sm:max-w-lg"> 
        <AlertDialogHeader className="p-4 sm:p-6 pb-4 border-b"> {/* FIX 2: Tambahkan padding ke Header */}
          <AlertDialogTitle className="flex items-center gap-2">
            <Download className="w-6 h-6 text-amber-600" />
            Pengaturan Ekspor
          </AlertDialogTitle>
          <AlertDialogDescription>
            Pilih ukuran rapport dan format file yang Anda butuhkan.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* FIX 3: Tambahkan padding horizontal ke konten utama */}
        <div className="space-y-6 py-2 px-4 sm:px-6"> 
          <div className="space-y-2">
            <Label>Ukuran Rapport (cm)</Label>
            <Select
              value={rapportSize.toString()}
              onValueChange={(value) =>
                setRapportSize(parseInt(value) as RapportSize)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih ukuran rapport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25x25 cm (DPI Optimal: 300)</SelectItem>
                <SelectItem value="50">50x50 cm (DPI Optimal: 300)</SelectItem>
                <SelectItem value="75">75x75 cm (DPI Optimal: 300)</SelectItem>
                <SelectItem value="100">
                  100x100 cm (DPI Optimal: 300)
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Pilih ukuran rapport yang sesuai dengan kebutuhan produksi Anda.
            </p>
          </div>

          {/* Opsi Format File */}
          <div className="space-y-2">
            <Label>Format File</Label>
            <RadioGroup
              value={exportFormat}
              onValueChange={(value) => setExportFormat(value as ExportFormat)}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900">
                <RadioGroupItem value="png" id="png-format" />
                <Label
                  htmlFor="png-format"
                  className="flex items-center gap-2 font-normal cursor-pointer"
                >
                  <FileImage className="w-4 h-4" />
                  PNG (Raster)
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900">
                <RadioGroupItem value="png-svg" id="png-svg-format" />
                <Label
                  htmlFor="png-svg-format"
                  className="flex items-center gap-2 font-normal cursor-pointer"
                >
                  <FileCode2 className="w-4 h-4" />
                  PNG + SVG (Vektor)
                </Label>
              </div>
            </RadioGroup>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              PNG untuk cetak langsung, SVG untuk editing vektor lanjutan.
            </p>
          </div>

          {/* Detail Ekspor */}
          <div className="pt-4 border-t">
            <Label className="font-semibold text-sm flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
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

        <AlertDialogFooter className="p-4 sm:p-6 pt-0"> {/* FIX 4: Tambahkan padding ke Footer */}
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