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

type Candidate = {
  imageUrl: string;
  idx: number;
};

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

  // LOGIKA EKSPOR YANG BERMASALAH SUDAH DIHAPUS TOTAL

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
          <Button size="sm" disabled>
            Ekspor (Segera Hadir)
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

          <main className="flex-1 flex items-center justify-center p-4 lg:p-8 relative">
            <div className="w-full max-w-2xl aspect-square bg-white dark:bg-black rounded-lg border dark:border-zinc-200  flex items-center justify-center p-4 overflow-hidden">
              {selectedCandidate ? (
                <div className="w-full h-full relative">
                  <div className="absolute top-0 right-0 p-2 z-20">
                    <Button variant="ghost" size="sm" onClick={clearSelection}>
                      <X className="w-4 h-4 mr-2" /> Batal Pilih
                    </Button>
                  </div>
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
                  {mockupMode === "fabric" && (
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundImage: `url(${selectedCandidate.imageUrl})`,
                        backgroundSize: "150px 150px",
                      }}
                    />
                  )}
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
            {selectedCandidate && (
              <MockupToolbar
                activeMode={mockupMode}
                onModeChange={setMockupMode}
              />
            )}
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
