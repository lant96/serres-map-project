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
    return Number.isFinite(h.lat) && Number.isFinite(h.lng);
  });
}