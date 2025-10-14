/* eslint-disable @typescript-eslint/no-explicit-any */
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

import { exportHistory } from "@/lib/export-history";
import type {
  RapportSize,
  ExportFormat,
  ExportResponse,
} from "@/app/types/export";

declare module "@/components/studio/export-dialog" {
  export interface ExportDialogProps {
    asChild?: boolean;
    className?: string;
  }
}

declare module "@/components/studio/wastra-3d-viewer" {
  export interface Wastra3DViewerProps {
    isMenuMode?: boolean;
  }
}

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

type StudioSettingsKey = keyof EditorSettings | "mode";
type StudioSettingsHandler = <K extends StudioSettingsKey>(
  key: K,
  value: K extends "mode"
    ? "text" | "image"
    : EditorSettings[Exclude<K, "mode">]
) => void;

type RightPanelProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeMode: "text" | "image";
  selectedCandidate: Candidate | null;
  editorSettings: EditorSettings;
  handleGenerationComplete: (results: Candidate[]) => void;
  handleSettingsChange: StudioSettingsHandler;
};

const RightPanelContent = ({
  activeTab,
  setActiveTab,
  activeMode,
  selectedCandidate,
  editorSettings,
  handleGenerationComplete,
  handleSettingsChange,
}: RightPanelProps) => (
  <Tabs
    value={activeTab}
    onValueChange={setActiveTab}
    className="flex flex-col h-full"
  >
    <div className="p-4 sm:p-6 border-b border-zinc-200 dark:border-zinc-800">
      <TabsList className="grid w-full grid-cols-2 bg-zinc-100 dark:bg-zinc-900 p-1">
        <TabsTrigger
          value="generate"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-amber-700 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 text-sm sm:text-base"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Generate
        </TabsTrigger>
        <TabsTrigger
          value="edit"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 to-amber-700 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 text-sm sm:text-base"
        >
          <Palette className="w-4 h-4 mr-2" />
          Editor
        </TabsTrigger>
      </TabsList>
    </div>

    <TabsContent
      value="generate"
      className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6"
    >
      {/* Mobile Mode Selector: Tampil di mobile, sembunyikan di desktop */}
      <div className="lg:hidden flex justify-center gap-4 p-2 mb-2 border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() =>
            activeMode === "text" ? null : handleSettingsChange("mode", "text")
          }
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeMode === "text"
              ? "bg-amber-600 text-white"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          }`}
        >
          <Type className="h-4 w-4 inline mr-1" /> Teks
        </button>
        <button
          onClick={() =>
            activeMode === "image"
              ? null
              : handleSettingsChange("mode", "image")
          }
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeMode === "image"
              ? "bg-amber-600 text-white"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          }`}
        >
          <FileImage className="h-4 w-4 inline mr-1" /> Gambar
        </button>
      </div>

      {activeMode === "text" ? (
        <GeneratorForm onGenerationComplete={handleGenerationComplete} />
      ) : (
        <ImageUploadForm onGenerationComplete={handleGenerationComplete} />
      )}
    </TabsContent>

    <TabsContent value="edit" className="flex-1 overflow-y-auto p-4 sm:p-6">
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
          onSettingsChange={handleSettingsChange as any}
        />
      )}
    </TabsContent>
  </Tabs>
);

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
  const [progressStatus] = useState<ExportProgressStatus>("idle");

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

  const handleSettingsChange: StudioSettingsHandler = (key, value) => {
    if (key === "mode") {
      setActiveMode(value as "text" | "image");
      return;
    }

    setEditorSettings((prev) => ({
      ...prev,
      [key as keyof EditorSettings]:
        value as EditorSettings[keyof EditorSettings],
    }));
  };

  const handleExport = async (rapportCm: RapportSize, format: ExportFormat) => {
    if (!selectedCandidate) {
      toast.error("Pilih kandidat terlebih dahulu!");
      return;
    }

    setIsExporting(true);
    setProgressValue(0);
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
        setExportProgress("");
      }, 2000);
    } catch (error) {
      console.error("Error saat ekspor:", error);

      setProgressValue(0);
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
        {/* Header - FIX: Bersihkan Navbar */}
        <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-4 px-4 lg:px-8">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/Batiku Only.png"
                alt="Batiku Logo"
                width={120}
                height={50}
                className="transition-transform group-hover:scale-105"
                style={{ height: "auto" }}
              />
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {selectedCandidate && (
                  <div className="ml-2 px-2 py-1 rounded-full bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-950 dark:to-amber-900">
                    <span className="text-xs font-medium text-amber-800 dark:text-amber-200 truncate">
                      Kandidat #{selectedCandidate.idx}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons: Hanya Ekspor di Mobile/Tablet */}
            <div className="flex items-center gap-2">
              {/* Desktop Actions (Hidden on mobile) */}
              <div className="hidden lg:flex items-center gap-2">
                {selectedCandidate && (
                  <Wastra3DViewer
                    imageUrl={selectedCandidate.imageUrl}
                    disabled={!selectedCandidate}
                    isMenuMode={false} // Tampilan full button
                  />
                )}
                <ExportHistory />
                <ExportDialog
                  disabled={!selectedCandidate}
                  isExporting={isExporting}
                  exportProgress={exportProgress}
                  onExport={handleExport}
                  className="h-10 px-4"
                />
              </div>

              {/* Export Dialog (Selalu tampil, ukuran minimalis di mobile) */}
              <ExportDialog
                disabled={!selectedCandidate}
                isExporting={isExporting}
                exportProgress={exportProgress}
                onExport={handleExport}
                className="h-9 px-3 text-sm lg:hidden"
              />
            </div>
          </div>
        </header>

        {/* FIX: Mengembalikan layout responsif yang benar */}
        <div className="flex flex-1 flex-col lg:flex-row overflow-y-auto">
          {/* Sidebar Kiri - Mode Selector dengan Amber Theme */}
          <aside className="hidden lg:flex flex-col w-20 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
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

          {/* Main Content & Canvas Area */}
          <div className="flex-1 flex flex-col">
            {/* Main Canvas - Modern Design */}
            <main className="flex-1 flex items-center justify-center p-6 lg:p-10">
              <div className="w-full max-w-3xl">
                <div className="aspect-square rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden relative">
                  {selectedCandidate ? (
                    <div className="w-full h-full relative grouppm">
                      <div className="absolute top-4 right-4 z-20 transition-opacity duration-200">
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
                        Mulai dengan mendeskripsikan motif batik impian Anda
                        atau upload gambar referensi
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </main>

            {/* Bottom Panel: Tampil hanya di Mobile/Tablet (< lg) */}
            <div className="lg:hidden w-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
              <RightPanelContent
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                activeMode={activeMode}
                selectedCandidate={selectedCandidate}
                editorSettings={editorSettings}
                handleGenerationComplete={handleGenerationComplete}
                handleSettingsChange={handleSettingsChange}
              />
            </div>
          </div>

          {/* Right Sidebar - Clean Editor Panel */}
          <aside className="hidden lg:flex flex-col w-96 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <RightPanelContent
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              activeMode={activeMode}
              selectedCandidate={selectedCandidate}
              editorSettings={editorSettings}
              handleGenerationComplete={handleGenerationComplete}
              handleSettingsChange={handleSettingsChange}
            />
          </aside>
        </div>
      </div>

      {selectedCandidate && (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm border-t border-zinc-200 dark:border-zinc-800 shadow-2xl">
          <div className="px-4 py-3">
            {selectedCandidate ? (
              <div className="flex items-center justify-center gap-3 max-w-sm mx-auto">
                <Wastra3DViewer
                  imageUrl={selectedCandidate.imageUrl}
                  disabled={false}
                  isMenuMode={true}
                />

                <ExportHistory variant="outline" size="sm" showBadge={true} />
              </div>
            ) : (
              <div className="flex items-center justify-center max-w-sm mx-auto">
                <ExportHistory
                  variant="outline"
                  size="default"
                  showBadge={true}
                ></ExportHistory>
              </div>
            )}
          </div>
        </div>
      )}
    </TooltipProvider>
  );
}
