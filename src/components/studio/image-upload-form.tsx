"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FileUp, Wand2, X, LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useLoadingMessage } from "@/hooks/useLoadingMessage";

type Candidate = {
  imageUrl: string;
  idx: number;
};

type ImageUploadFormProps = {
  onGenerationComplete: (candidates: Candidate[]) => void;
};

export function ImageUploadForm({
  onGenerationComplete,
}: ImageUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const loadingMessage = useLoadingMessage(isLoading);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (selectedFile: File | undefined) => {
    if (
      selectedFile &&
      (selectedFile.type === "image/png" || selectedFile.type === "image/jpeg")
    ) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      alert("Silakan pilih file gambar (PNG atau JPG).");
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    processFile(event.target.files?.[0]);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) =>
    event.preventDefault();
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    processFile(event.dataTransfer.files?.[0]);
  };

  const clearFile = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset input file
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("mode", "image");

    try {
      const response = await fetch("/api/generate-variation", {
        method: "POST",
        body: formData,
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      onGenerationComplete(result.candidates);
    } catch (error) {
      console.error("Gagal mengirim gambar ke API:", error);
      alert("Terjadi kesalahan saat generate variasi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-none border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileUp className="w-5 h-5" />
          Referensi Gambar
        </CardTitle>
        <CardDescription>
          Unggah sketsa atau gambar referensi milik Anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="image-upload">File Gambar (PNG, JPG)</Label>

            {previewUrl ? (
              <div className="w-full aspect-square relative rounded-lg overflow-hidden border-2 border-primary">
                <Image
                  src={previewUrl}
                  alt="Pratinjau Gambar"
                  layout="fill"
                  objectFit="contain"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={clearFile}
                  type="button" // Penting agar tidak men-submit form
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className="w-full h-40 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <FileUp className="w-8 h-8 text-zinc-400 dark:text-zinc-600 mb-2" />
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Tarik & lepas gambar, atau klik di sini
                </p>
                <input
                  id="image-upload"
                  type="file"
                  ref={fileInputRef}
                  className="sr-only"
                  accept="image/png, image/jpeg"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!file || isLoading}
          >
            {isLoading ? (
              <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "Memproses..." : "Generate Motif"}
          </Button>
          {isLoading && (
            <p className="text-center text-xs text-muted-foreground mt-2 animate-in fade-in">
              {loadingMessage}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
