"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { GeneratorForm } from "@/components/studio/generator-form";
import { ImageUploadForm } from "@/components/studio/image-upload-form";
import { ResultsDisplay } from "@/components/studio/results-display";
import { toast, Toaster } from "sonner";

// Definisikan tipe untuk kandidat
type Candidate = {
  s3KeyPng: string;
  idx: number;
};

export default function StudioPage() {
  const [activeMode, setActiveMode] = useState<"text" | "image">("text");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("generate");
  const [isExporting] = useState(false);

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

  const handleExport = () => {
    if (!selectedCandidate) {
      toast.error("Silakan pilih salah satu kandidat terlebih dahulu.");
      return;
    }
    const exportPromise = fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ s3KeyPng: selectedCandidate.s3KeyPng }),
    }).then(async (response) => {
      if (!response.ok) throw new Error("Gagal memulai proses ekspor.");
      const result = await response.json();
      window.open(result.downloadUrl, "_blank");
      return result;
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
          {/* ====================================================== */}
          {/* ========= INI ADALAH KODE TOOLBAR YANG HILANG ========= */}
          {/* ====================================================== */}
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
            <div className="w-full max-w-2xl aspect-square bg-white dark:bg-black rounded-lg border dark:border-zinc-200p-4">
              {selectedCandidate ? (
                <div className="w-full h-full flex flex-col items-center justify-center relative">
                  <div className="absolute top-0 right-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="m-5"
                      onClick={clearSelection}
                    >
                      <X className="w-4 h-4 mr-2" /> Batal Pilih
                    </Button>
                  </div>
                  <div className="w-2/3 h-2/3 bg-zinc-100 dark:bg-zinc-900 rounded-md flex items-center justify-center">
                    <p className="text-zinc-500">
                      Pratinjau Besar Kandidat #{selectedCandidate.idx}
                    </p>
                  </div>
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
                  <ImageUploadForm />
                )}
              </TabsContent>

              <TabsContent
                value="edit"
                className="flex-1 overflow-y-auto mt-4 pr-2"
              >
                <div className="space-y-6">
                  {!selectedCandidate ? (
                    <div className="text-center text-sm text-zinc-500 pt-10">
                      Pilih salah satu kandidat dari kanvas untuk mulai
                      mengedit.
                    </div>
                  ) : (
                    <Card className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                      <CardContent className="pt-6 space-y-4">
                        <p className="text-sm font-semibold">
                          Mengedit Kandidat #{selectedCandidate.idx}
                        </p>
                        <div className="space-y-2">
                          <Label>Repeat</Label>
                          <Select defaultValue="square">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="square">Square</SelectItem>
                              <SelectItem value="half-drop">
                                Half-Drop
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Simetri</Label>
                          <Select defaultValue="4">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2">2-Point</SelectItem>
                              <SelectItem value="4">4-Point</SelectItem>
                              <SelectItem value="8">8-Point</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </aside>
        </div>
      </div>
    </TooltipProvider>
  );
}
