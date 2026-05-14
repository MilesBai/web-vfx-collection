"use client";
import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import { Settings } from "lucide-react";
interface TextureToggles {
  diffuse: boolean;
  normal: boolean;
  roughness: boolean;
}

interface CardMeshProps {
  toggles: TextureToggles;
}

const CardMesh: React.FC<CardMeshProps> = ({ toggles }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const [colorMap, normalMap, roughnessMap] = useTexture([
    "/images/card_color.png",
    "/images/card_normal.png",
    "/images/card_roughness.png",
  ]);

  useFrame((state) => {
    const pointerX = state.pointer.x;
    const pointerY = state.pointer.y;
    //light position
    if (lightRef.current) {
      lightRef.current.position.x = THREE.MathUtils.lerp(
        lightRef.current.position.x,
        pointerX * 3,
        0.1,
      );
      lightRef.current.position.y = THREE.MathUtils.lerp(
        lightRef.current.position.y,
        pointerY * 3,
        0.1,
      );
    }

    if (meshRef.current) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        -pointerY * 0.2,
        0.05,
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        pointerX * 0.2,
        0.05,
      );
    }
  });

  // Dynamic prop assignment based on individual checkboxes
  // Diffuse is always true in the PBR material if the checkbox is checked, else we show a basic white shape.
  const activeColorMap = toggles.diffuse ? colorMap : null;
  const activeNormalMap = toggles.normal ? normalMap : null;
  const activeRoughnessMap = toggles.roughness ? roughnessMap : null;

  // We add fake glass if normal is on BUT roughness is off.
  // This fakes a full shiny card if we don't have the explicit roughness definitions yet.
  const shouldUseFakeGlass = toggles.normal && !toggles.roughness;

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.4} />

      <pointLight
        ref={lightRef}
        position={[0, 0, 2]}
        intensity={6}
        distance={10}
        decay={2}
        color="#ffffff"
      />

      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
        <mesh ref={meshRef}>
          <planeGeometry args={[2, 3.1]} />

          {!toggles.diffuse &&
          !toggles.normal &&
          !toggles.roughness ? (
            // If all are turned off, render a pure black silhouette shape so we can still see the plane outline
            <meshBasicMaterial
              color="#111111"
              transparent={true}
              opacity={0.5}
            />
          ) : (
            <meshPhysicalMaterial
              // Apply Diffuse Map
              map={activeColorMap || undefined}
              {...(activeColorMap
                ? { "map-colorSpace": THREE.SRGBColorSpace }
                : {})}
              color={activeColorMap ? "#ffffff" : "#222222"} // Darken base if no diffuse image
              // Apply Normal Map
              normalMap={activeNormalMap || undefined}
              {...(activeNormalMap
                ? { "normalMap-colorSpace": THREE.NoColorSpace }
                : {})}
              normalScale={
                activeNormalMap
                  ? new THREE.Vector2(1.5, 1.5)
                  : new THREE.Vector2(0, 0)
              }
              // Apply Roughness Map
              roughnessMap={activeRoughnessMap || undefined}
              // Base roughness (high if we have a map to mix it with, low if we don't but normal is on)
              roughness={activeRoughnessMap ? 1 : 0.2}
              transparent={true}
              metalness={0.}
              // The magic fallback for glassy setups
              clearcoat={shouldUseFakeGlass ? 1.0 : 0.0}
              clearcoatRoughness={0.1}
            />
          )}
        </mesh>
      </Float>
    </>
  );
};

export default function PhantomCard() {
  const [toggles, setToggles] = useState<TextureToggles>({
    diffuse: true,
    normal: true,
    roughness: true,
  });
  const [showControls, setShowControls] = useState(false);

  const handleToggle = (key: keyof TextureToggles) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const controls = [
    { key: "diffuse", label: "Diffuse (Color)", desc: "Base image." },
    {
      key: "normal",
      label: "Normal Map",
      desc: "Adds fake 3D lighting curves.",
    },
    {
      key: "roughness",
      label: "Roughness",
      desc: "Separates plastic gloss from paper matte.",
    },
  ];

  return (
    <div className="w-full h-screen bg-[#050505] overflow-hidden relative font-sans">
      <div className="absolute top-6 left-6 z-10 flex flex-col items-start gap-4 w-80 px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-white text-xl font-bold tracking-wider opacity-80">
            TEXTURE PIPELINE
          </h1>
          <button
            onClick={() => setShowControls((v) => !v)}
            className="text-white/50 hover:text-white transition-colors"
            aria-label="Toggle controls"
          >
            <Settings size={18} />
          </button>
        </div>

        <div className={`flex flex-col gap-3 bg-black/70 p-4 rounded-xl backdrop-blur-md border border-white/10 w-full transition-all duration-300 ${showControls ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          {controls.map((control) => {
            const isChecked = toggles[control.key as keyof TextureToggles];
            return (
              <label
                key={control.key}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer select-none ${
                  isChecked
                    ? "bg-white/10 border-white/30"
                    : "bg-black border-white/5 opacity-60 hover:opacity-100"
                }`}
              >
                <div className="relative flex items-center pt-1">
                  <input
                    suppressHydrationWarning
                    type="checkbox"
                    checked={isChecked}
                    onChange={() =>
                      handleToggle(control.key as keyof TextureToggles)
                    }
                    className="w-4 h-4 rounded border-gray-600 appearance-none bg-black/50 checked:bg-white checked:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all peer"
                  />
                  <svg
                    className="absolute w-4 h-4 pointer-events-none hidden peer-checked:block text-black p-[2px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>

                <div className="flex flex-col gap-1">
                  <span
                    className={`text-sm font-semibold transition-colors ${isChecked ? "text-white" : "text-white/70"}`}
                  >
                    {control.label}
                  </span>
                  <span className="text-[11px] text-white/40 max-w-[120px] leading-tight">
                    {control.desc}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: false, antialias: true }}
      >
        <Suspense fallback={null}>
          <CardMesh toggles={toggles} />
        </Suspense>
      </Canvas>
    </div>
  );
}
