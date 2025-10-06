// src/lib/canvas-processor.ts

import type { EditorSettings } from "@/components/studio/editor-panel";

interface ProcessImageOptions {
  imageUrl: string;
  settings: EditorSettings;
  targetSize: number;
}

export async function processImageWithSettings({
  imageUrl,
  targetSize,
}: ProcessImageOptions): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        if (!ctx) {
          throw new Error("Canvas context not available");
        }
        

        canvas.width = targetSize;
        canvas.height = targetSize;

        console.log("Canvas created:", canvas.width, "x", canvas.height);
        console.log("Image size:", img.width, "x", img.height);

        // Background putih
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, targetSize, targetSize);

        // SIMPLE: Just draw image without effects
        ctx.drawImage(img, 0, 0, targetSize, targetSize);

        console.log("Image drawn to canvas");

        // Check if canvas has content
        const imageData = ctx.getImageData(0, 0, targetSize, targetSize);
        const hasContent = imageData.data.some((pixel, i) => {
          // Check if not pure white (skip alpha channel)
          if (i % 4 === 3) return false; // skip alpha
          return pixel < 255;
        });

        console.log("Canvas has content:", hasContent);

        if (!hasContent) {
          console.warn("⚠️ Canvas is blank!");
        }

        canvas.toBlob(
          (blob) => {
            if (blob) {
              console.log("✅ Blob created:", blob.size, "bytes");
              resolve(blob);
            } else {
              reject(new Error("Failed to create blob from canvas"));
            }
          },
          "image/png",
          1.0
        );
      } catch (error) {
        console.error("❌ Canvas processing error:", error);
        reject(error);
      }
    };
    

    img.onerror = (error) => {
      console.error("❌ Image load error:", error);
      reject(new Error(`Failed to load image: ${imageUrl}`));
    };

    console.log("Loading image via proxy:", proxyUrl);
    img.src = proxyUrl;
  });
}
