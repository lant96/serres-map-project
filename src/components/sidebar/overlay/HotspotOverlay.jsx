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
    <div className="sidebar">

      <HotspotHeader hotspot={hotspot} onClose={onClose} />

      <div className="sidebar-scroll">
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
          <PublicationCard
            publication={publicationEntity}
            onImageHover={onImageHover}
            onImageHoverEnd={onHoverEnd}
          />
        )}
      </div>

    </div>
  );
}