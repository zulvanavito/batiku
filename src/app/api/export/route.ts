// route.ts - Final Export (MVP)
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import axios from "axios";
import JSZip from "jszip";
import sharp from "sharp"; // Menggunakan sharp untuk image processing

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
});

const sqsClient = new SQSClient({
  region: process.env.AWS_REGION || "us-east-1",
});

const bucketName = process.env.AWS_S3_BUCKET_NAME;
const vectorizeQueueUrl = process.env.VECTORIZE_QUEUE_URL;

export async function POST(request: Request) {
  if (!bucketName) {
    return new NextResponse("Konfigurasi server tidak lengkap", {
      status: 500,
    });
  }

  try {
    const body = await request.json();
    const { imageUrl, settings, rapportCm = 25 } = body;

    if (!imageUrl) {
      return new NextResponse("Bad Request: imageUrl is required", {
        status: 400,
      });
    }

    console.log(`Memulai proses ekspor untuk: ${imageUrl}`);
    console.log("Dengan pengaturan:", settings);

    // 1. Download image
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const pngBuffer = Buffer.from(imageResponse.data);

    // 2. Process dengan Sharp (resize ke 300 DPI)
    const targetPx = rapportCm === 20 ? 2362 : 2953;

    const processedPng = await sharp(pngBuffer)
      .resize(targetPx, targetPx, {
        fit: "cover",
        kernel: "lanczos3",
      })
      .png({ quality: 100, compressionLevel: 9 })
      .withMetadata({
        density: 300,
      })
      .toBuffer();

    // 3. Buat metadata
    const metadata = {
      sourceImage: imageUrl,
      createdAt: new Date().toISOString(),
      editorSettings: settings,
      rapport_cm: rapportCm,
      resolution: `${targetPx}x${targetPx}`,
      dpi: 300,
      format: "PNG",
      version: "1.0",
    };

    // 4. Buat nama file standar & buat file ZIP
    const now = new Date();
    const dateString = now.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
    const timeString = now.toTimeString().slice(0, 8).replace(/:/g, ""); // HHMMSS
    const motifFamily = settings?.family || "batik";
    const baseName = `batiku-export-${motifFamily}-${dateString}-${timeString}`;

    const zip = new JSZip();
    zip.file(`${baseName}.png`, processedPng);
    zip.file("metadata.json", JSON.stringify(metadata, null, 2));
    zip.file("README.txt", "File SVG sedang diproses secara terpisah.");

    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 9 },
    });

    // Hitung ukuran file ZIP untuk dikirim ke frontend
    const zipSizeBytes = zipBuffer.length;

    // 5. Upload ZIP ke S3
    const zipKey = `exports/${baseName}.zip`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: zipKey,
        Body: zipBuffer,
        ContentType: "application/zip",
      })
    );

    // 6. Kirim job vectorization ke SQS (jika dikonfigurasi)
    if (vectorizeQueueUrl) {
      await sqsClient.send(
        new SendMessageCommand({
          QueueUrl: vectorizeQueueUrl,
          MessageBody: JSON.stringify({
            imageUrl,
            zipKey,
            baseName,
            settings,
          }),
        })
      );
      console.log("Vectorization job queued");
    }

    // 7. Buat URL download
    const downloadUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${zipKey}`;

    console.log(`Ekspor selesai. URL: ${downloadUrl}`);

    // 8. Kirim respons lengkap ke frontend
    return NextResponse.json({
      downloadUrl,
      zipKey,
      zipSizeBytes, // Sertakan ukuran file di sini
      status: "success",
      message: "PNG ready. SVG processing in background.",
      metadata,
    });
  } catch (error) {
    console.error("Error di API export:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
