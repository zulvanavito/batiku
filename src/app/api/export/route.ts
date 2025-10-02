import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import jszip from "jszip";
// --- PERBAIKAN 1: Ubah cara import Potrace ---
import * as Potrace from "potrace";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
});

const bucketName = process.env.AWS_S3_BUCKET_NAME;

function traceImage(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    // --- PERBAIKAN 2: Gunakan Potrace sebagai constructor ---
    const trace = new Potrace.Potrace();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trace.loadImage(buffer, (err: any) => {
      if (err) return reject(err);
      resolve(trace.getSVG());
    });
  });
}

export async function POST(request: Request) {
  if (!bucketName) {
    console.error("Error: Nama S3 Bucket (AWS_S3_BUCKET_NAME) belum diatur.");
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

    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const pngBuffer = Buffer.from(imageResponse.data);

    const svgContent = await traceImage(pngBuffer);

    const metadataContent = JSON.stringify(
      {
        sourceImage: imageUrl,
        createdAt: new Date().toISOString(),
        editorSettings: settings,
      },
      null,
      2
    );

    const zip = new jszip();
    const originalFileName = imageUrl.split("/").pop() || "batik.png";
    const baseName = originalFileName.replace(".png", "");

    zip.file(`${baseName}.png`, pngBuffer);
    zip.file(`${baseName}.svg`, svgContent);
    zip.file("metadata.json", metadataContent);

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

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
