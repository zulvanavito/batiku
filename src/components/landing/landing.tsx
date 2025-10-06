"use client";
import { useState, useEffect } from "react";
import {
  Sparkles,
  Palette,
  Download,
  Zap,
  ArrowRight,
  Check,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BatikuHomepage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: Sparkles,
      title: "Text-to-Image AI",
      description:
        "Deskripsikan motif batik impian Anda dengan kata-kata, AI akan menciptakan raport seamless berkualitas tinggi",
    },
    {
      icon: Palette,
      title: "Image-to-Image AI",
      description:
        "Upload sketsa tangan, foto batik, atau referensi gambar - AI akan transform menjadi motif batik yang siap produksi",
    },
    {
      icon: Download,
      title: "Editor Lengkap",
      description:
        "Kontrol penuh: repeat pattern, simetri, palet warna sogan/indigo, hingga kepadatan isèn tradisional",
    },
    {
      icon: Zap,
      title: "Ekspor Pro",
      description:
        "PNG 300 DPI & SVG siap produksi dengan validator gaya yang memastikan 'rasa batik' tetap authentic",
    },
  ];

  const batikImages = [
    { name: "Parang", src: "/parang.jpg" },
    { name: "Kawung", src: "/kawung.jpg" },
    { name: "Mega Mendung", src: "/megamendung.jpg" },
    { name: "Truntum", src: "/truntum.jpg" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Image
                src="/Batiku Only.png"
                alt="Batiku Logo"
                width={120}
                height={50}
                style={{ height: "auto" }}
              />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="#features"
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all hover:scale-105"
            >
              Fitur
            </a>
            <a
              href="#roadmap"
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all hover:scale-105"
            >
              Roadmap
            </a>
            <a
              href="/studio"
              className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
            >
              Mulai Berkarya
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div
              className="space-y-8"
              style={{
                transform: `translateY(${scrollY * 0.1}px)`,
                transition: "transform 0.1s ease-out",
              }}
            >
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-950 rounded-full text-amber-800 dark:text-amber-200 text-sm font-medium ${
                  isVisible ? "animate-fade-in-up" : "opacity-0"
                }`}
              >
                <Star className="w-4 h-4 fill-current animate-pulse-slow" />
                Powered by Amazon Bedrock AI
              </div>

              <h1
                className={`text-6xl lg:text-7xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight ${
                  isVisible
                    ? "animate-fade-in-up animation-delay-200"
                    : "opacity-0"
                }`}
              >
                Ciptakan
                <span className="block bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 bg-clip-text text-transparent">
                  Motif Batik
                </span>
                dalam Sekejap
              </h1>

              <p
                className={`text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed ${
                  isVisible
                    ? "animate-fade-in-up animation-delay-400"
                    : "opacity-0"
                }`}
              >
                Platform AI untuk perajin & desainer batik. Hasilkan raport
                motif seamless dari teks atau gambar, lengkap dengan editor
                profesional dan ekspor siap produksi.
              </p>

              <div
                className={`flex flex-wrap gap-4 ${
                  isVisible
                    ? "animate-fade-in-up animation-delay-600"
                    : "opacity-0"
                }`}
              >
                <a
                  href="/studio"
                  className="group px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-200 font-semibold flex items-center gap-2"
                >
                  Coba Gratis Sekarang
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#features"
                  className="px-8 py-4 border-2 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-full hover:border-amber-600 dark:hover:border-amber-600 hover:text-amber-600 hover:scale-105 transition-all duration-200 font-semibold"
                >
                  Pelajari Lebih Lanjut
                </a>
              </div>

              <div
                className={`flex items-center gap-8 pt-4 ${
                  isVisible
                    ? "animate-fade-in-up animation-delay-800"
                    : "opacity-0"
                }`}
              >
                <div className="text-center hover:scale-110 transition-transform cursor-pointer">
                  <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                    300
                  </div>
                  <div className="text-sm text-zinc-500">DPI Export</div>
                </div>
                <div className="w-px h-12 bg-zinc-200 dark:bg-zinc-800"></div>
                <div className="text-center hover:scale-110 transition-transform cursor-pointer">
                  <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                    4+
                  </div>
                  <div className="text-sm text-zinc-500">Keluarga Motif</div>
                </div>
                <div className="w-px h-12 bg-zinc-200 dark:bg-zinc-800"></div>
                <div className="text-center hover:scale-110 transition-transform cursor-pointer">
                  <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                    PNG
                  </div>
                  <div className="text-sm text-zinc-500">PNG Ready</div>
                </div>
              </div>
            </div>

            {/* Right Visual - Updated with Image Placeholders & Animations */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-amber-300 dark:from-amber-900/30 dark:to-amber-800/30 rounded-3xl blur-3xl opacity-30 animate-pulse-slow"></div>
              <div className="relative grid grid-cols-2 gap-4">
                {batikImages.map((batik, i) => (
                  <div
                    key={i}
                    className={`group aspect-square rounded-2xl hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl overflow-hidden relative ${
                      isVisible ? "animate-fade-in-up" : "opacity-0"
                    }`}
                    style={{
                      animationDelay: `${0.3 + i * 0.1}s`,
                      animationDuration: "0.8s",
                      transform: `translateY(${
                        scrollY * 0.05 * (i % 2 === 0 ? 1 : -1)
                      }px)`,
                    }}
                  >
                    <div>
                      <Image
                        src={batik.src}
                        alt={batik.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-white font-semibold text-sm drop-shadow-lg">
                        {batik.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400">
              Semua yang Anda butuhkan untuk menciptakan batik berkelas dunia
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="group p-8 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-amber-600 dark:hover:border-amber-600 transition-all duration-300 hover:shadow-xl cursor-pointer animate-fade-in-up hover:scale-105"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center mb-6 transform transition-all duration-300 ${
                    hoveredFeature === i ? "scale-110 rotate-12" : ""
                  }`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
                  {feature.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              Cara Kerja
            </h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400">
              Dari ide sampai produksi, hanya dalam 4 langkah
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Input",
                desc: "Tulis deskripsi atau upload gambar referensi",
              },
              {
                step: "02",
                title: "Generate",
                desc: "AI menghasilkan 3 kandidat motif seamless",
              },
              {
                step: "03",
                title: "Edit",
                desc: "Sesuaikan repeat, simetri & palet warna",
              },
              { step: "04", title: "Ekspor", desc: "Download PNG 300 DPI " },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center space-y-4 animate-fade-in-up hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white font-bold text-xl hover:rotate-12 transition-transform duration-300 animate-pulse-slow">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {item.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="py-20 px-6 bg-white dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              Roadmap
            </h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400">
              Kami terus berinovasi untuk Anda
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                version: "v1.0",
                status: "live",
                title: "MVP Launch",
                features: [
                  "Text-to-Image AI",
                  "Image-to-Image AI",
                  "3D Viewer",
                  "Basic Editor",
                  "PNG Export",
                ],
              },
              {
                version: "v1.1",
                status: "next",
                title: "Enhanced Tools",
                features: [
                  "Palette Extractor",
                  "Stitch Checker",
                  "Template Blok Cap",
                ],
              },
              {
                version: "v1.2",
                status: "planned",
                title: "Catalog & Search",
                features: [
                  "Motif Catalog",
                  "Similar Pattern Search",
                  "C2PA Metadata",
                ],
              },
              {
                version: "v2.0",
                status: "future",
                title: "Advanced AI",
                features: [
                  "RAG Knowledge Base",
                  "Fine-tuned Models",
                  "Cultural Insights",
                ],
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-amber-600 dark:hover:border-amber-600 transition-all hover:scale-105 hover:shadow-xl animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {item.version}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          item.status === "live"
                            ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 animate-pulse-slow"
                            : item.status === "next"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}
                      >
                        {item.status === "live"
                          ? "Live"
                          : item.status === "next"
                          ? "In Progress"
                          : "Planned"}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                      {item.title}
                    </h3>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.features.map((feature, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm text-zinc-700 dark:text-zinc-300 hover:bg-amber-100 dark:hover:bg-amber-950 hover:scale-105 transition-all"
                    >
                      <Check className="w-4 h-4 text-amber-600" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-amber-600 to-amber-800 text-white relative overflow-hidden hover:scale-105 transition-transform duration-300 animate-fade-in-up">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
            <div className="relative space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold">
                Siap Menciptakan Batik Impian Anda?
              </h2>
              <p className="text-xl text-amber-100">
                Bergabunglah dengan ratusan desainer & perajin yang mempercayai
                Batiku
              </p>
              <a
                href="/studio"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-700 rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-200 font-bold text-lg"
              >
                Mulai Berkarya Gratis
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Image
                  src="/Batiku Only.png"
                  alt="Batiku Logo"
                  width={120}
                  height={50}
                  style={{ height: "auto" }}
                />
              </Link>
            </div>
            <div className="text-zinc-600 dark:text-zinc-400 text-sm">
              © 2025 Batiku – Powered by Amazon Bedrock
            </div>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/zulvanavito/batiku.git"
                target="_blank"
                className="text-zinc-600 dark:text-zinc-400 hover:text-amber-600 hover:scale-110 transition-all"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
