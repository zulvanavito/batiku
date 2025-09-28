"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Paintbrush, Wand2, LoaderCircle } from "lucide-react";

// Definisikan tipe untuk data form
type FormData = {
  prompt: string;
  family: string;
  style: string;
  palette: string;
};

// Definisikan tipe untuk kandidat
type Candidate = {
  s3KeyPng: string;
  idx: number;
};

// Definisikan props untuk komponen, termasuk fungsi callback
type GeneratorFormProps = {
  onGenerationComplete: (candidates: Candidate[]) => void;
};

export function GeneratorForm({ onGenerationComplete }: GeneratorFormProps) {
  const [formData, setFormData] = useState<FormData>({
    prompt: "",
    family: "",
    style: "",
    palette: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    console.log("Mengirim data:", formData);

    try {
      const response = await fetch("/api/generate-batik", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Respons diterima dari API:", result);

      // Panggil fungsi callback dari parent dengan data hasil
      onGenerationComplete(result.candidates);
    } catch (error) {
      console.error("Gagal mengirim data ke API:", error);
      alert("Terjadi kesalahan saat generate. Coba lagi."); // Beri feedback error ke user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-none border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Paintbrush className="w-5 h-5" />
          Generate via Teks
        </CardTitle>
        <CardDescription>
          Jelaskan motif yang Anda inginkan secara detail.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt">Deskripsi Motif (Prompt)</Label>
            <Textarea
              id="prompt"
              placeholder="Contoh: Batik Kawung sogan klasik dengan isen cecek"
              className="min-h-[120px] bg-zinc-50 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700"
              value={formData.prompt}
              onChange={(e) => handleInputChange("prompt", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Keluarga Motif</Label>
            <Select
              name="family"
              onValueChange={(value) => handleInputChange("family", value)}
              required
            >
              <SelectTrigger className="bg-zinc-50 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700">
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Gaya</Label>
              <Select
                name="style"
                onValueChange={(value) => handleInputChange("style", value)}
                required
              >
                <SelectTrigger className="bg-zinc-50 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700">
                  <SelectValue placeholder="Pilih gaya" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tulis">Tulis</SelectItem>
                  <SelectItem value="cap">Cap</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Palet Warna</Label>
              <Select
                name="palette"
                onValueChange={(value) => handleInputChange("palette", value)}
                required
              >
                <SelectTrigger className="bg-zinc-50 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700">
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

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "Memproses..." : "Generate Motif"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
