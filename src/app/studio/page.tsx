// src/app/studio/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, Paintbrush } from "lucide-react";

export default function StudioPage() {
  return (
    <div className="min-h-screen bg-zinc-100">
      {/* Header Studio */}
      <header className="sticky top-0 z-40 w-full border-b bg-white">
        <div className="container flex h-16 items-center space-x-4">
          <Link href="/" className="font-bold">
            Batiku
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Studio</h1>
          </div>
          <Button>Ekspor</Button>
        </div>
      </header>

      {/* Layout Utama Studio */}
      <div className="container grid lg:grid-cols-12 gap-8 py-8">
        {/* Kolom Kiri: Panel Kontrol */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="sticky top-20 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paintbrush className="w-5 h-5" />
                  Panel Kontrol
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600">
                  Form untuk input teks, upload gambar, dan pengaturan parameter
                  akan ada di sini.
                </p>
                {/* FORM GENERATOR AKAN DITEMPATKAN DI SINI */}
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Kolom Kanan: Area Hasil & Editor */}
        <main className="lg:col-span-8 xl:col-span-9">
          <div className="bg-white rounded-lg border shadow-sm min-h-[600px] p-6">
            <h2 className="text-xl font-semibold mb-4">Hasil Generasi</h2>
            <div className="w-full h-96 bg-zinc-200 rounded-md flex items-center justify-center">
              <p className="text-zinc-500">
                Gambar hasil generasi batik akan muncul di sini.
              </p>
            </div>
            {/* KONTROL EDITOR AKAN DITEMPATKAN DI SINI */}
          </div>
        </main>
      </div>
    </div>
  );
}
