"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FileUp, Wand2 } from "lucide-react";

export function ImageUploadForm() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileUp className="w-5 h-5" />
          Referensi Gambar
        </CardTitle>
        <CardDescription>
          Unggah sketsa atau gambar referensi milik Anda.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="image-upload">File Gambar (PNG, JPG)</Label>
            <div className="w-full h-32 border-2 border-dashed border-zinc-300 rounded-lg flex flex-col items-center justify-center text-center">
                <FileUp className="w-8 h-8 text-zinc-400 mb-2 hover:cursor-pointer" />
                <p className="text-sm text-zinc-500">Tarik & lepas gambar di sini, atau klik untuk memilih file</p>
                {/* Input file ini disembunyikan dan akan dipicu oleh div di atasnya */}
                <input id="image-upload" type="file" className="sr-only" />
            </div>
        </div>

        <Button type="submit" size="lg" className="w-full hover:cursor-pointer">
            <Wand2 className="w-4 h-4 mr-2 " />
            Generate Variasi
        </Button>
      </CardContent>
    </Card>
  );
}