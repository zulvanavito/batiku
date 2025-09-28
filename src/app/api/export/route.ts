import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { s3KeyPng } = body;

    if (!s3KeyPng) {
      return new NextResponse("Bad Request: s3KeyPng is required", {
        status: 400,
      });
    }

    console.log(`Memulai proses ekspor untuk gambar: ${s3KeyPng}`);

    // Pura-pura bekerja keras (vectorizing, zipping, uploading to S3)
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Delay 3 detik

    // Kembalikan URL download palsu dari file ZIP di S3
    const fakeZipUrl = `/mock-download/${s3KeyPng
      .replace("mock/", "")
      .replace(".png", "")}.zip`;

    console.log(`Proses ekspor selesai. Mengirim URL: ${fakeZipUrl}`);

    return NextResponse.json({ downloadUrl: fakeZipUrl });
  } catch (error) {
    console.error("Error di API export:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
