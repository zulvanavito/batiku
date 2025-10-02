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
import {
  Download,
  FileImage,
  Home,
  Palette,
  Type,
  Wand2,
  X,
  LoaderCircle,
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

// Definisikan tipe data untuk kandidat
type Candidate = {
  base64: string;
  idx: number;
};

export default function StudioPage() {
  // State management untuk seluruh halaman studio
  const [activeMode, setActiveMode] = useState<"text" | "image">("text");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("generate");
  const [isExporting, setIsExporting] = useState(false);
  const [editorSettings, setEditorSettings] = useState<EditorSettings>({
    repeat: "square",
    symmetry: "none",
    density: 50,
    thickness: 1.5,
  });

  // Handler saat proses 'generate' selesai
  const handleGenerationComplete = (results: Candidate[]) => {
    setCandidates(results);
    setSelectedCandidate(null);
    setActiveTab("generate");
  };

  // Handler saat pengguna memilih salah satu kandidat
  const handleSelectCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    toast.success(`Kandidat #${candidate.idx} dipilih!`);
    setActiveTab("edit");
  };

  // Handler untuk membatalkan pilihan kandidat
  const clearSelection = () => {
    setSelectedCandidate(null);
  };

  // Handler untuk mengubah pengaturan di editor panel
  const handleSettingsChange = <K extends keyof EditorSettings>(
    key: K,
    value: EditorSettings[K]
  ) => {
    setEditorSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Handler untuk tombol ekspor
  const handleExport = () => {
    if (!selectedCandidate) {
      toast.error("Silakan pilih salah satu kandidat terlebih dahulu.");
      return;
    }

    setIsExporting(true);
    const exportPromise = fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64: selectedCandidate.base64 }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Gagal memulai proses ekspor.");
        const result = await response.json();
        window.open(result.downloadUrl, "_blank");
        return result;
      })
      .finally(() => {
        setIsExporting(false);
      });

    toast.promise(exportPromise, {
      loading: "Memulai proses ekspor...",
      success: "Ekspor berhasil! File ZIP akan segera diunduh.",
      error: "Terjadi kesalahan saat mengekspor.",
    });
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen w-full bg-zinc-100 dark:bg-zinc-900 text-foreground flex flex-col">
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
          <Button
            size="sm"
            onClick={handleExport}
            disabled={!selectedCandidate || isExporting}
          >
            {isExporting ? (
              <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Ekspor
          </Button>
        </header>

        <div className="flex flex-1 overflow-hidden">
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

          <main className="flex-1 flex items-center justify-center p-4 lg:p-8">
            <div className="w-full max-w-2xl aspect-square bg-white dark:bg-black rounded-lg border dark:border-zinc-200 p-4">
              {selectedCandidate ? (
                <div className="w-full h-full flex flex-col items-center justify-center relative">
                  <div className="absolute top-0 right-0 p-2">
                    <Button variant="ghost" size="sm" onClick={clearSelection}>
                      <X className="w-4 h-4 mr-2" /> Batal Pilih
                    </Button>
                  </div>
                  <div className="w-2/3 h-2/3 bg-zinc-100 dark:bg-zinc-900 rounded-md flex items-center justify-center overflow-hidden">
                    <p
                      className={`text-zinc-500 transition-transform duration-300 
                      ${editorSettings.symmetry === "2" ? "scale-x-[-1]" : ""}
                      ${editorSettings.symmetry === "4" ? "rotate-90" : ""}
                      ${
                        editorSettings.symmetry === "8"
                          ? "rotate-180 scale-x-[-1]"
                          : ""
                      }
                    `}
                    >
                      Pratinjau #{selectedCandidate.idx}
                    </p>
                  </div>
                  <p className="text-xs text-zinc-500 mt-6">
                    Repeat: {editorSettings.repeat}, Simetri:{" "}
                    {editorSettings.symmetry}, Kepadatan:{" "}
                    {editorSettings.density}, Ketebalan:{" "}
                    {editorSettings.thickness}
                  </p>
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
          </main>

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
                    Pilih salah satu kandidat dari kanvas untuk mulai mengedit.
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
