import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import Package from "@/components/package";

export default function Scene() {
  return (
    // Wrapping in a guaranteed full-screen div to ensure the canvas is not constrained by parent styles
    <div className="h-screen w-full">
      <Canvas 
        shadows
        // Adjusted camera to keep the box well-framed in the larger canvas area
        camera={{ position: [3, 2, 3.5], fov: 35 }} 
        // style={{ width: "100%", height: "100%" }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <color attach="background" args={["#e5e7eb"]} />

        {/* Reduced light intensities to avoid overexposure */}
        <ambientLight intensity={0.15} />
        
        <directionalLight 
          position={[5, 8, 5]} 
          intensity={0.5} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0001}
        />

        {/* Soft, low-intensity environment reflections */}
        <Environment preset="city" environmentIntensity={0.2} />

        {/* Box Component */}
        <group position={[0, -0.2, 0]}>
          <Package />
        </group>

        {/* Soft ground shadow */}
        <ContactShadows 
          position={[0, -0.75, 0]} 
          opacity={0.4} 
          scale={6} 
          blur={2} 
          far={2} 
        />

        <OrbitControls 
          enableDamping 
          minDistance={1.5} 
          maxDistance={8} 
          makeDefault
        />
      </Canvas>
    </div>
  );
}