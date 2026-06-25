import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { useAppStore } from "../../state/useAppStore";
import { getRelatedHotspotIds } from "../../state/selectors";
import { gltfLoader } from "./loaders/gltfLoader";

function prepareMaterials(scene) {
  scene.traverse((child) => {
    if (!child.isMesh || !child.material) return;

    child.material = child.material.clone();
    child.castShadow    = true;
    child.receiveShadow = true;

    child.material.roughness  = 1;
    child.material.metalness  = 0;
    child.material.depthWrite = child.material.opacity === 1;

    child.userData.origEmissive =
      child.material.emissive?.clone() ?? new THREE.Color(0, 0, 0);
    child.userData.origEmissiveIntensity =
      child.material.emissiveIntensity ?? 0;
    child.userData.origOpacity     = child.material.opacity ?? 1;
    child.userData.origTransparent = child.material.transparent ?? false;
    child.userData.origDepthWrite  = child.material.depthWrite ?? true;
  });
}

function applyMeshState(mesh, state) {
  const m = mesh.material;
  if (!m) return;

  switch (state) {
    case "selected":
      m.emissive?.set("#ff4d4d");
      m.emissiveIntensity = 0.5;
      m.opacity     = 1;
      m.transparent = false;
      m.depthWrite  = true;
      break;

    case "hovered":
      m.emissive?.set("#ff4d4d");
      m.emissiveIntensity = 0.5;
      m.opacity     = 1;
      m.transparent = false;
      m.depthWrite  = true;
      break;

    case "related":
      m.emissive?.set("#ff8686");
      m.emissiveIntensity = 0.5;
      m.opacity     = 1;
      m.transparent = false;
      m.depthWrite  = true;
      break;

    case "dimmed":
      m.emissive?.set("#000000");
      m.emissiveIntensity = 0;
      m.opacity     = 0.1;
      m.transparent = true;
      m.depthWrite  = false;
      break;

    default:
      m.emissive?.copy(
        mesh.userData.origEmissive ?? new THREE.Color(0, 0, 0)
      );
      m.emissiveIntensity = mesh.userData.origEmissiveIntensity ?? 0;
      m.opacity     = mesh.userData.origOpacity     ?? 1;
      m.transparent = mesh.userData.origTransparent ?? false;
      m.depthWrite  = mesh.userData.origDepthWrite  ?? true;
      break;
  }
}


function buildMeshMap(scene) {
  const map = new Map();

  scene.traverse((obj) => {
    if (!obj.isMesh) return;
    const baseName = obj.name.replace(/\.\d+$/, "");
    if (!map.has(baseName)) map.set(baseName, []);
    map.get(baseName).push(obj);
  });

  return map;
}

function applyAllStates({
  hotspots,
  selectedHotspotId,
  relatedIds,
  hoveredHotspotId,
  meshMap,
}) {
  const hasActivity =
    !!selectedHotspotId || relatedIds.size > 0 || !!hoveredHotspotId;

  hotspots.forEach((h) => {
    if (!h.object_name) return;

    const meshes = meshMap.get(h.object_name) ?? [];
    if (!meshes.length) return;

    const id = String(h.id);
    let state = "default";

    if (id === String(selectedHotspotId)) {
      state = "selected";
    } else if (id === String(hoveredHotspotId)) {
      state = "hovered";
    } else if (relatedIds.has(id)) {
      state = "related";
    } else if (hasActivity) {
      state = "dimmed";
    }

    meshes.forEach((mesh) => applyMeshState(mesh, state));
  });
}

export default function SceneModels() {
  const [models, setModels] = useState(null);
  const meshMapRef = useRef(new Map());

  const hotspots                = useAppStore((s) => s.hotspots);
  const selectedHotspotId       = useAppStore((s) => s.selectedHotspotId);
  const hoveredRelatedHotspotId = useAppStore((s) => s.hoveredRelatedHotspotId);
  const setSelection            = useAppStore((s) => s.setSelection);

  useEffect(() => {
    let isMounted = true;

    const load = (path) =>
      new Promise((res, rej) => gltfLoader.load(path, res, undefined, rej));

    Promise.all([
      load("/models/oria_oikopedwn.glb"),
      load("/models/buildings-02.glb"),
      load("/models/model.glb"),
    ]).then(([terrain, buildings, model]) => {
      if (!isMounted) return;

      prepareMaterials(terrain.scene);
      terrain.scene.traverse((c) => {
        if (!c.isMesh || !c.material) return;
        c.material.opacity     = 0.1;
        c.material.transparent = true;
        c.material.depthWrite  = false;
        c.userData.origOpacity     = 0.1;
        c.userData.origTransparent = true;
        c.userData.origDepthWrite  = false;
      });

      prepareMaterials(buildings.scene);
      buildings.scene.traverse((c) => {
        if (!c.isMesh || !c.material) return;
        c.material.opacity     = 0.4;
        c.material.transparent = true;
        c.material.depthWrite  = false;
        c.userData.origOpacity     = 0.4;
        c.userData.origTransparent = true;
        c.userData.origDepthWrite  = false;
      });

      prepareMaterials(model.scene);
      meshMapRef.current = buildMeshMap(model.scene);

      model.scene.traverse((c) => {
        if (!c.isMesh || !c.material) return;

        const edges = new THREE.EdgesGeometry(c.geometry);

        const edgeLines = new THREE.LineSegments(
          edges,
          new THREE.LineBasicMaterial({
            color: 0xff0000,
          })
        );

        c.material.opacity     = 0.8;
        c.material.transparent = true;
        c.material.depthWrite  = false;
        c.userData.origOpacity     = 0.8;
        c.userData.origTransparent = true;
        c.userData.origDepthWrite  = false;

        c.add(edgeLines);
      });

      setModels({ terrain, buildings, model });
    });

    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (!models || !hotspots.length) return;

    const selectedHotspot = hotspots.find(
      (h) => String(h.id) === String(selectedHotspotId)
    );
    const relatedIds = getRelatedHotspotIds(selectedHotspot, hotspots);

    applyAllStates({
      hotspots,
      selectedHotspotId,
      relatedIds,
      hoveredHotspotId: hoveredRelatedHotspotId,
      meshMap: meshMapRef.current,
    });
  }, [selectedHotspotId, hoveredRelatedHotspotId, hotspots, models]);

  function handleModelClick(e) {
    e.stopPropagation();
    const baseName = e.object.name.replace(/\.\d+$/, "");
    const hotspot  = hotspots.find((h) => h.object_name === baseName);
    if (hotspot) setSelection("hotspot", hotspot.id);
  }

  function handleModelPointerOver(e) {
    e.stopPropagation();
    const baseName = e.object.name.replace(/\.\d+$/, "");
    const hotspot  = hotspots.find((h) => h.object_name === baseName);
    document.body.style.cursor = hotspot ? "pointer" : "default";
  }

  function handleModelPointerOut() {
    document.body.style.cursor = "default";
  }

  if (!models) return null;

  return (
    <>
      <primitive object={models.terrain.scene}   scale={0.05} position={[0, 1.5, 0]}/>
      <primitive object={models.buildings.scene} scale={0.05} position={[0, 1.5, 0]}/>
      <primitive
        object={models.model.scene}
        scale={0.05}
        position={[0, 1.5, 0]}
        onClick={handleModelClick}
        onPointerOver={handleModelPointerOver}
        onPointerOut={handleModelPointerOut}
      />
    </>
  );
}