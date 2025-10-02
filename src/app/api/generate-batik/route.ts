import { NextResponse } from "next/server";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
});

const modelId = "amazon.titan-image-generator-v1";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, family, style, palette } = body;

    const fullPrompt = `A seamless tile of Indonesian Batik pattern, ${family} family, ${style} style, ${palette} color palette. Detailed, clean lines, vector art style. ${prompt}`;

    console.log("Mengirim prompt ke Bedrock:", fullPrompt);

    const payload = {
      taskType: "TEXT_IMAGE",
      textToImageParams: { text: fullPrompt },
      imageGenerationConfig: {
        numberOfImages: 3,
        quality: "standard",
        width: 1024,
        height: 1024,
        cfgScale: 8.0,
        seed: Math.floor(Math.random() * 2147483647),
      },
    };

    const command = new InvokeModelCommand({
      body: JSON.stringify(payload),
      modelId: modelId,
      contentType: "application/json",
      accept: "application/json",
    });

    const apiResponse = await client.send(command);

    const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
    const responseBody = JSON.parse(decodedResponseBody);
    const base64Images = responseBody.images;

    console.log(
      `Berhasil menerima ${base64Images.length} gambar dari Bedrock.`
    );

    // --- PERUBAHAN UTAMA DI SINI ---
    // Hapus mockResponse dan buat realResponse yang berisi data base64
    const realResponse = {
      jobId: `job_${Date.now()}`,
      candidates: base64Images.map((base64Data: string, index: number) => ({
        base64: base64Data, // Kirim data base64 asli
        idx: index + 1,
      })),
    };

    // Kirim respons yang berisi data gambar asli ke frontend
    return NextResponse.json(realResponse);
  } catch (error) {
    console.error("Error saat memanggil Amazon Bedrock:", error);
    return new NextResponse("Error communicating with Bedrock", {
      status: 500,
    });
  }
}
