import { useAppStore } from "../../../state/useAppStore";
import HotspotHeader   from "./HotspotHeader";
import BuildingCard    from "./BuildingCard";
import ImageCard       from "./ImageCard";
import PublicationCard from "./PublicationCard";

export default function HotspotOverlay({ hotspot, onClose }) {
  const hotspots                   = useAppStore((s) => s.hotspots);
  const setHoveredRelatedHotspotId = useAppStore((s) => s.setHoveredRelatedHotspotId);

  if (!hotspot) return null;

  const buildingEntity    = hotspot.buildings?.[0]    ?? null;
  const imageEntity       = hotspot.images?.[0]       ?? null;
  const publicationEntity = hotspot.publications?.[0] ?? null;

  // ── Entity → hotspot lookup ───────────────────────────────────────────────

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

  // ── Hover handlers ────────────────────────────────────────────────────────

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

      {/* Sticky header — same tone as sidebar */}
      <HotspotHeader hotspot={hotspot} onClose={onClose} />

      {/* Content — white card feel inside the grey panel */}
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

        {hotspot.type === "publication" && publicationEntity && (
          <PublicationCard publication={publicationEntity} />
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
    background: "#f0f0f0",
    zIndex: 9999,
    overflowY: "auto",
    pointerEvents: "auto",
    borderRight: "1px solid rgba(0,0,0,0.08)",
    boxShadow: "2px 0 10px rgba(0,0,0,0.08)",
  },
  content: {
    margin: 12,
    padding: 14,
    background: "#ffffff",
    borderRadius: 8,
    border: "1px solid rgba(0,0,0,0.05)",
  },
};
