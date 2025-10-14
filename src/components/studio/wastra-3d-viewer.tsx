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
import { Box, Loader2, Shirt, Layers } from "lucide-react";
import * as THREE from "three";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface Wastra3DViewerProps {
  imageUrl: string;
  disabled?: boolean;
  isMenuMode?: boolean;
}

function ShirtGLBModel({ textureUrl }: { textureUrl: string }) {
  const { scene } = useGLTF("/models/kemeja3d.glb");
  const texture = useTexture(textureUrl);

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  texture.flipY = false;
  texture.colorSpace = THREE.SRGBColorSpace;

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.85,
          metalness: 0.0,
          side: THREE.FrontSide,
        });
        child.material.needsUpdate = true;
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
  disabled = false,
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

  // FIX: Render berbeda untuk mode icon-only vs full button
  const renderTrigger = () => {
    if (isMenuMode) {
      // Mode Icon Only - untuk mobile footer
      return (
        <Button
          variant="outline"
          size="icon"
          disabled={disabled}
          className="h-10 w-10 flex-shrink-0"
        >
          <Box className="w-5 h-5" />
        </Button>
      );
    }

    // Mode Full Button - untuk navbar desktop
    return (
      <Button
        variant="outline"
        size="sm"
        disabled={disabled}
        className="gap-2 h-10 px-3 sm:px-4"
      >
        <Box className="w-4 h-4" />
        <span className="hidden sm:inline">3D Preview</span>
      </Button>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>{renderTrigger()}</DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side={isMenuMode ? "top" : "bottom"}>
          <p>Tampilan 3D Wastra</p>
        </TooltipContent>
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
                toneMappingExposure: 1.0,
              }}
            >
              <Suspense fallback={null}>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

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
