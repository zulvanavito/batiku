import { NextResponse } from "next/server";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

// Inisialisasi Klien AWS
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
});
const s3Client = new S3Client({ region: process.env.AWS_REGION });

const modelId = "amazon.titan-image-generator-v1";
const bucketName = process.env.AWS_S3_BUCKET_NAME;

export async function POST(request: Request) {
  if (!bucketName) {
    return new NextResponse("Konfigurasi server tidak lengkap", {
      status: 500,
    });
  }

  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    const promptText =
      (formData.get("prompt") as string) ||
      "variasi motif batik dari gambar referensi";

    if (!imageFile) {
      return new NextResponse("Bad Request: File gambar dibutuhkan.", {
        status: 400,
      });
    }

    console.log(`Memulai job Image Variation untuk: ${imageFile.name}`);

    const imageBuffer = await imageFile.arrayBuffer();
    console.log("Mengecilkan ukuran gambar referensi...");
    const resizedImageBuffer = await sharp(Buffer.from(imageBuffer))
      .resize(1024, 1024, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .toBuffer();

    const imageBase64 = resizedImageBuffer.toString("base64");
    console.log("Ukuran gambar berhasil dikecilkan.");

    const payload = JSON.stringify({
      taskType: "IMAGE_VARIATION",
      imageVariationParams: {
        images: [imageBase64],
        text: promptText,
      },
      imageGenerationConfig: {
        numberOfImages: 4,
        quality: "standard",
        width: 1024,
        height: 1024,
      },
    });

    const command = new InvokeModelCommand({ body: payload, modelId });
    const apiResponse = await bedrockClient.send(command);

    const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
    const responseBody = JSON.parse(decodedResponseBody);
    const base64Images = responseBody.images;

    console.log(
      `Berhasil menerima ${base64Images.length} variasi gambar dari Bedrock.`
    );

    const uploadPromises = base64Images.map(
      async (base64Data: string, index: number) => {
        const buffer = Buffer.from(base64Data, "base64");
        const key = `generated/variation_${Date.now()}_${index + 1}.png`;

        await s3Client.send(
          new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: buffer,
            ContentType: "image/png",
          })
        );

        const imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        return { imageUrl, idx: index + 1 };
      }
    );

    const candidates = await Promise.all(uploadPromises);

    return NextResponse.json({ jobId: `job_${Date.now()}`, candidates });
  } catch (error) {
    console.error("Error di API generate-variation:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
