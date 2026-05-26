import { useAppStore } from "./useAppStore";

export function getFilteredHotspots() {
  const { hotspots, activeFilter } = useAppStore.getState();
  return _applyFilter(hotspots, activeFilter);
}

export function getSelectedHotspot() {
  const { hotspots, selectedHotspotId } = useAppStore.getState();
  return hotspots.find((h) => String(h.id) === String(selectedHotspotId));
}

// ── RELATIONAL SELECTOR ──────────────────────────────────────────────────────
//
// Returns a Set of hotspot IDs that are spatially related to the selected one.
//
// Strategy: two hotspots are "related" if they share any entity in common
// (a building, image, or publication that appears in both their hydrated
// relation arrays). Works in both directions automatically.
//
// Example:
//   Building hotspot A has images: [{ id: 3 }]
//   Image hotspot B has buildings: [{ id: 5 }]
//   If building entity #5 is also in hotspot A's buildings, they share it → related.
//
// This relies on hydration having run (hotspot.buildings/images/publications
// must be populated). If relations appear empty, check hotspotService.js field names.
//
export function getRelatedHotspotIds(selectedHotspot, allHotspots) {
  if (!selectedHotspot) return new Set();

  // Build a set of "entity keys" the selected hotspot is connected to.
  // Prefix by type to avoid cross-type false matches (e.g. building id 3 ≠ image id 3).
  const selectedKeys = new Set([
    ...(selectedHotspot.buildings    || []).map((b) => `b:${b.Id ?? b.id}`),
    ...(selectedHotspot.images       || []).map((i) => `i:${i.Id ?? i.id}`),
    ...(selectedHotspot.publications || []).map((p) => `p:${p.Id ?? p.id}`),
  ]);

  if (selectedKeys.size === 0) return new Set();

  const relatedIds = new Set();

  allHotspots.forEach((h) => {
    if (String(h.id) === String(selectedHotspot.id)) return;

    const hotspotKeys = [
      ...(h.buildings    || []).map((b) => `b:${b.Id ?? b.id}`),
      ...(h.images       || []).map((i) => `i:${i.Id ?? i.id}`),
      ...(h.publications || []).map((p) => `p:${p.Id ?? p.id}`),
    ];

    for (const key of hotspotKeys) {
      if (selectedKeys.has(key)) {
        relatedIds.add(String(h.id));
        break;
      }
    }
  });

  return relatedIds;
}

// ── INTERNAL ─────────────────────────────────────────────────────────────────

function _applyFilter(hotspots, activeFilter) {
  if (activeFilter === "all") return hotspots;
  const normalized = _normalizeFilter(activeFilter);
  return hotspots.filter((h) => h.type === normalized);
}

function _normalizeFilter(f) {
  if (f === "buildings")    return "building";
  if (f === "images")       return "image";
  if (f === "publications") return "publication";
  return f;
}
