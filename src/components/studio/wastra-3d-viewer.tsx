/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  useTexture,
  Environment,
  PerspectiveCamera,
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

interface Wastra3DViewerProps {
  imageUrl: string;
  disabled?: boolean;
}

// GLB Shirt Model Component
function ShirtGLBModel({ textureUrl }: { textureUrl: string }) {
  const { scene } = useGLTF("/models/kemeja3d.glb");
  const texture = useTexture(textureUrl);

  // Configure texture
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  texture.flipY = false; // Important for GLB models

  useEffect(() => {
    // Center the model geometry
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());

    // Move all meshes to center
    scene.position.x = -center.x;
    scene.position.y = -center.y;
    scene.position.z = -center.z;

    // Traverse the model and apply texture to all meshes
    scene.traverse((child: any) => {
      if (child.isMesh) {
        // Clone material to avoid affecting original
        child.material = child.material.clone();

        // Apply batik texture
        child.material.map = texture;
        child.material.needsUpdate = true;

        // Optional: adjust material properties for fabric look
        child.material.roughness = 0.8;
        child.material.metalness = 0.1;
      }
    });
  }, [scene, texture]);

  return <primitive object={scene.clone()} scale={1} />;
}

// GLB Fabric Model Component
function FabricGLBModel({ textureUrl }: { textureUrl: string }) {
  const { scene } = useGLTF("/models/kain3d.glb");
  const texture = useTexture(textureUrl);

  // Configure texture for fabric with tiling
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.flipY = false;

  useEffect(() => {
    // Center the model geometry
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());

    scene.position.x = -center.x;
    scene.position.y = -center.y;
    scene.position.z = -center.z;

    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.material = child.material.clone();
        child.material.map = texture;
        child.material.needsUpdate = true;
        child.material.roughness = 0.9;
        child.material.metalness = 0.0;
        child.material.side = THREE.DoubleSide;
      }
    });
  }, [scene, texture]);

  return <primitive object={scene.clone()} scale={1} />;
}

// Loading Component
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

export function Wastra3DViewer({ imageUrl, disabled }: Wastra3DViewerProps) {
  const [open, setOpen] = useState(false);
  const [activeModel, setActiveModel] = useState<"shirt" | "fabric">("shirt");
  const [isLoading, setIsLoading] = useState(true);

  // Convert S3 URL to proxy URL
  const proxyTextureUrl = `/api/proxy-image?url=${encodeURIComponent(
    imageUrl
  )}`;

  // Reset loading state when switching models
  const handleModelChange = (value: string) => {
    setActiveModel(value as any);
    setIsLoading(true);
  };

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
            >
              <Suspense fallback={null}>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

                {/* Lighting setup for shirt */}
                <ambientLight intensity={0.5} />
                <directionalLight
                  position={[5, 5, 5]}
                  intensity={1}
                  castShadow
                />
                <directionalLight position={[-5, 3, -5]} intensity={0.5} />
                <pointLight position={[0, -2, 3]} intensity={0.4} />
                <spotLight
                  position={[0, 5, 0]}
                  angle={0.3}
                  penumbra={1}
                  intensity={0.5}
                />

                <ShirtGLBModel textureUrl={proxyTextureUrl} />

                <OrbitControls
                  enablePan={true}
                  minDistance={3}
                  maxDistance={10}
                  minPolarAngle={0}
                  maxPolarAngle={Math.PI}
                  target={[0, 0, 0]}
                  enableDamping={true}
                  dampingFactor={0.05}
                />

                <Environment preset="studio" />
              </Suspense>
            </Canvas>
          </TabsContent>

          <TabsContent value="fabric" className="flex-1 mt-4 relative">
            {isLoading && <LoadingFallback />}
            <Canvas
              className="bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 rounded-lg"
              onCreated={() => setTimeout(() => setIsLoading(false), 500)}
            >
              <Suspense fallback={null}>
                <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={60} />

                {/* Lighting setup for fabric */}
                <ambientLight intensity={0.6} />
                <directionalLight position={[3, 3, 3]} intensity={0.9} />
                <directionalLight position={[-3, 2, -2]} intensity={0.6} />
                <pointLight position={[0, 0, 2]} intensity={0.3} />

                <FabricGLBModel textureUrl={proxyTextureUrl} />

                <OrbitControls
                  enablePan={true}
                  minDistance={2}
                  maxDistance={8}
                  target={[0, 0, 0]}
                  enableDamping={true}
                  dampingFactor={0.05}
                />

                <Environment preset="warehouse" />
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

// Preload models for better performance
useGLTF.preload("/models/kemeja3d.glb");
useGLTF.preload("/models/kain3d.glb");
