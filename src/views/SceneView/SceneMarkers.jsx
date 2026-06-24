// Floating sphere markers for image hotspots in the 3D scene.
// Positions are stored in Blender units in NocoDB (pos_x/y/z) and
// multiplied by BLENDER_SCALE to match the GLB primitive scale of 0.05.

import { useAppStore } from "../../state/useAppStore";
import { getRelatedHotspotIds } from "../../state/selectors";

const BLENDER_SCALE = 0.05;
const MARKER_RADIUS = 0.05;

// Four-state colour system — mirrors mapMarkers.js
const COLORS = {
  default:  "#ff4d4d",
  selected: "#b30000",
  related:  "#f59e0b",
  hovered:  "#06b6d4",
  dimmed:   "#ff4d4d",
};

const EMISSIVE = {
  selected: { color: "#b30000", intensity: 0.6 },
  hovered:  { color: "#06b6d4", intensity: 0.5 },
  related:  { color: "#f59e0b", intensity: 0.4 },
  default:  { color: "#000000", intensity: 0 },
  dimmed:   { color: "#000000", intensity: 0 },
};

function resolveState(hotspotId, selectedId, relatedIds, hoveredId) {
  const id = String(hotspotId);
  if (id === String(selectedId)) return "selected";
  if (id === String(hoveredId))  return "hovered";
  if (relatedIds.has(id))        return "related";
  if (selectedId || relatedIds.size > 0 || hoveredId) return "dimmed";
  return "default";
}

// Individual sphere marker

function ImageMarker({ hotspot, state, onSelect }) {
  const color   = COLORS[state]   ?? COLORS.default;
  const em      = EMISSIVE[state] ?? EMISSIVE.default;
  const opacity = state === "dimmed" ? 0.15 : 1;
  const scale   =
    state === "selected" ? 1.5 :
    state === "hovered"  ? 1.3 :
    state === "related"  ? 1.15 : 1;

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


export default function SceneMarkers() {
  const hotspots                = useAppStore((s) => s.hotspots);
  const selectedHotspotId       = useAppStore((s) => s.selectedHotspotId);
  const hoveredRelatedHotspotId = useAppStore((s) => s.hoveredRelatedHotspotId);
  const setSelection            = useAppStore((s) => s.setSelection);

  const selectedHotspot = hotspots.find(
    (h) => String(h.id) === String(selectedHotspotId)
  );
  const relatedIds = getRelatedHotspotIds(selectedHotspot, hotspots);

  // Only render markers for image hotspots that have valid 3D coordinates
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
