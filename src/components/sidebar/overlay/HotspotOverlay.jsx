import HotspotHeader from "./HotspotHeader";
import BuildingCard from "./BuildingCard";
import ImageCard from "./ImageCard";

export default function HotspotOverlay({ hotspot, onClose }) {
  if (!hotspot) return null;

  // Each hotspot type has a dedicated primary entity and a specific
  // set of related content — we dispatch to the right card directly.
  const buildingEntity = hotspot.buildings?.[0] ?? null;
  const imageEntity    = hotspot.images?.[0]    ?? null;

  return (
    <div style={styles.overlay}>
      <HotspotHeader hotspot={hotspot} onClose={onClose} />

      <div style={styles.content}>
        {hotspot.type === "building" && buildingEntity && (
          <BuildingCard building={buildingEntity} />
        )}

        {hotspot.type === "image" && imageEntity && (
          <ImageCard image={imageEntity} />
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "25%",
    height: "100vh",
    background: "#ffffff",
    zIndex: 9999,
    overflowY: "auto",
    pointerEvents: "auto",
    borderRight: "1px solid #e5e7eb",
    boxShadow: "2px 0 10px rgba(0,0,0,0.08)",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    padding: 12,
  },
};
