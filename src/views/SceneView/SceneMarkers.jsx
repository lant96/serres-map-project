// Floating sphere markers for image hotspots in the 3D scene.
// Positions are stored in Blender units in NocoDB (pos_x/y/z) and
// multiplied by BLENDER_SCALE to match the GLB primitive scale of 0.05.

import { useAppStore } from "../../state/useAppStore";
import { getRelatedHotspotIds } from "../../state/selectors";

const BLENDER_SCALE = 0.05;
const MARKER_RADIUS = 0.05;

// ONLY TWO VISUAL STATES
const COLORS = {
  active: "#ff4d4d",
  inactive: "#9aa0a6", 
};

const EMISSIVE = {
  active: { color: "#ff4d4d", intensity: 0.35 },
  inactive: { color: "#000000", intensity: 0 },
};

// STATE RESOLUTION
function resolveState(hotspotId, selectedId, relatedIds, hoveredId) {
  const id = String(hotspotId);

  const hasInteraction =
    selectedId || hoveredId || relatedIds.size > 0;

  if (!hasInteraction) return "active";

  if (
    id === String(selectedId) ||
    id === String(hoveredId) ||
    relatedIds.has(id)
  ) {
    return "active";
  }

  return "inactive";
}

// MARKER
function ImageMarker({ hotspot, state, onSelect }) {
  const isInactive = state === "inactive";

  const color = isInactive ? COLORS.inactive : COLORS.active;
  const em = isInactive ? EMISSIVE.inactive : EMISSIVE.active;

  const opacity = isInactive ? 0.2 : 1;

  const scale =
    state === "active"
      ? 1
      : 1;

  const position = [
    hotspot.pos_x * BLENDER_SCALE,
    hotspot.pos_y * BLENDER_SCALE + 1.5,
    hotspot.pos_z * BLENDER_SCALE,
  ];

  return (
    <mesh
      position={position}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(hotspot.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      <sphereGeometry args={[MARKER_RADIUS, 16, 16]} />

      <meshStandardMaterial
        color={color}
        transparent={opacity < 1}
        opacity={opacity}
        depthWrite={opacity === 1}
        emissive={em.color}
        emissiveIntensity={em.intensity}
        roughness={0.4}
        metalness={0}
      />
    </mesh>
  );
}

// SCENE MARKERS
export default function SceneMarkers() {
  const hotspots = useAppStore((s) => s.hotspots);
  const selectedHotspotId = useAppStore((s) => s.selectedHotspotId);
  const hoveredRelatedHotspotId = useAppStore((s) => s.hoveredRelatedHotspotId);
  const setSelection = useAppStore((s) => s.setSelection);

  const selectedHotspot = hotspots.find(
    (h) => String(h.id) === String(selectedHotspotId)
  );

  const relatedIds = getRelatedHotspotIds(selectedHotspot, hotspots);

  const imageMarkers = hotspots.filter(
    (h) =>
      h.type === "image" &&
      Number.isFinite(h.pos_x) &&
      Number.isFinite(h.pos_y) &&
      Number.isFinite(h.pos_z)
  );

  return (
    <>
      {imageMarkers.map((h) => (
        <ImageMarker
          key={h.id}
          hotspot={h}
          state={resolveState(
            h.id,
            selectedHotspotId,
            relatedIds,
            hoveredRelatedHotspotId
          )}
          onSelect={(id) => setSelection("hotspot", id)}
        />
      ))}
    </>
  );
}