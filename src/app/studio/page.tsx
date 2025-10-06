"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileImage, Home, Palette, Type, Wand2, X } from "lucide-react";
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
import {
  MockupToolbar,
  type MockupMode,
} from "@/components/studio/mockup-toolbar";
import { ExportDialog } from "@/components/studio/export-dialog";
import { ExportHistory } from "@/components/studio/export-history";
import { ExportProgress } from "@/components/studio/export-progress";

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
  // State management
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
  const [mockupMode, setMockupMode] = useState<MockupMode>("tile");

  // Export states
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<string>("");
  const [progressValue, setProgressValue] = useState(0);
  const [progressStatus, setProgressStatus] =
    useState<ExportProgressStatus>("idle");

  // Handlers
  const handleGenerationComplete = (results: Candidate[]) => {
    setCandidates(results);
    setSelectedCandidate(null);
    setActiveTab("generate");
  };

  const handleSelectCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setMockupMode("tile");
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

  // 🔥 HANDLER EKSPOR DENGAN PROGRESS BAR & FIX BUG NaN
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
      // Step 1: Process gambar dengan canvas
      setProgressValue(5);
      setExportProgress("Memproses efek editor...");

      const targetPx = rapportCm === 20 ? 2362 : 2953;

      const { processImageWithSettings } = await import(
        "@/lib/canvas-processor"
      );

      const processedBlob = await processImageWithSettings({
        imageUrl: selectedCandidate.imageUrl,
        settings: editorSettings,
        targetSize: targetPx,
      });

      console.log("Canvas processing done. Blob size:", processedBlob.size);

      // Convert blob to base64
      const reader = new FileReader();
      const processedImageBase64 = await new Promise<string>(
        (resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(processedBlob);
        }
      );

      // Step 2: Kirim ke API
      setProgressValue(10);
      setExportProgress("Mengunggah ke server...");

      const response = await fetch("/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: selectedCandidate.imageUrl,
          processedImageBase64, // Kirim gambar yang sudah diproses
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

      {/* Progress Bar Floating */}
      <ExportProgress
        isVisible={progressValue > 0}
        progress={progressValue}
        status={progressStatus}
        message={exportProgress}
      />

      <div className="min-h-screen w-full bg-zinc-100 dark:bg-zinc-900 text-foreground flex flex-col">
        {/* Header dengan tombol ekspor & history */}
        <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-white dark:bg-black dark:border-zinc-800/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/Batiku Only.png"
              alt="Batiku Logo"
              width={80}
              height={20}
              style={{ height: "auto" }}
            />
          </Link>
          <div className="flex-1">
            <h1 className="font-semibold text-sm text-zinc-500 dark:text-zinc-400">
              / Studio
            </h1>
          </div>

          {/* Tombol History & Export */}
          <div className="flex items-center gap-2">
            <ExportHistory />
            <ExportDialog
              disabled={!selectedCandidate}
              isExporting={isExporting}
              exportProgress={exportProgress}
              onExport={handleExport}
            />
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Kiri */}
          <aside className="inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-white dark:bg-black sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/">
                    <IconButton
                      variant="ghost"
                      className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    >
                      <Home className="h-5 w-5" />
                    </IconButton>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Beranda</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton
                    variant={activeMode === "text" ? "secondary" : "ghost"}
                    onClick={() => setActiveMode("text")}
                    className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  >
                    <Type className="h-5 w-5" />
                  </IconButton>
                </TooltipTrigger>
                <TooltipContent side="right">Mode Teks</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton
                    variant={activeMode === "image" ? "secondary" : "ghost"}
                    onClick={() => setActiveMode("image")}
                    className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  >
                    <FileImage className="h-5 w-5" />
                  </IconButton>
                </TooltipTrigger>
                <TooltipContent side="right">Mode Gambar</TooltipContent>
              </Tooltip>
            </nav>
          </aside>

          {/* Main Canvas Area */}
          <main className="flex-1 flex items-center justify-center p-4 lg:p-8 relative">
            <div className="w-full max-w-2xl aspect-square bg-white dark:bg-black rounded-lg border dark:border-zinc-200 flex items-center justify-center p-4 overflow-hidden">
              {selectedCandidate ? (
                <div className="w-full h-full relative">
                  <div className="absolute top-0 right-0 p-2 z-20">
                    <Button variant="ghost" size="sm" onClick={clearSelection}>
                      <X className="w-4 h-4 mr-2" /> Batal Pilih
                    </Button>
                  </div>

                  {/* Mockup Shirt */}
                  {mockupMode === "shirt" && (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg viewBox="0 0 320 320" className="w-full h-full">
                        <defs>
                          <pattern
                            id="batikPattern"
                            patternUnits="userSpaceOnUse"
                            width="150"
                            height="150"
                          >
                            <image
                              href={selectedCandidate.imageUrl}
                              x="0"
                              y="0"
                              width="150"
                              height="150"
                            />
                          </pattern>
                        </defs>
                        <path
                          fill="url(#batikPattern)"
                          d="M106.3,32.4c-4.7-0.1-8.5,3.7-8.6,8.4V62c0,0-15.3,4.3-19.6,12.7c-4.3,8.4,1.1,16.8-1.1,23.3c-2.2,6.5-12.8,12.7-12.8,12.7l-47,38.2L16,280.4h288l-1.3-131.5l-47-38.2c0,0-10.7-6.2-12.8-12.7c-2.2-6.5,3.2-14.9-1.1-23.3c-4.3-8.4-19.6-12.7-19.6-12.7V40.8c-0.1-4.7-3.9-8.5-8.6-8.4H106.3z"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Mockup Fabric */}
                  {mockupMode === "fabric" && (
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundImage: `url(${selectedCandidate.imageUrl})`,
                        backgroundSize: "150px 150px",
                      }}
                    />
                  )}

                  {/* Mockup Single Tile */}
                  {mockupMode === "tile" && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2/3 h-2/3 relative">
                        <Image
                          src={selectedCandidate.imageUrl}
                          alt="Pratinjau Ubin"
                          layout="fill"
                          objectFit="contain"
                          unoptimized
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : candidates.length > 0 ? (
                <ResultsDisplay
                  candidates={candidates}
                  onSelectCandidate={handleSelectCandidate}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-zinc-500 dark:text-zinc-600">
                    Hasil generasi akan muncul di sini
                  </p>
                </div>
              )}
            </div>

            {/* Mockup Toolbar */}
            {selectedCandidate && (
              <MockupToolbar
                activeMode={mockupMode}
                onModeChange={setMockupMode}
              />
            )}
          </main>

          {/* Right Sidebar - Generator & Editor */}
          <aside className="hidden lg:flex lg:w-80 flex-col border-l bg-white dark:bg-black p-4">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex flex-col h-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="generate">
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate
                </TabsTrigger>
                <TabsTrigger value="edit">
                  <Palette className="w-4 h-4 mr-2" />
                  Editor
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="generate"
                className="flex-1 overflow-y-auto mt-4 pr-2"
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

              <TabsContent
                value="edit"
                className="flex-1 overflow-y-auto mt-4 pr-2"
              >
                {!selectedCandidate ? (
                  <div className="text-center text-sm text-zinc-500 pt-10">
                    Pilih salah satu kandidat untuk mulai mengedit.
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
