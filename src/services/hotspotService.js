import { nocodbClient } from "./api/nocodbClient";

function safeNumber(v) {
  if (typeof v === "number") return v;
  if (typeof v === "string") return parseFloat(v);
  return NaN;
}

function normalizeToArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return [val];
}

export async function getHotspots() {
  const data = await nocodbClient.getHotspots();
  const records = data.records ?? data.list ?? [];

  const hotspots = records.map((item, index) => {
    const f = item.fields ?? item;

    return {
      id:          item.Id ?? item.id ?? index,
      title:       f.title  ?? "Unnamed Hotspot",
      type:        f.type   ?? "unknown",
      status:      f.status ?? "unknown",

      lat:         safeNumber(f.lat),
      lng:         safeNumber(f.lng),
      gis_id:      f.gis_id      ?? null,
      object_name: f.object_name ?? null,

      // 3D scene position — Blender units, multiplied by 0.05 at render time
      // to match the GLB primitive scale.
      pos_x: safeNumber(f.pos_x),
      pos_y: safeNumber(f.pos_y),
      pos_z: safeNumber(f.pos_z),

      isActive: f.is_active ?? true,

      buildingIds:    normalizeToArray(f.building_id),
      imageIds:       normalizeToArray(f.image_id),
      publicationIds: normalizeToArray(f.publication_id),
    };
  });

  return hotspots.filter((h) => {
    if (h.type === "building")    return !!h.gis_id || !!h.object_name;
    if (h.type === "publication") return true;

    // Images can appear on the 2D map (lat/lng) or the 3D scene (pos_x/y/z)
    // or both — pass through if either set of coordinates is valid.
    if (h.type === "image") {
      const hasMapCoords   = Number.isFinite(h.lat)   && Number.isFinite(h.lng);
      const hasSceneCoords = Number.isFinite(h.pos_x) &&
                             Number.isFinite(h.pos_y) &&
                             Number.isFinite(h.pos_z);
      return hasMapCoords || hasSceneCoords;
    }

    return Number.isFinite(h.lat) && Number.isFinite(h.lng);
  });
}