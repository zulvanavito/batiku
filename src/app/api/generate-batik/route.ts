import { NextResponse } from "next/server";

// Handler untuk metode POST
export async function POST(request: Request) {
  try {
    // 1. Mengambil data yang dikirim dari form di frontend
    const body = await request.json();
    const { prompt, family, style, palette } = body;

    // Log data yang diterima untuk debugging
    console.log("Data diterima di API:", { prompt, family, style, palette });

    // --- (CATATAN) ---
    // Di sinilah nanti kita akan memanggil Amazon Bedrock.
    // Untuk sekarang, kita akan mensimulasikan prosesnya.

    // 2. Simulasi penundaan (delay) seolah-olah sedang memproses
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay 2 detik

    // 3. Membuat respons palsu (mock response) sesuai PRD
    const mockResponse = {
      jobId: `job_${Date.now()}`,
      candidates: [
        { s3KeyPng: "mock/candidate_1.png", idx: 1 },
        { s3KeyPng: "mock/candidate_2.png", idx: 2 },
        { s3KeyPng: "mock/candidate_3.png", idx: 3 },
      ],
    };

    // 4. Mengirimkan respons kembali ke frontend
    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error("Error di API generate-batik:", error);
    // Mengirimkan respons error jika terjadi masalah
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
