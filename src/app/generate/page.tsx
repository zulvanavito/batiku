import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="font-sans flex flex-col items-center min-h-screen p-4 sm:p-8 bg-background">
      <header className="w-full max-w-4xl flex justify-center py-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          Batik<span className="text-primary">u</span>
        </h1>
      </header>
      <main className="flex flex-col gap-8 row-start-2 items-center w-full max-w-4xl flex-1">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tighter">
            Tradisi yang Hidup di Era Digital
          </h2>
          <p className="text-muted-foreground sm:text-lg">
            Ciptakan motif etnik khas nusantara dengan kekuatan AI. Cukup
            tuliskan idemu.
          </p>
        </div>

        {/* Input Form untuk Generate Motif */}
        <div className="w-full sm:max-w-2xl flex flex-col sm:flex-row items-center gap-2">
          <Input
            type="text"
            placeholder="Contoh: 'motif naga dengan sentuhan modern dan warna biru'"
            className="flex-1"
          />
          <Button size="lg" className="w-full sm:w-auto">
            Generate Motif
          </Button>
        </div>

        {/* Galeri Hasil Generate */}
        <div className="w-full bg-card/50 rounded-lg border p-4 mt-4">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Galeri Motif
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Placeholder untuk gambar yang akan digenerate */}
            <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Motif 1</span>
            </div>
            <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Motif 2</span>
            </div>
            <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Motif 3</span>
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full max-w-4xl text-center py-4">
        <p className="text-xs text-muted-foreground">
          Dibuat untuk kompetisi dengan 🖤 oleh Visioner
        </p>
      </footer>
    </div>
  );
}
