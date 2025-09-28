"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"; // Kita akan butuh ini, mari kita tambahkan
import { Label } from "@/components/ui/label";
import { Paintbrush, Wand2 } from "lucide-react";

export function GeneratorForm() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Paintbrush className="w-5 h-5" />
          Panel Kontrol
        </CardTitle>
        <CardDescription>
          Atur parameter di bawah ini untuk menghasilkan motif batik.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          {/* Input: Prompt Teks */}
          <div className="space-y-2">
            <Label htmlFor="prompt">Deskripsi Motif (Prompt)</Label>
            <Textarea
              id="prompt"
              placeholder="Contoh: Batik Kawung sogan klasik dengan isen cecek"
              className="min-h-[100px]"
            />
          </div>

          {/* Input: Keluarga Motif */}
          <div className="space-y-2">
            <Label htmlFor="family">Keluarga Motif</Label>
            <Select name="family">
              <SelectTrigger id="family">
                <SelectValue placeholder="Pilih keluarga motif" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kawung">Kawung</SelectItem>
                <SelectItem value="parang">Parang/Lereng</SelectItem>
                <SelectItem value="ceplok">Ceplok</SelectItem>
                <SelectItem value="semen">Semen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Input: Gaya & Palet dalam satu baris */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="style">Gaya</Label>
              <Select name="style">
                <SelectTrigger id="style">
                  <SelectValue placeholder="Pilih gaya" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tulis">Tulis</SelectItem>
                  <SelectItem value="cap">Cap</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="palette">Palet Warna</Label>
              <Select name="palette">
                <SelectTrigger id="palette">
                  <SelectValue placeholder="Pilih palet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sogan">Sogan Klasik</SelectItem>
                  <SelectItem value="indigo">Indigo-Putih</SelectItem>
                  <SelectItem value="pesisir">Pesisir Cerah</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tombol Generate */}
          <Button type="submit" size="lg" className="w-full">
            <Wand2 className="w-4 h-4 mr-2" />
            Generate Motif
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
