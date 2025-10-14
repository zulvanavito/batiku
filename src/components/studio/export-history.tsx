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
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  showBadge?: boolean;
  children?: React.ReactNode;
  asChild?: boolean;
}

export function ExportHistory({
  variant = "outline",
  size = "sm",
  showBadge = true,
  children,
  asChild = false,
}: ExportHistoryProps) {
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
    if (window.confirm("Yakin ingin menghapus semua riwayat ekspor?")) {
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

  // ✅ Render custom trigger jika asChild=true dan children tersedia
  const triggerButton =
    asChild && children ? (
      children
    ) : (
      <Button
        variant={variant}
        size={size}
        className="gap-2 h-10 px-3 sm:px-4"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <History className="w-4 h-4" />
        <span className="hidden sm:inline">Riwayat</span>
        {showBadge && history.length > 0 && (
          <Badge
            variant="secondary"
            className="ml-1 px-1.5 py-0 text-xs hidden sm:inline-flex"
          >
            {history.length}
          </Badge>
        )}
      </Button>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Lihat Riwayat Ekspor</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="max-w-2xl max-h-[85vh] sm:max-h-[80vh] p-0 gap-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b">
          <DialogTitle className="text-xl">Riwayat Ekspor</DialogTitle>
          <DialogDescription className="text-sm">
            Daftar ekspor yang pernah Anda lakukan. Maksimal 20 riwayat
            terakhir.
          </DialogDescription>
        </DialogHeader>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden px-4 sm:px-6 py-4">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                <History className="w-8 h-8 text-zinc-400 dark:text-zinc-600" />
              </div>
              <p className="text-base font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                Belum ada riwayat ekspor
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Ekspor desain Anda untuk melihat riwayat di sini
              </p>
            </div>
          ) : (
            <>
              {/* Filter & Stats */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                  <Select
                    value={filter}
                    onValueChange={(value) => setFilter(value as FilterType)}
                  >
                    <SelectTrigger className="h-9 w-[140px] sm:w-[160px]">
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
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 h-9 text-xs sm:text-sm"
                >
                  <Trash2 className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Hapus Semua</span>
                  <span className="sm:hidden">Hapus</span>
                </Button>
              </div>

              {/* History List */}
              <ScrollArea className="h-[calc(85vh-240px)] sm:h-[calc(80vh-240px)] pr-2 sm:pr-4">
                {filteredHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                      <Filter className="w-8 h-8 text-zinc-400 dark:text-zinc-600" />
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Tidak ada riwayat dengan filter ini
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 pb-2">
                    {filteredHistory.map((item) => (
                      <div
                        key={item.id}
                        className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                      >
                        <div className="flex gap-3">
                          {/* Thumbnail */}
                          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
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
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">
                                  {item.fileName}
                                </h4>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                  {formatDistanceToNow(
                                    new Date(item.timestamp),
                                    {
                                      addSuffix: true,
                                      locale: idLocale,
                                    }
                                  )}
                                </p>
                              </div>
                              {item.status === "success" ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                              )}
                            </div>

                            {/* Metadata Badges */}
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                              <Badge
                                variant="outline"
                                className="text-[10px] sm:text-xs px-1.5 py-0"
                              >
                                {item.settings.rapportCm}×
                                {item.settings.rapportCm} cm
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-[10px] sm:text-xs px-1.5 py-0"
                              >
                                {item.settings.dpi} DPI
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-[10px] sm:text-xs px-1.5 py-0"
                              >
                                {formatFileSize(item.fileSize)}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-[10px] sm:text-xs px-1.5 py-0 uppercase"
                              >
                                {item.settings.format}
                              </Badge>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 mt-3">
                              {item.status === "success" &&
                                item.downloadUrl && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs gap-1 px-2 sm:px-3"
                                    onClick={() => handleRedownload(item)}
                                  >
                                    <Download className="w-3 h-3" />
                                    <span className="hidden sm:inline">
                                      Unduh Ulang
                                    </span>
                                    <span className="sm:hidden">Unduh</span>
                                  </Button>
                                )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs gap-1 px-2 sm:px-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
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
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 border-t">
          <Button
            onClick={() => setOpen(false)}
            className="w-full h-10"
            variant="default"
          >
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
