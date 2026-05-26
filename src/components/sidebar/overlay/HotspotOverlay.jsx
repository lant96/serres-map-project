import { useAppStore } from "../../../state/useAppStore";
import HotspotHeader from "./HotspotHeader";
import BuildingCard from "./BuildingCard";
import ImageCard from "./ImageCard";

export default function HotspotOverlay({ hotspot, onClose }) {
  const hotspots                  = useAppStore((s) => s.hotspots);
  const setHoveredRelatedHotspotId = useAppStore((s) => s.setHoveredRelatedHotspotId);

  if (!hotspot) return null;

  const buildingEntity = hotspot.buildings?.[0] ?? null;
  const imageEntity    = hotspot.images?.[0]    ?? null;

  function findHotspotForImage(img) {
    const targetId = String(img.Id ?? img.id);
    return hotspots.find(
      (h) =>
        h.type === "image" &&
        (h.images ?? []).some((i) => String(i.Id ?? i.id) === targetId)
    );
  }

  function findHotspotForBuilding(b) {
    const targetId = String(b.Id ?? b.id);
    return hotspots.find(
      (h) =>
        h.type === "building" &&
        (h.buildings ?? []).some((bld) => String(bld.Id ?? bld.id) === targetId)
    );
  }

  // Hover handlers

  function onImageHover(img) {
    const h = findHotspotForImage(img);
    if (h) setHoveredRelatedHotspotId(String(h.id));
  }

  function onBuildingHover(b) {
    const h = findHotspotForBuilding(b);
    if (h) setHoveredRelatedHotspotId(String(h.id));
  }

  function onHoverEnd() {
    setHoveredRelatedHotspotId(null);
  }

  return (
    <div style={styles.overlay}>
      <HotspotHeader hotspot={hotspot} onClose={onClose} />

      <div style={styles.content}>
        {hotspot.type === "building" && buildingEntity && (
          <BuildingCard
            building={buildingEntity}
            onImageHover={onImageHover}
            onImageHoverEnd={onHoverEnd}
          />
        )}

        {hotspot.type === "image" && imageEntity && (
          <ImageCard
            image={imageEntity}
            onBuildingHover={onBuildingHover}
            onBuildingHoverEnd={onHoverEnd}
          />
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
