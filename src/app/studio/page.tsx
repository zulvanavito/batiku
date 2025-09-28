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
import { Download, FileImage, Home, Palette, Type, Wand2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { GeneratorForm } from "@/components/studio/generator-form";
import { ImageUploadForm } from "@/components/studio/image-upload-form";

export default function StudioPage() {
  const [activeMode, setActiveMode] = useState<"text" | "image">("text");

  return (
    <TooltipProvider delayDuration={0}>
      <div className="min-h-screen w-full bg-zinc-100 dark:bg-zinc-900 text-foreground flex flex-col">
        {/* Header Utama */}
        <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-white content-between dark:bg-black dark:border-zinc-800/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/Batiku Only.png"
              alt="Batiku Logo"
              width={150}
              height={20}
            />
          </Link>
          <div className="flex-1"></div>
          <Button size="sm" className="hover:cursor-pointer">
            <Download className="w-4 h-4 mr-2" />
            Ekspor Hasil
          </Button>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* ... Toolbar Kiri ... */}
          <aside className="inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-white dark:bg-black sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/">
                    <IconButton
                      variant="ghost"
                      className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:cursor-pointer"
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
                    className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:cursor-pointer"
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
                    className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:cursor-pointer"
                  >
                    <FileImage className="h-5 w-5" />
                  </IconButton>
                </TooltipTrigger>
                <TooltipContent side="right">Mode Gambar</TooltipContent>
              </Tooltip>
            </nav>
          </aside>

          {/*  Canvas Tengah */}
          <main className="flex-1 flex items-center justify-center p-4 lg:p-8">
            <div className="w-full max-w-2xl aspect-square bg-white dark:bg-black rounded-lg border dark:border-zinc-200 flex items-center justify-center">
              <p className="text-zinc-500 dark:text-zinc-600">
                Pratinjau motif akan muncul di sini
              </p>
            </div>
          </main>

          {/* 3. Panel Properti Kanan */}
          <aside className="hidden lg:flex lg:w-80 flex-col border-l bg-white dark:bg-black p-4">
            <Tabs defaultValue="generate" className="flex flex-col h-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="generate" className="hover:cursor-pointer">
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate
                </TabsTrigger>
                <TabsTrigger value="edit" className="hover:cursor-pointer">
                  <Palette className="w-4 h-4 mr-2" />
                  Editor
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="generate"
                className="flex-1 overflow-y-auto mt-4 pr-2"
              >
                {activeMode === "text" ? (
                  <GeneratorForm />
                ) : (
                  <ImageUploadForm />
                )}
              </TabsContent>

              <TabsContent
                value="edit"
                className="flex-1 overflow-y-auto mt-4 pr-2"
              >
                <div className="space-y-6">
                  <Card className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <CardContent className="pt-6 space-y-4">
                      <div className="space-y-2">
                        <Label>Repeat</Label>
                        <Select>
                          <SelectTrigger className="bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 hover:cursor-pointer">
                            <SelectValue placeholder="Square" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              className="hover:cursor-pointer"
                              value="square"
                            >
                              Square
                            </SelectItem>
                            <SelectItem
                              className="hover:cursor-pointer"
                              value="half-drop"
                            >
                              Half-Drop
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Simetri</Label>
                        <Select>
                          <SelectTrigger className="bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 hover:cursor-pointer">
                            <SelectValue placeholder="4-Point" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              className="hover:cursor-pointer"
                              value="2"
                            >
                              2-Point
                            </SelectItem>
                            <SelectItem
                              className="hover:cursor-pointer"
                              value="4"
                            >
                              4-Point
                            </SelectItem>
                            <SelectItem
                              className="hover:cursor-pointer"
                              value="8"
                            >
                              8-Point
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </aside>
        </div>
      </div>
    </TooltipProvider>
  );
}
