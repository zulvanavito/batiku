"use client";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Download, FileImage, Home, Palette, Type, Wand2 } from "lucide-react";
import Link from "next/link";

export default function StudioPage() {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="min-h-screen w-full bg-zinc-300 text-zinc-900 flex flex-col">
        {/* Header Utama */}
        <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-white backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 shadow">
          <Link href="/" className="font-bold text-lg">
            Batiku
          </Link>
          <div className="flex-1">
            <h1 className="font-semibold text-sm text-zinc-600">/ Studio</h1>
          </div>
          <Button size="sm" className="hover:cursor-pointer">
            <Download className=" w-4 h-4 mr-2" />
            Ekspor Hasil
          </Button>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* 1. Toolbar Kiri */}
          <aside className="inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-white backdrop-blur-sm sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/">
                    <IconButton
                      variant="ghost"
                      className="text-zinc-400 hover:text-zinc-900"
                    >
                      <Home className="h-5 w-5" />
                    </IconButton>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Beranda</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton variant="secondary">
                    <Type className="h-5 w-5" />
                  </IconButton>
                </TooltipTrigger>
                <TooltipContent side="right">Mode Teks</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton
                    variant="ghost"
                    className="text-zinc-400 hover:text-zinc-900"
                  >
                    <FileImage className="h-5 w-5" />
                  </IconButton>
                </TooltipTrigger>
                <TooltipContent side="right">Mode Gambar</TooltipContent>
              </Tooltip>
            </nav>
          </aside>

          {/* 2. Area Kerja Tengah (Canvas) */}
          <main className="flex-1 flex items-center justify-center p-4 lg:p-8">
            <div className="w-full max-w-2xl aspect-square bg-white shadow rounded-lg flex items-center justify-center">
              <p className="text-zinc-600">
                Pratinjau motif akan muncul di sini
              </p>
            </div>
          </main>

          {/* 3. Panel Properti Kanan */}
          <aside className="hidden lg:flex lg:w-80 flex-col border-l bg-white backdrop-blur-sm p-4 shadow">
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

              {/* Tab Content untuk Generate */}
              <TabsContent
                value="generate"
                className="flex-1 overflow-y-auto mt-4 pr-2"
              >
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label>Deskripsi Motif (Prompt)</Label>
                    <Textarea
                      placeholder="Contoh: Parang rusak sogan dengan isen cecek"
                      className="min-h-[120px] bg-white shadow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Keluarga Motif</Label>
                    <Select>
                      <SelectTrigger className="bg-white border-zinc-300 shadow hover:cursor-pointer">
                        <SelectValue placeholder="Pilih keluarga" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          className="hover:cursor-pointer"
                          value="kawung"
                        >
                          Kawung
                        </SelectItem>
                        <SelectItem
                          className="hover:cursor-pointer"
                          value="parang"
                        >
                          Parang
                        </SelectItem>
                        <SelectItem
                          className="hover:cursor-pointer"
                          value="ceplok"
                        >
                          Ceplok
                        </SelectItem>
                        <SelectItem
                          className="hover:cursor-pointer"
                          value="semen"
                        >
                          Semen
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* BARU: Menambahkan kembali Gaya dan Palet Warna */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Gaya</Label>
                      <Select>
                        <SelectTrigger className="bg-white border-zinc-300 shadow hover:cursor-pointer">
                          <SelectValue placeholder="Pilih gaya" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            className="hover:cursor-pointer"
                            value="tulis"
                          >
                            Tulis
                          </SelectItem>
                          <SelectItem
                            className="hover:cursor-pointer"
                            value="cap"
                          >
                            Cap
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Palet Warna</Label>
                      <Select>
                        <SelectTrigger className="bg-white border-zinc-300 shadow hover:cursor-pointer">
                          <SelectValue placeholder="Pilih palet" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            className="hover:cursor-pointer"
                            value="sogan"
                          >
                            Sogan Klasik
                          </SelectItem>
                          <SelectItem
                            className="hover:cursor-pointer"
                            value="indigo"
                          >
                            Indigo-Putih
                          </SelectItem>
                          <SelectItem
                            className="hover:cursor-pointer"
                            value="pesisir"
                          >
                            Pesisir Cerah
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {/* --- Akhir bagian baru --- */}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full hover:cursor-pointer"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Motif
                  </Button>
                </form>
              </TabsContent>

              {/* Tab Content untuk Editor */}
              <TabsContent
                value="edit"
                className="flex-1 overflow-y-auto mt-4 pr-2"
              >
                <div className="space-y-6">
                  <Card className="bg-white border-zinc-300 shadow">
                    <CardContent className="pt-6 space-y-4">
                      <div className="space-y-2">
                        <Label>Repeat</Label>
                        <Select>
                          <SelectTrigger className="bg-white border-zinc-300 shadow hover:cursor-pointer">
                            <SelectValue
                              className="hover:cursor-pointer"
                              placeholder="Square"
                            />
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
                          <SelectTrigger className="bg-white border-zinc-300 shadow hover:cursor-pointer ">
                            <SelectValue
                              className="hover:cursor-pointer"
                              placeholder="4-Point"
                            />
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
