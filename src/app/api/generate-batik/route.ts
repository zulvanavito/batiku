import { NextResponse } from "next/server";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Inisialisasi Klien AWS. Kredensial akan diambil otomatis dari .env.local
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
});
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
});

// Konfigurasi dari environment variables
const modelId = "amazon.titan-image-generator-v1";
const bucketName = process.env.AWS_S3_BUCKET_NAME;

export async function POST(request: Request) {
  // Validasi awal: pastikan nama bucket sudah di-set
  if (!bucketName) {
    console.error(
      "Error: Nama S3 Bucket (AWS_S3_BUCKET_NAME) belum diatur di .env.local"
    );
    return new NextResponse("Konfigurasi server tidak lengkap", {
      status: 500,
    });
  }

  try {
    const body = await request.json();
    const { prompt, family, style, palette } = body;

    // 1. Membuat prompt lengkap untuk dikirim ke Bedrock
    const fullPrompt = `A seamless tile of Indonesian Batik pattern, ${family} family, ${style} style, ${palette} color palette. Detailed, clean lines, vector art style. ${prompt}`;

    console.log("Mengirim prompt ke Bedrock:", fullPrompt);

    // 2. Menyiapkan payload untuk model Titan Image Generator
    const payload = {
      taskType: "TEXT_IMAGE",
      textToImageParams: { text: fullPrompt },
      imageGenerationConfig: {
        numberOfImages: 4,
        quality: "standard",
        width: 1024,
        height: 1024,
        cfgScale: 8.0,
        seed: Math.floor(Math.random() * 2147483647),
      },
    };

    // 3. Mengirim permintaan ke Bedrock
    const command = new InvokeModelCommand({
      body: JSON.stringify(payload),
      modelId: modelId,
      contentType: "application/json",
      accept: "application/json",
    });
    const apiResponse = await bedrockClient.send(command);

    const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
    const responseBody = JSON.parse(decodedResponseBody);
    const base64Images = responseBody.images;

    console.log(
      `Berhasil menerima ${base64Images.length} gambar dari Bedrock.`
    );

    // 4. Mengunggah setiap gambar ke S3 secara paralel
    const uploadPromises = base64Images.map(
      async (base64Data: string, index: number) => {
        const buffer = Buffer.from(base64Data, "base64");
        const key = `generated/${Date.now()}_candidate_${index + 1}.png`;

        const putObjectCommand = new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: buffer,
          ContentType: "image/png",
        });

        await s3Client.send(putObjectCommand);

        // Membuat URL publik yang bisa diakses dari frontend
        const imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        console.log(`Berhasil upload ke S3: ${imageUrl}`);

        return { imageUrl, idx: index + 1 };
      }
    );

    const candidates = await Promise.all(uploadPromises);

    // 5. Mengirimkan kembali daftar URL gambar ke frontend
    return NextResponse.json({ jobId: `job_${Date.now()}`, candidates });
  } catch (error) {
    console.error("Error selama proses generate dan upload:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
