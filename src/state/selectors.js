import { useAppStore } from "./useAppStore";

export function getRelatedHotspotIds(selectedHotspot, allHotspots) {
  if (!selectedHotspot) return new Set();

  const reachableBuildingIds = new Set();
  const reachableImageIds    = new Set();

  // Direct building entities + their nested images
  (selectedHotspot.buildings ?? []).forEach((b) => {
    reachableBuildingIds.add(String(b.Id ?? b.id));
    (b.images ?? []).forEach((img) =>
      reachableImageIds.add(String(img.Id ?? img.id))
    );
  });

  // Direct image entities + their nested buildings
  (selectedHotspot.images ?? []).forEach((img) => {
    reachableImageIds.add(String(img.Id ?? img.id));
    (img.buildings ?? []).forEach((b) =>
      reachableBuildingIds.add(String(b.Id ?? b.id))
    );
  });

  if (reachableBuildingIds.size === 0 && reachableImageIds.size === 0) {
    return new Set();
  }

  const relatedIds = new Set();

  allHotspots.forEach((h) => {
    if (String(h.id) === String(selectedHotspot.id)) return;

    const matchesBuilding = (h.buildings ?? []).some((b) =>
      reachableBuildingIds.has(String(b.Id ?? b.id))
    );
    const matchesImage = (h.images ?? []).some((img) =>
      reachableImageIds.has(String(img.Id ?? img.id))
    );

    if (matchesBuilding || matchesImage) {
      relatedIds.add(String(h.id));
    }
  });

  return relatedIds;
}