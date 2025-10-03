import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import jszip from "jszip";
import ImageTracer from "imagetracerjs";
import { createCanvas, loadImage } from "canvas";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
});

const bucketName = process.env.AWS_S3_BUCKET_NAME;

// Fungsi traceImage yang menggunakan 'imagetracerjs'
async function traceImage(buffer: Buffer): Promise<string> {
  // 1. Muat gambar mentah (buffer) ke dalam sebuah objek gambar 'canvas'
  const image = await loadImage(buffer);

  // 2. Buat kanvas virtual seukuran gambar
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");

  // 3. Gambar citra tersebut ke kanvas
  ctx.drawImage(image, 0, 0);

  // 4. Ambil data piksel dari kanvas
  const imageData = ctx.getImageData(0, 0, image.width, image.height);

  // 5. Lakukan proses tracing pada data piksel
  const svgContent = ImageTracer.imageToSVG(imageData, {
    ltres: 1,
    qtres: 1,
    pathomit: 8,
    scale: 1,
  });

  return svgContent;
}

export async function POST(request: Request) {
  if (!bucketName) {
    console.error("Error: AWS_S3_BUCKET_NAME belum diatur.");
    return new NextResponse("Konfigurasi server tidak lengkap", {
      status: 500,
    });
  }

  try {
    const body = await request.json();
    const { imageUrl, settings } = body;

    if (!imageUrl) {
      return new NextResponse("Bad Request: imageUrl is required", {
        status: 400,
      });
    }

    console.log(`Memulai proses ekspor untuk: ${imageUrl}`);
    console.log("Dengan pengaturan:", settings);

    // Unduh gambar dari S3
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const pngBuffer = Buffer.from(imageResponse.data);

    // Panggil fungsi traceImage yang sudah benar
    const svgContent = await traceImage(pngBuffer);

    // Buat file metadata
    const metadataContent = JSON.stringify(
      {
        sourceImage: imageUrl,
        createdAt: new Date().toISOString(),
        editorSettings: settings,
      },
      null,
      2
    );

    // Buat file ZIP
    const zip = new jszip();
    const baseName = imageUrl.split("/").pop()?.replace(".png", "") || "batik";

    zip.file(`${baseName}.png`, pngBuffer);
    zip.file(`${baseName}.svg`, svgContent);
    zip.file("metadata.json", metadataContent);

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    // Unggah ZIP ke S3
    const zipKey = `exports/${baseName}-${Date.now()}.zip`;
    const putObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: zipKey,
      Body: zipBuffer,
      ContentType: "application/zip",
    });
    await s3Client.send(putObjectCommand);

    const downloadUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${zipKey}`;

    console.log(`Proses ekspor selesai. URL Download: ${downloadUrl}`);

    return NextResponse.json({ downloadUrl });
  } catch (error) {
    console.error("Error di API export:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
