import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Zap, Users, Feather, Palette, Download } from "lucide-react"; // Import ikon baru

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg.jpg"
          alt="Latar belakang motif batik"
          fill
          style={{ objectFit: "cover" }}
          className="opacity-20 dark:opacity-10"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />
      </div>

      <div className="relative z-10 flex flex-col mt-3">
        <header className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-foreground">
            Batik<span className="text-primary">u</span>
          </div>
          <Button asChild>
            <Link href="/generate">Mulai Berkreasi</Link>
          </Button>
        </header>

        <main className="flex-1 flex items-center min-h-screen -mt-[72px]">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-foreground mb-4 animate-fade-in-down">
              Batiku: Tradisi yang Hidup di Era Digital
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground mb-8 animate-fade-in-up [animation-delay:200ms]">
              Platform AI untuk perajin, desainer, dan seniman dalam menciptakan
              motif etnik khas nusantara dari ide sederhana menjadi sebuah karya
              visual yang unik.
            </p>
            <div className="animate-fade-in-up [animation-delay:400ms]">
              <Button size="lg" asChild>
                <Link href="/generate">Ciptakan Motif Pertamamu ✨</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>

      <div className="relative z-10 bg-background">
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold">
                Semudah Menuliskan Ide
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Kami merancang Batiku agar intuitif dan mudah digunakan. Cukup
                tiga langkah sederhana untuk mewujudkan kreasimu.
              </p>
            </div>
            <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6 border rounded-lg bg-card/30">
                <div className="flex justify-center items-center mb-4 bg-primary/10 text-primary size-12 rounded-full mx-auto">
                  <Feather className="size-6" />
                </div>
                <h3 className="text-xl font-semibold">1. Tuliskan Ide</h3>
                <p className="mt-2 text-muted-foreground">
                  Tuangkan imajinasimu ke dalam kata-kata. Semakin deskriptif,
                  semakin unik hasilnya.
                </p>
              </div>
              <div className="p-6 border rounded-lg bg-card/30">
                <div className="flex justify-center items-center mb-4 bg-primary/10 text-primary size-12 rounded-full mx-auto">
                  <Sparkles className="size-6" />
                </div>
                <h3 className="text-xl font-semibold">
                  2. Biarkan AI Berkreasi
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Teknologi Generative AI kami akan mengubah deskripsimu menjadi
                  beberapa variasi motif visual.
                </p>
              </div>
              <div className="p-6 border rounded-lg bg-card/30">
                <div className="flex justify-center items-center mb-4 bg-primary/10 text-primary size-12 rounded-full mx-auto">
                  <Download className="size-6" />
                </div>
                <h3 className="text-xl font-semibold">3. Unduh & Gunakan</h3>
                <p className="mt-2 text-muted-foreground">
                  Simpan motif favoritmu ke galeri atau unduh dalam resolusi
                  tinggi untuk proyek desainmu.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section: "Untuk Siapa Batiku?" */}
        <section className="py-20 md:py-28 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold">
                Partner Kreatif untuk Generasi Baru
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Batiku dirancang untuk memberdayakan berbagai talenta di
                industri kreatif Indonesia.
              </p>
            </div>
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold">Perajin Batik & Kriya</h3>
                <p className="mt-2 text-muted-foreground">
                  Temukan inspirasi baru dan percepat proses eksplorasi motif
                  tanpa meninggalkan akar tradisi.
                </p>
              </div>
              <div className="text-center">
                <Palette className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold">Desainer Fashion</h3>
                <p className="mt-2 text-muted-foreground">
                  Eksplorasi motif etnik modern untuk koleksi busana yang unik
                  dan bercerita.
                </p>
              </div>
              <div className="text-center">
                <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold">
                  Seniman & Mahasiswa Seni
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Jadikan AI sebagai asisten kreatif untuk proyek seni,
                  penelitian, dan tugas akademis.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Final CTA */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
              Siap Mengubah Ide Menjadi Karya?
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground">
              Bergabunglah dengan gerakan untuk melestarikan dan merevolusi
              warisan budaya Indonesia.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild className="h-12 px-8 text-base">
                <Link href="/generate">Mulai Berkreasi Sekarang</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 sm:px-6 py-6 text-center border-t">
          <p className="text-sm text-muted-foreground">
            Menjembatani tradisi & teknologi untuk masa depan warisan budaya
            Indonesia.
          </p>
        </footer>
      </div>
    </div>
  );
}
