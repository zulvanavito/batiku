// src/components/studio/export-history.tsx

"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  History,
  Download,
  Trash2,
  CheckCircle2,
  XCircle,
  Filter,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { exportHistory } from "@/lib/export-history";
import type { ExportHistoryItem } from "@/app/types/export";
import Image from "next/image";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type FilterType = "all" | "success" | "failed";

interface ExportHistoryProps {
  asChild?: boolean;
  children?: React.ReactNode;
}

export function ExportHistory({ asChild, children }: ExportHistoryProps) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<ExportHistoryItem[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");

  // Load history saat dialog dibuka
  useEffect(() => {
    if (open) {
      loadHistory();
    }
  }, [open]);

  const loadHistory = () => {
    const items = exportHistory.getAll();
    setHistory(items);
  };

  const handleDelete = (id: string) => {
    exportHistory.deleteById(id);
    loadHistory();
    toast.success("Riwayat dihapus");
  };

  const handleClearAll = () => {
    if (confirm("Yakin ingin menghapus semua riwayat ekspor?")) {
      exportHistory.clear();
      loadHistory();
      toast.success("Semua riwayat dihapus");
    }
  };

  const handleRedownload = (item: ExportHistoryItem) => {
    if (!item.downloadUrl) {
      toast.error("URL download tidak tersedia");
      return;
    }

    const link = document.createElement("a");
    link.href = item.downloadUrl;
    link.download = item.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Mengunduh ulang...");
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return "0 MB";
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  };

  // Filter history berdasarkan status
  const filteredHistory = history.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  const successCount = history.filter(
    (item) => item.status === "success"
  ).length;
  const failedCount = history.filter((item) => item.status === "failed").length;

  // Konten tombol trigger default
  const defaultTrigger = (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-10 px-4">
          <History className="w-4 h-4" />
          Riwayat
          {history.length > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
              {history.length}
            </Badge>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Riwayat Ekspor</TooltipContent>
    </Tooltip>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Menggunakan conditional rendering. Jika asChild true, gunakan children (tombol kustom dari page.tsx) */}
        {asChild ? children : defaultTrigger}
      </DialogTrigger>
      {/* FIX: Tambahkan padding horizontal yang aman di DialogContent (p-4 di mobile) */}
      {/* Catatan: Di Shadcn/UI, p-4 (1rem) sering digunakan sebagai padding default. */}
      <DialogContent className="max-w-2xl max-h-[80vh] p-4 sm:p-6 flex flex-col">
        <DialogHeader className="px-0">
          {" "}
          {/* FIX: Hilangkan padding di header karena sudah ada di DialogContent */}
          <DialogTitle>Riwayat Ekspor</DialogTitle>
          <DialogDescription>
            Daftar ekspor yang pernah Anda lakukan. Maksimal 20 riwayat
            terakhir.
          </DialogDescription>
        </DialogHeader>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <History className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-4" />
            <p className="text-zinc-500 dark:text-zinc-400">
              Belum ada riwayat ekspor
            </p>
            <p className="text-sm text-zinc-400 dark:text-zinc-600 mt-1">
              Ekspor desain Anda untuk melihat riwayat di sini
            </p>
          </div>
        ) : (
          <>
            {/* Filter & Stats */}
            <div className="flex items-center justify-between gap-4 pb-2">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-zinc-500" />
                <Select
                  value={filter}
                  onValueChange={(value) => setFilter(value as FilterType)}
                >
                  <SelectTrigger className="h-8 w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      Semua ({history.length})
                    </SelectItem>
                    <SelectItem value="success">
                      Berhasil ({successCount})
                    </SelectItem>
                    <SelectItem value="failed">
                      Gagal ({failedCount})
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 h-8"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus Semua
              </Button>
            </div>

            <ScrollArea className="h-[500px] pr-4">
              {filteredHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Filter className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-4" />
                  <p className="text-zinc-500 dark:text-zinc-400">
                    Tidak ada riwayat dengan filter ini
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredHistory.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                    >
                      <div className="flex gap-3">
                        {/* Thumbnail */}
                        <div className="relative w-16 h-16 rounded overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt="Thumbnail"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <XCircle className="w-6 h-6 text-zinc-400" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">
                                {item.fileName}
                              </h4>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                {formatDistanceToNow(new Date(item.timestamp), {
                                  addSuffix: true,
                                  locale: idLocale,
                                })}
                              </p>
                            </div>
                            {item.status === "success" ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                            )}
                          </div>

                          {/* Metadata */}
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {item.settings.rapportCm}x
                              {item.settings.rapportCm} cm
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {item.settings.dpi} DPI
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {formatFileSize(item.fileSize)}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs uppercase"
                            >
                              {item.settings.format}
                            </Badge>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 mt-3">
                            {item.status === "success" && item.downloadUrl && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs gap-1"
                                onClick={() => handleRedownload(item)}
                              >
                                <Download className="w-3 h-3" />
                                Unduh Ulang
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                              Hapus
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </>
        )}

        <div className="px-0 pt-4 border-t">
          {" "}
          {/* FIX: Hilangkan padding horizontal di footer karena sudah ada di DialogContent, tapi pertahankan vertical spacing */}
          <Button onClick={() => setOpen(false)} className="w-full">
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
