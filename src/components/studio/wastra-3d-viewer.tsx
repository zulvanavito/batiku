/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  useTexture,
  Environment,
  PerspectiveCamera,
  Center,
} from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Box, Loader2, Shirt, Layers } from "lucide-react"; // FIX: Tambah X untuk tombol tutup
import * as THREE from "three";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // FIX: Import Tooltip
import { cn } from "@/lib/utils"; // FIX: Import cn

interface Wastra3DViewerProps {
  imageUrl: string;
  disabled?: boolean;
  // FIX: Tambahkan prop untuk kontrol tampilan di menu/footer mobile
  isMenuMode?: boolean;
}

function ShirtGLBModel({ textureUrl }: { textureUrl: string }) {
  const { scene } = useGLTF("/models/kemeja3d.glb");
  const texture = useTexture(textureUrl);

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  texture.flipY = false;

  // Fix texture color space
  texture.colorSpace = THREE.SRGBColorSpace;

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        // Create a new standard material with proper settings
        child.material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.85, // Higher = less shiny
          metalness: 0.0, // Fabric should not be metallic
          side: THREE.FrontSide,
        });
        child.material.needsUpdate = true;

        // Disable receive shadow to reduce lighting effects
        child.receiveShadow = false;
        child.castShadow = false;
      }
    });
  }, [scene, texture]);

  return <primitive object={scene} />;
}

function FabricGLBModel({ textureUrl }: { textureUrl: string }) {
  const { scene } = useGLTF("/models/kain3d.glb");
  const texture = useTexture(textureUrl);

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.flipY = false;
  texture.colorSpace = THREE.SRGBColorSpace;

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.9,
          metalness: 0.0,
          side: THREE.DoubleSide,
        });
        child.material.needsUpdate = true;
        child.receiveShadow = false;
        child.castShadow = false;
      }
    });
  }, [scene, texture]);

  return <primitive object={scene} />;
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 rounded-lg z-10">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400 mx-auto mb-2" />
        <p className="text-sm text-zinc-500">Loading 3D model...</p>
      </div>
    </div>
  );
}

export function Wastra3DViewer({
  imageUrl,
  disabled,
  isMenuMode = false,
}: Wastra3DViewerProps) {
  const [open, setOpen] = useState(false);
  const [activeModel, setActiveModel] = useState<"shirt" | "fabric">("shirt");
  const [isLoading, setIsLoading] = useState(true);

  const proxyTextureUrl = `/api/proxy-image?url=${encodeURIComponent(
    imageUrl
  )}`;

  const handleModelChange = (value: string) => {
    setActiveModel(value as any);
    setIsLoading(true);
  };

  // Konten tombol trigger default
  const defaultTrigger = (
    <Button
      variant="outline"
      size={isMenuMode ? "default" : "sm"}
      disabled={disabled}
      className={cn(
        "gap-2 h-9 px-3 sm:h-10 sm:px-4", // Ukuran default (navbar desktop)
        isMenuMode && "w-full justify-center h-10 px-4 text-base" // Tampilan penuh di dalam menu/footer mobile (ikon saja)
      )}
    >
      {/* FIX: Menggunakan Box sebagai ikon 3D Preview */}
      <Box className={cn("w-6 h-6", isMenuMode ? "w-6 h-6" : "w-4 h-4 mr-2")} />
      {/* Text hanya tampil di desktop navbar atau saat isMenuMode (untuk tombol penuh di menu) */}
      <span className={cn(isMenuMode ? "hidden lg:inline" : "inline")}>
        3D Preview
      </span>
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>{defaultTrigger}</DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Tampilan 3D Wastra</TooltipContent>
      </Tooltip>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Wastra 3D Preview</DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeModel}
          onValueChange={handleModelChange}
          className="flex-1 flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="shirt" className="gap-2">
              <Shirt className="w-4 h-4" />
              Kemeja
            </TabsTrigger>
            <TabsTrigger value="fabric" className="gap-2">
              <Layers className="w-4 h-4" />
              Kain
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shirt" className="flex-1 mt-4 relative">
            {isLoading && <LoadingFallback />}
            <Canvas
              className="bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 rounded-lg"
              onCreated={() => setTimeout(() => setIsLoading(false), 500)}
              gl={{
                antialias: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.0, // Adjust if still too bright
              }}
            >
              <Suspense fallback={null}>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

                {/* Balanced lighting - not too bright */}
                <ambientLight intensity={0.5} />
                <directionalLight
                  position={[3, 3, 3]}
                  intensity={0.4}
                  castShadow={false}
                />
                <directionalLight
                  position={[-2, 2, -2]}
                  intensity={0.3}
                  castShadow={false}
                />

                <Center>
                  <ShirtGLBModel textureUrl={proxyTextureUrl} />
                </Center>

                <OrbitControls
                  enablePan={true}
                  minDistance={2}
                  maxDistance={8}
                  target={[0, 0, 0]}
                  enableDamping={true}
                  dampingFactor={0.05}
                />

                {/* Soft environment lighting */}
                <Environment preset="apartment" environmentIntensity={0.3} />
              </Suspense>
            </Canvas>
          </TabsContent>

          <TabsContent value="fabric" className="flex-1 mt-4 relative">
            {isLoading && <LoadingFallback />}
            <Canvas
              className="bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 rounded-lg"
              onCreated={() => setTimeout(() => setIsLoading(false), 500)}
              gl={{
                antialias: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.0,
              }}
            >
              <Suspense fallback={null}>
                <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={60} />

                {/* Soft lighting for fabric */}
                <ambientLight intensity={0.6} />
                <directionalLight
                  position={[2, 2, 2]}
                  intensity={0.4}
                  castShadow={false}
                />

                <Center>
                  <FabricGLBModel textureUrl={proxyTextureUrl} />
                </Center>

                <OrbitControls
                  enablePan={true}
                  minDistance={2}
                  maxDistance={8}
                  target={[0, 0, 0]}
                  enableDamping={true}
                  dampingFactor={0.05}
                />

                <Environment preset="city" environmentIntensity={0.2} />
              </Suspense>
            </Canvas>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t">
          <span>
            Drag untuk rotate • Scroll untuk zoom • Shift + Drag untuk pan
          </span>
          <span className="text-zinc-400">Powered by Three.js</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

useGLTF.preload("/models/kemeja3d.glb");
useGLTF.preload("/models/kain3d.glb");
