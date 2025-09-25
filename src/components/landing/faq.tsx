import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Siapa yang memegang hak cipta atas motif yang dihasilkan?",
    a: "Anda. Setiap motif yang Anda hasilkan sepenuhnya menjadi milik Anda dan bebas digunakan untuk keperluan pribadi maupun komersial.",
  },
  {
    q: "Jenis gambar referensi apa yang paling baik?",
    a: "Sistem kami dapat memproses berbagai jenis input, mulai dari sketsa kasar, foto objek, hingga gambar digital. Untuk hasil terbaik, gunakan gambar dengan kontras yang jelas antara subjek dan latar belakang.",
  },
  {
    q: "Bisakah AI menggabungkan beberapa gaya batik sekaligus?",
    a: "Bisa. Anda dapat memberikan beberapa prompt gaya, misalnya 'gaya Mega Mendung Cirebon dengan isen-isen khas Yogyakarta', dan AI akan mencoba menginterpretasikan kombinasi tersebut secara kreatif.",
  },
  {
    q: "Apakah gambar referensi saya aman?",
    a: "Tentu. Input dan output Anda tidak pernah digunakan untuk melatih model dasar kami, sesuai dengan kebijakan privasi yang ketat.",
  },
  {
    q: "Bagaimana dengan motif-motif sakral?",
    a: "Kami menerapkan 'Guardrails Budaya' yang secara aktif memblokir atau menormalisasi prompt untuk menghindari pembuatan motif sakral atau terlarang.",
  },
  {
    q: "Apakah hasil akhirnya bisa langsung digunakan untuk produksi?",
    a: "Bisa. File SVG yang diekspor telah melalui proses pembersihan otomatis (vectorization & cleanup), sehingga siap untuk tahap produksi selanjutnya.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="w-full h-screen py-20">
      <div className="container max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold text-black text-center">
          Pertanyaan yang Sering Diajukan
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i + 1}`}
              className="border-zinc-800"
            >
              <AccordionTrigger className="text-black text-left hover:no-underline text-lg">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-zinc-400 text-base">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
