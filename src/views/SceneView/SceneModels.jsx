import { useEffect, useState } from "react";
import * as THREE from "three";
import { gltfLoader } from "./loaders/gltfLoader";

function applyMaterialStyle(root, { opacity = 1 }) {
  root.traverse((child) => {
    if (!child.isMesh) return;

    child.castShadow = true;
    child.receiveShadow = true;

    if (child.material) {
      child.material.transparent = opacity < 1;

      child.material.opacity = opacity;

      child.material.depthWrite = opacity === 1;

      child.material.roughness = 1;
      child.material.metalness = 0;
    }
  });
}

export default function SceneModels() {
  const [models, setModels] = useState(null);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      new Promise((res, rej) =>
        gltfLoader.load("/models/oria_oikopedwn.glb", res, undefined, rej)
      ),
      new Promise((res, rej) =>
        gltfLoader.load("/models/buildings.glb", res, undefined, rej)
      ),
      new Promise((res, rej) =>
        gltfLoader.load("/models/model.glb", res, undefined, rej)
      ),
    ]).then(([terrain, buildings, model]) => {
      if (!isMounted) return;

      // Visual Style
      applyMaterialStyle(terrain.scene, {
        opacity: 0.1, 
      });

      applyMaterialStyle(buildings.scene, {
        opacity: 1, 
      });

      applyMaterialStyle(model.scene, {
        opacity: 1, 
      });

      setModels({ terrain, buildings, model });
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!models) return null;

  return (
    <>
      <primitive object={models.terrain.scene} scale={0.05} />
      <primitive object={models.buildings.scene} scale={0.05} />
      <primitive object={models.model.scene} scale={0.05} />
    </>
  );
}