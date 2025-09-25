import { AppWindow, ShieldCheck, FileOutput, Palette } from "lucide-react";

const features = [
  {
    icon: <AppWindow className="w-6 h-6 text-white" />,
    title: "Seamless & Konsisten",
    description:
      "Kontrol penuh atas repeat (square/half-drop) dan simetri (2/4/8) untuk hasil yang presisi.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-white" />,
    title: "Rasa Batik Terjaga",
    description:
      "Validator gaya berbasis AI memastikan setiap karya tetap sesuai dengan kaidah motif batik tradisional.",
  },
  {
    icon: <FileOutput className="w-6 h-6 text-white" />,
    title: "Siap Produksi",
    description:
      "Ekspor file PNG resolusi tinggi dan SVG vektor yang bersih, siap untuk proses cetak maupun cap.",
  },
  {
    icon: <Palette className="w-6 h-6 text-white" />,
    title: "Kustomisasi Cerdas",
    description:
      "Atur palet warna, skala motif, dan template komposisi agar sesuai kebutuhan merek dan proses produksi.",
  },
];

export function Features() {
  return (
    <section
      id="fitur"
      className="w-full min-h-screen py-20 flex flex-col items-center justify-center"
    >
      <div className="text-center space-y-4 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-black">
          Alur Kerja yang Disederhanakan
        </h2>
        <p className="text-zinc-500 max-w-2xl mx-auto">
          Dari ide hingga file produksi, Batiku menyediakan semua yang Anda
          butuhkan dalam satu platform.
        </p>
      </div>

      {/* Grid 1→2→4 kolom, full center */}
      <div className="mt-12 w-full max-w-6xl px-4 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 place-items-center">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="w-full h-full p-8 rounded-xl bg-deep-ocean dark:bg-muted-teal border border-fresh-green/20 shadow-2xl
                       flex flex-col items-center text-center space-y-4"
          >
            <div className="w-12 h-12 rounded-lg bg-seafoam-mist/10 flex items-center justify-center">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-seafoam-mist">
              {feature.title}
            </h3>
            <p className="text-seafoam-mist/80">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
