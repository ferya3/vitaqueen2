"use client";

import { ContactShadows, Environment, Float, Lightformer, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

export interface Bottle3DProps {
  volume: number;
  accent?: string | null;
  brand: string;
  interactive?: boolean;
  active?: boolean;
}

/** Bottle profile (radius, height) for a lathe, scaled to the bottle volume. */
function profile(volume: number) {
  const large = volume >= 5000;
  const wide = large ? 1.25 : volume >= 1000 ? 0.95 : 0.78;
  const height = large ? 3.0 : volume >= 1000 ? 3.6 : 3.1;
  const pts: [number, number][] = [
    [0, 0],
    [wide * 0.85, 0],
    [wide, 0.12],
    [wide, height * 0.55],
    [wide * 0.98, height * 0.62],
    [wide * 0.75, height * 0.76],
    [wide * 0.42, height * 0.88],
    [0.26, height * 0.94],
    [0.26, height],
    [0, height],
  ];
  return { points: pts.map(([x, y]) => new THREE.Vector2(x, y)), wide, height };
}

function useLabelTexture(brand: string, accent: string) {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createLinearGradient(0, 0, 1024, 0);
    grad.addColorStop(0, "#073B59");
    grad.addColorStop(0.5, accent);
    grad.addColorStop(1, "#073B59");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 256);
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.beginPath();
    ctx.moveTo(0, 170);
    ctx.bezierCurveTo(300, 120, 600, 230, 1024, 160);
    ctx.lineTo(1024, 256);
    ctx.lineTo(0, 256);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 72px Vazirmatn, Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(brand, 256, 118);
    ctx.fillText(brand, 768, 118);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
  }, [brand, accent]);
}

function Bottle({ volume, accent, brand }: { volume: number; accent: string; brand: string }) {
  const { points, wide, height } = useMemo(() => profile(volume), [volume]);
  const waterPoints = useMemo(
    () => points.filter((p) => p.y <= height * 0.8).map((p) => new THREE.Vector2(Math.max(0, p.x - 0.05), p.y + 0.04)),
    [points, height],
  );
  const label = useLabelTexture(brand, accent);

  return (
    <group position={[0, -height / 2, 0]}>
      {/* bottle shell */}
      <mesh castShadow>
        <latheGeometry args={[points, 96]} />
        <meshPhysicalMaterial
          color="#e9f9fc"
          roughness={0.04}
          metalness={0}
          transmission={1}
          thickness={0.35}
          ior={1.46}
          clearcoat={1}
          clearcoatRoughness={0.05}
          transparent
          opacity={0.95}
        />
      </mesh>
      {/* water */}
      <mesh>
        <latheGeometry args={[waterPoints, 64]} />
        <meshPhysicalMaterial color="#8DD9E9" roughness={0.02} transmission={0.9} thickness={1.2} ior={1.33} transparent opacity={0.65} />
      </mesh>
      {/* label */}
      {label && (
        <mesh position={[0, height * 0.33, 0]}>
          <cylinderGeometry args={[wide + 0.01, wide + 0.01, height * 0.22, 96, 1, true]} />
          <meshStandardMaterial map={label} roughness={0.35} side={THREE.DoubleSide} />
        </mesh>
      )}
      {/* cap */}
      <mesh position={[0, height + 0.13, 0]}>
        <cylinderGeometry args={[0.31, 0.31, 0.3, 48]} />
        <meshStandardMaterial color="#073B59" roughness={0.35} metalness={0.2} />
      </mesh>
      <mesh position={[0, height - 0.02, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.04, 48]} />
        <meshStandardMaterial color="#0f4d70" roughness={0.4} />
      </mesh>
    </group>
  );
}

export default function Bottle3D({ volume, accent, brand, interactive = false, active = true }: Bottle3DProps) {
  const color = accent || "#13A8CE";
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.3, 8.2], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-hidden
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} />
      <directionalLight position={[-5, 2, -3]} intensity={0.8} color="#8DD9E9" />
      <Float speed={1.6} rotationIntensity={interactive ? 0.15 : 0.5} floatIntensity={interactive ? 0.4 : 1.1}>
        <Bottle volume={volume} accent={color} brand={brand} />
      </Float>
      <ContactShadows position={[0, -2.2, 0]} opacity={0.35} scale={8} blur={2.6} far={4} color="#073B59" />
      {/* Studio lighting generated locally — no external HDR download */}
      <Environment resolution={256}>
        <Lightformer intensity={3} position={[0, 4, -6]} scale={[10, 4, 1]} />
        <Lightformer intensity={2} position={[-6, 1, 0]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} color="#8DD9E9" />
        <Lightformer intensity={2} position={[6, 1, 0]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} />
        <Lightformer form="ring" intensity={1.5} position={[0, 2, 6]} scale={3} color="#13A8CE" />
      </Environment>
      <OrbitControls enablePan={false} enableZoom={false} enableRotate={interactive} autoRotate autoRotateSpeed={interactive ? 1.2 : 2} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.7} />
    </Canvas>
  );
}
