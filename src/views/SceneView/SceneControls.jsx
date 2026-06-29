import { useEffect, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

export const INITIAL_TARGET = [0, 1.5, 0];
export const controlsRef = { current: null };

export default function SceneControls() {
  const ref = useRef(null);

  useEffect(() => {
    controlsRef.current = ref.current;

    if (ref.current) {
      ref.current.target.set(...INITIAL_TARGET);
    }
  }, []);

  return (
    <OrbitControls
      ref={ref}
      enableDamping
      dampingFactor={0.08}
      maxPolarAngle={Math.PI / 2}

      minDistance={4}
      maxDistance={40}
    />
  );
}