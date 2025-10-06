import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import JSZip from "jszip";
import sharp from "sharp";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
});

const bucketName = process.env.AWS_S3_BUCKET_NAME;

export async function POST(request: Request) {
  if (!bucketName) {
    console.error("Error: AWS_S3_BUCKET_NAME belum diatur");
    return new NextResponse("Konfigurasi server tidak lengkap", {
      status: 500,
    });
  }

  try {
    const body = await request.json();
    const { 
      imageUrl, 
      processedImageBase64, // Gambar yang sudah diproses dari canvas
      settings, 
      rapportCm = 25, 
      userId, 
      designId 
    } = body;

    if (!imageUrl) {
      return new NextResponse("Bad Request: imageUrl is required", {
        status: 400,
      });
    }

    console.log(`Memulai proses ekspor untuk: ${imageUrl}`);
    console.log("Dengan pengaturan:", settings);
    console.log(`Ukuran raport: ${rapportCm} cm`);

    let pngBuffer: Buffer;

    // 1. Gunakan processed image jika ada, kalau tidak download dari URL
    if (processedImageBase64) {
      console.log("Menggunakan gambar yang sudah diproses dari canvas");
      // Convert base64 to buffer
      const base64Data = processedImageBase64.replace(/^data:image\/\w+;base64,/, "");
      pngBuffer = Buffer.from(base64Data, "base64");
    } else {
      console.log("Download image dari URL (fallback)");
      const imageResponse = await axios.get(imageUrl, {
        responseType: "arraybuffer",
        timeout: 30000,
      });
      pngBuffer = Buffer.from(imageResponse.data);
    }

    // 2. Process dengan Sharp - hanya resize (effects sudah dari canvas)
    const targetPx = rapportCm === 20 ? 2362 : 2953;

    console.log(`Processing image ke ${targetPx}x${targetPx}px @ 300 DPI...`);

    const processedPng = await sharp(pngBuffer)
      .resize(targetPx, targetPx, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .png({
        quality: 100,
        compressionLevel: 9,
        palette: false,
      })
      .withMetadata({
        density: 300,
      })
      .toBuffer();

    console.log(`Image processed. Size: ${processedPng.length} bytes`);

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
      userId: userId || "anonymous",
      designId: designId || null,
    };

    // 4. Buat ZIP package
    const zip = new JSZip();
    const originalFileName = imageUrl.split("/").pop() || "batik.png";
    const baseName = originalFileName.replace(".png", "");
    const timestamp = Date.now();

    zip.file(`${baseName}.png`, processedPng);
    zip.file("metadata.json", JSON.stringify(metadata, null, 2));
    zip.file(
      "README.txt",
      `Batik Export Package
=====================

File ini berisi:
- ${baseName}.png: Raport batik ${rapportCm}x${rapportCm} cm @ 300 DPI
- metadata.json: Parameter desain dan informasi ekspor

Editor Settings:
- Repeat: ${settings?.repeat || "N/A"}
- Simetri: ${settings?.symmetry || "N/A"}
- Kepadatan Isèn: ${settings?.density || "N/A"}%
- Ketebalan Garis: ${settings?.thickness || "N/A"}

SVG vectorization akan tersedia di versi berikutnya.

Diekspor pada: ${new Date().toLocaleString("id-ID")}
`
    );

    console.log("Generating ZIP...");

    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 9 },
    });

    console.log(`ZIP generated. Size: ${zipBuffer.length} bytes`);

    // 5. Upload ZIP ke S3
    const zipKey = `exports/${baseName}-${timestamp}.zip`;

    console.log(`Uploading ke S3: ${zipKey}`);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: zipKey,
        Body: zipBuffer,
        ContentType: "application/zip",
        Metadata: {
          userId: userId || "anonymous",
          designId: designId || "unknown",
          rapport: rapportCm.toString(),
          createdAt: new Date().toISOString(),
        },
      })
    );

    // 6. Generate download URL
    const downloadUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${zipKey}`;

    console.log(`Ekspor selesai. URL: ${downloadUrl}`);

    return NextResponse.json({
      success: true,
      downloadUrl,
      zipKey,
      metadata: {
        fileName: `${baseName}-${timestamp}.zip`,
        fileSize: zipBuffer.length,
        rapport_cm: rapportCm,
        resolution: `${targetPx}x${targetPx}`,
        dpi: 300,
      },
      message: "Export berhasil. PNG 300 DPI siap diunduh.",
    });
  } catch (error) {
    console.error("Error di API export:", error);

    let errorMessage = "Internal Server Error";
    let errorDetails = "Unknown error";

    if (axios.isAxiosError(error)) {
      errorMessage = "Gagal memproses gambar";
      errorDetails = error.message;
    } else if (error instanceof Error) {
      errorDetails = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}