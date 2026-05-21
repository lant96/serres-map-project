import { useAppStore } from "./useAppStore";

export function getFilteredHotspots() {
  const {
    hotspots,
    activeFilter,
  } = useAppStore.getState();

  const normalizeFilter = (f) => {
    if (f === "buildings") return "building";
    if (f === "images") return "image";
    if (f === "publications") return "publication";

    return f;
  };

  return activeFilter === "all"
    ? hotspots
    : hotspots.filter(
        (h) => h.type === normalizeFilter(activeFilter)
      );
}

export function getSelectedHotspot() {
  const {
    hotspots,
    selectedHotspotId,
  } = useAppStore.getState();

  return hotspots.find(
    (h) =>
      String(h.id) === String(selectedHotspotId)
  );
}