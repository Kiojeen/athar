import { ContactShadows, useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function Package() {
  const [front, back, left, right, top, bottom] = useTexture([
    "/box/box-front.png",
    "/box/box-back.png",
    "/box/box-left.png",
    "/box/box-right.png",
    "/box/box-top.png",
    "/box/box-bottom.png",
  ]);

  const width = 1142 / 300;
  const height = 339 / 300;
  const depth = 855 / 300;

  const materials = [
    new THREE.MeshStandardMaterial({
      map: right,
      metalness: 0.5,
    }),
    new THREE.MeshStandardMaterial({
      map: left,
      metalness: 0.5,
    }),
    new THREE.MeshStandardMaterial({
      map: top,
      metalness: 0.5,
    }),
    new THREE.MeshStandardMaterial({
      map: bottom,
      metalness: 0.5,
    }),
    new THREE.MeshStandardMaterial({
      map: front,
      metalness: 0.5,
    }),
    new THREE.MeshStandardMaterial({
      map: back,
      metalness: 0.5,
    }),
  ];

  return (
    <group>
      <mesh material={materials} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
      </mesh>

      <ContactShadows
        position={[0, -height / 2, 0]}
        opacity={0.6}
        scale={10}
        blur={2}
        far={1.5}
      />
    </group>
  );
}
