/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useTexture,
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";
import { Suspense, useState } from "react";
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

interface Wastra3DViewerProps {
  imageUrl: string;
  disabled?: boolean;
}

// 3D Model Component - Simple Shirt Shape
function ShirtModel({ textureUrl }: { textureUrl: string }) {
  const texture = useTexture(textureUrl);

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);

  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 2.5, 0.3]} />
        <meshStandardMaterial map={texture} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Left Sleeve */}
      <mesh position={[-1.3, 0.5, 0]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[1, 0.8, 0.3]} />
        <meshStandardMaterial map={texture} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Right Sleeve */}
      <mesh position={[1.3, 0.5, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[1, 0.8, 0.3]} />
        <meshStandardMaterial map={texture} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Collar */}
      <mesh position={[0, 1.5, 0.1]}>
        <boxGeometry args={[0.6, 0.3, 0.15]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>
    </group>
  );
}

// 3D Model Component - Fabric Panel
function FabricModel({ textureUrl }: { textureUrl: string }) {
  const texture = useTexture(textureUrl);

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);

  return (
    <group>
      <mesh rotation={[0, 0, 0]}>
        <planeGeometry args={[4, 4, 32, 32]} />
        <meshStandardMaterial
          map={texture}
          side={THREE.DoubleSide}
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>
    </group>
  );
}

// Loading Component
function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 rounded-lg">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400 mx-auto mb-2" />
        <p className="text-sm text-zinc-500">Loading 3D model...</p>
      </div>
    </div>
  );
}

export function Wastra3DViewer({ imageUrl, disabled }: Wastra3DViewerProps) {
  const [open, setOpen] = useState(false);
  const [activeModel, setActiveModel] = useState<"shirt" | "fabric">("shirt");
  const [isLoading, setIsLoading] = useState(true);

  // Convert S3 URL to proxy URL
  const proxyTextureUrl = `/api/proxy-image?url=${encodeURIComponent(
    imageUrl
  )}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="gap-2"
        >
          <Box className="w-4 h-4" />
          3D Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[85vh]">
        <DialogHeader>
          <DialogTitle>Wastra 3D Preview</DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeModel}
          onValueChange={(v) => {
            setActiveModel(v as any);
            setIsLoading(true);
          }}
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
              onCreated={() => setIsLoading(false)}
            >
              <Suspense fallback={null}>
                <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />

                {/* Lighting */}
                <ambientLight intensity={0.6} />
                <directionalLight
                  position={[5, 5, 5]}
                  intensity={0.8}
                  castShadow
                />
                <directionalLight position={[-5, 3, -5]} intensity={0.4} />
                <pointLight position={[0, -3, 2]} intensity={0.3} />

                <ShirtModel textureUrl={proxyTextureUrl} />

                <OrbitControls
                  enablePan={false}
                  minDistance={4}
                  maxDistance={10}
                  minPolarAngle={Math.PI / 4}
                  maxPolarAngle={Math.PI / 1.5}
                />

                <Environment preset="warehouse" />
              </Suspense>
            </Canvas>
          </TabsContent>

          <TabsContent value="fabric" className="flex-1 mt-4 relative">
            {isLoading && <LoadingFallback />}
            <Canvas
              className="bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 rounded-lg"
              onCreated={() => setIsLoading(false)}
            >
              <Suspense fallback={null}>
                <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={60} />

                {/* Lighting */}
                <ambientLight intensity={0.7} />
                <directionalLight position={[3, 3, 3]} intensity={0.8} />
                <directionalLight position={[-3, 2, -2]} intensity={0.5} />

                <FabricModel textureUrl={proxyTextureUrl} />

                <OrbitControls
                  enablePan={false}
                  minDistance={2}
                  maxDistance={8}
                />

                <Environment preset="apartment" />
              </Suspense>
            </Canvas>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t">
          <span>Drag untuk rotate • Scroll untuk zoom</span>
          <span className="text-zinc-400">Powered by Three.js</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
