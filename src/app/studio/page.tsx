"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  FileImage,
  Home,
  Palette,
  Type,
  Wand2,
  X,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast, Toaster } from "sonner";

// Import komponen-komponen studio
import { GeneratorForm } from "@/components/studio/generator-form";
import { ImageUploadForm } from "@/components/studio/image-upload-form";
import { ResultsDisplay } from "@/components/studio/results-display";
import {
  EditorPanel,
  type EditorSettings,
} from "@/components/studio/editor-panel";
import { ExportDialog } from "@/components/studio/export-dialog";
import { ExportHistory } from "@/components/studio/export-history";
import { ExportProgress } from "@/components/studio/export-progress";
import { Wastra3DViewer } from "@/components/studio/wastra-3d-viewer";

// Import utilities & types
import { exportHistory } from "@/lib/export-history";
import type {
  RapportSize,
  ExportFormat,
  ExportResponse,
} from "@/app/types/export";

type Candidate = {
  imageUrl: string;
  idx: number;
};

type ExportProgressStatus =
  | "idle"
  | "processing"
  | "downloading"
  | "success"
  | "error";

export default function StudioPage() {
  const [activeMode, setActiveMode] = useState<"text" | "image">("text");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("generate");
  const [editorSettings, setEditorSettings] = useState<EditorSettings>({
    repeat: "square",
    symmetry: "none",
    density: 50,
    thickness: 1.5,
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<string>("");
  const [progressValue, setProgressValue] = useState(0);
  const [progressStatus, setProgressStatus] =
    useState<ExportProgressStatus>("idle");

  const handleGenerationComplete = (results: Candidate[]) => {
    setCandidates(results);
    setSelectedCandidate(null);
    setActiveTab("generate");
  };

  const handleSelectCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    toast.success(`Kandidat #${candidate.idx} dipilih!`);
    setActiveTab("edit");
  };

  const clearSelection = () => {
    setSelectedCandidate(null);
  };

  const handleSettingsChange = <K extends keyof EditorSettings>(
    key: K,
    value: EditorSettings[K]
  ) => {
    setEditorSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleExport = async (rapportCm: RapportSize, format: ExportFormat) => {
    if (!selectedCandidate) {
      toast.error("Pilih kandidat terlebih dahulu!");
      return;
    }

    setIsExporting(true);
    setProgressValue(0);
    setProgressStatus("processing");
    setExportProgress("Memulai proses ekspor...");

    try {
      setProgressValue(10);
      setExportProgress("Memproses gambar...");

      const response = await fetch("/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: selectedCandidate.imageUrl,
          settings: editorSettings,
          rapportCm,
          format,
          userId: "user-001",
          designId: `design-${Date.now()}`,
        }),
      });

      setProgressValue(40);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ details: "Unknown error" }));
        throw new Error(errorData.details || "Gagal mengekspor");
      }

      const data: ExportResponse = await response.json();

      if (!data.metadata || !data.metadata.fileSize) {
        data.metadata = {
          ...data.metadata,
          fileSize: rapportCm === 20 ? 5000000 : 6500000,
        };
      }

      setProgressValue(70);
      setProgressStatus("downloading");
      setExportProgress("Mengunduh file...");

      const link = document.createElement("a");
      link.href = data.downloadUrl;
      link.download = data.metadata.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setProgressValue(90);

      exportHistory.save({
        imageUrl: selectedCandidate.imageUrl,
        downloadUrl: data.downloadUrl,
        fileName: data.metadata.fileName,
        fileSize: data.metadata.fileSize || 0,
        settings: {
          rapportCm,
          dpi: data.metadata.dpi || 300,
          format: format,
          includeMetadata: true,
        },
        editorSettings,
        status: "success",
      });

      setProgressValue(100);
      setProgressStatus("success");
      setExportProgress("Ekspor selesai!");

      const fileSizeMB = data.metadata.fileSize
        ? (data.metadata.fileSize / 1024 / 1024).toFixed(2)
        : "~5-6";

      toast.success(
        <div className="space-y-1">
          <p className="font-semibold">Ekspor berhasil!</p>
          <p className="text-xs text-zinc-500">
            File: {data.metadata.fileName}
          </p>
          <p className="text-xs text-zinc-500">Ukuran: {fileSizeMB} MB</p>
          <p className="text-xs text-zinc-500">
            Resolusi: {data.metadata.resolution} @ {data.metadata.dpi} DPI
          </p>
        </div>,
        {
          duration: 5000,
        }
      );

      setTimeout(() => {
        setProgressValue(0);
        setProgressStatus("idle");
        setExportProgress("");
      }, 2000);
    } catch (error) {
      console.error("Error saat ekspor:", error);

      setProgressValue(0);
      setProgressStatus("error");
      setExportProgress("Ekspor gagal!");

      if (selectedCandidate) {
        exportHistory.save({
          imageUrl: selectedCandidate.imageUrl,
          downloadUrl: "",
          fileName: "export-failed.zip",
          fileSize: 0,
          settings: {
            rapportCm,
            dpi: 300,
            format: format,
            includeMetadata: true,
          },
          editorSettings,
          status: "failed",
        });
      }

      toast.error(
        <div className="space-y-1">
          <p className="font-semibold">Ekspor gagal</p>
          <p className="text-xs text-zinc-500">
            {error instanceof Error ? error.message : "Terjadi kesalahan"}
          </p>
        </div>
      );

      setTimeout(() => {
        setProgressValue(0);
        setProgressStatus("idle");
        setExportProgress("");
      }, 3000);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Toaster position="top-center" richColors />

      <ExportProgress
        isVisible={progressValue > 0}
        progress={progressValue}
        status={progressStatus}
        message={exportProgress}
      />

      <div className="min-h-screen w-full bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex flex-col">
        {/* Header - Modern dengan Amber Accent */}
        <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-4 px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/Batiku Only.png"
                alt="Batiku Logo"
                width={150}
                height={50}
                className="transition-transform group-hover:scale-105"
                style={{ height: "auto" }}
              />
            </Link>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                {selectedCandidate && (
                  <div className="ml-2 px-2 py-1 rounded-full bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-950 dark:to-amber-900">
                    <span className="text-xs font-medium text-amber-800 dark:text-amber-200">
                      Kandidat #{selectedCandidate.idx}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {selectedCandidate && (
                <Wastra3DViewer
                  imageUrl={selectedCandidate.imageUrl}
                  disabled={!selectedCandidate}
                />
              )}
              <ExportHistory />
              <ExportDialog
                disabled={!selectedCandidate}
                isExporting={isExporting}
                exportProgress={exportProgress}
                onExport={handleExport}
              />
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Kiri - Mode Selector dengan Amber Theme */}
          <aside className="hidden sm:flex flex-col w-20 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <nav className="flex flex-col items-center gap-3 py-6 px-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/"
                    className="group flex items-center justify-center w-12 h-12 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all duration-200"
                  >
                    <Home className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  Beranda
                </TooltipContent>
              </Tooltip>

              <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 my-2" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setActiveMode("text")}
                    className={`group flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
                      activeMode === "text"
                        ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-600/30"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                    }`}
                  >
                    <Type className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  Mode Teks
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setActiveMode("image")}
                    className={`group flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
                      activeMode === "image"
                        ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-600/30"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                    }`}
                  >
                    <FileImage className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  Mode Gambar
                </TooltipContent>
              </Tooltip>
            </nav>
          </aside>

          {/* Main Canvas - Modern Design */}
          <main className="flex-1 flex items-center justify-center p-6 lg:p-10">
            <div className="w-full max-w-3xl">
              <div className="aspect-square rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden relative">
                {selectedCandidate ? (
                  <div className="w-full h-full relative group">
                    {/* Clear Button */}
                    <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        onClick={clearSelection}
                        size="sm"
                        variant="secondary"
                        className="shadow-lg backdrop-blur-sm bg-white/90 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-900"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Batal Pilih
                      </Button>
                    </div>

                    {/* Image Preview dengan Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-transparent dark:from-amber-950/10 pointer-events-none" />

                    <div className="w-full h-full flex items-center justify-center p-12">
                      <div className="relative w-full h-full">
                        <Image
                          src={selectedCandidate.imageUrl}
                          alt="Preview Motif Batik"
                          fill
                          className="object-contain rounded-lg drop-shadow-2xl"
                          unoptimized
                          priority
                        />
                      </div>
                    </div>

                    {/* Info Badge */}
                    <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm shadow-lg border border-zinc-200 dark:border-zinc-800">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        Kandidat #{selectedCandidate.idx}
                      </span>
                    </div>
                  </div>
                ) : candidates.length > 0 ? (
                  <ResultsDisplay
                    candidates={candidates}
                    onSelectCandidate={handleSelectCandidate}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-950 dark:to-amber-900 flex items-center justify-center mb-6">
                      <Sparkles className="w-10 h-10 text-amber-600 dark:text-amber-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                      Siap Berkarya?
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
                      Mulai dengan mendeskripsikan motif batik impian Anda atau
                      upload gambar referensi
                    </p>
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Right Sidebar - Clean Editor Panel */}
          <aside className="hidden lg:flex flex-col w-96 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex flex-col h-full"
            >
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                <TabsList className="grid w-full grid-cols-2 bg-zinc-100 dark:bg-zinc-900 p-1">
                  <TabsTrigger
                    value="generate"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-amber-700 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate
                  </TabsTrigger>
                  <TabsTrigger
                    value="edit"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-amber-700 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    Editor
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent
                value="generate"
                className="flex-1 overflow-y-auto p-6 space-y-6"
              >
                {activeMode === "text" ? (
                  <GeneratorForm
                    onGenerationComplete={handleGenerationComplete}
                  />
                ) : (
                  <ImageUploadForm
                    onGenerationComplete={handleGenerationComplete}
                  />
                )}
              </TabsContent>

              <TabsContent value="edit" className="flex-1 overflow-y-auto p-6">
                {!selectedCandidate ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4">
                      <Palette className="w-8 h-8 text-zinc-400 dark:text-zinc-600" />
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Pilih salah satu kandidat untuk mulai mengedit
                    </p>
                  </div>
                ) : (
                  <EditorPanel
                    settings={editorSettings}
                    onSettingsChange={handleSettingsChange}
                  />
                )}
              </TabsContent>
            </Tabs>
          </aside>
        </div>
      </div>
    </TooltipProvider>
  );
}
