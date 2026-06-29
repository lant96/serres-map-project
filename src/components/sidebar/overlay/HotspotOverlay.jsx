import { useAppStore } from "../../../state/useAppStore";
import BuildingCard from "./BuildingCard";
import ImageCard from "./ImageCard";
import PublicationCard from "./PublicationCard";
import "../../../app/styles/hotspotoverlay.css";

export default function HotspotOverlay({ hotspot, onClose }) {
  const hotspots = useAppStore((s) => s.hotspots);
  const setHoveredRelatedHotspotId = useAppStore(
    (s) => s.setHoveredRelatedHotspotId
  );
  const setSelectedHotspotId = useAppStore(
    (s) => s.setSelectedHotspotId
  );

  if (!hotspot) return null;

  const buildingEntity = hotspot.buildings?.[0] ?? null;
  const imageEntity = hotspot.images?.[0] ?? null;
  const publicationEntity = hotspot.publications?.[0] ?? null;

  function findHotspotForImage(img) {
    const targetId = String(img.Id ?? img.id);

    return hotspots.find(
      (h) =>
        h.type === "image" &&
        (h.images ?? []).some(
          (i) => String(i.Id ?? i.id) === targetId
        )
    );
  }

  function findHotspotForBuilding(b) {
    const targetId = String(b.Id ?? b.id);

    return hotspots.find(
      (h) =>
        h.type === "building" &&
        (h.buildings ?? []).some(
          (bld) => String(bld.Id ?? bld.id) === targetId
        )
    );
  }

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

  function onImageClick(img) {
    const h = findHotspotForImage(img);

    if (h) {
      setSelectedHotspotId(h.id);
    }
  }

  return (
    <div className="hotspot-overlay-inner">
      {hotspot.type === "building" && buildingEntity && (
        <BuildingCard
          building={buildingEntity}
          onImageHover={onImageHover}
          onImageHoverEnd={onHoverEnd}
          onImageClick={onImageClick}
          onClose={onClose}
        />
      )}

      {hotspot.type === "image" && imageEntity && (
        <ImageCard
          image={imageEntity}
          onBuildingHover={onBuildingHover}
          onBuildingHoverEnd={onHoverEnd}
          onClose={onClose}
        />
      )}

      {hotspot.type === "publication" && publicationEntity && (
        <PublicationCard
          publication={publicationEntity}
          onImageHover={onImageHover}
          onImageHoverEnd={onHoverEnd}
          onClose={onClose}
        />
      )}
    </div>
  );
}