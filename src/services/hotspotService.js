import { nocodbClient } from "./api/nocodbClient";

function safeNumber(v) {
  if (typeof v === "number") return v;
  if (typeof v === "string") return parseFloat(v);
  return NaN;
}

// NocoDB linked-record fields can come back in several shapes depending on
// the API version and field type:
//   - an array of objects:  [{ Id: 1, title: "Eski Cami" }]
//   - a single object:      { Id: 1, title: "Eski Cami" }
//   - a plain string:       "Eski Cami"
//   - null / undefined
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
      id:     item.Id ?? item.id ?? index,
      title:  f.title  ?? "Unnamed Hotspot",
      type:   f.type   ?? "unknown",
      status: f.status ?? "unknown",
      lat:    safeNumber(f.lat),
      lng:    safeNumber(f.lng),
      gis_id: f.gis_id ?? null,
      isActive: f.is_active ?? true,

      buildingIds:    normalizeToArray(f.building_id),
      imageIds:       normalizeToArray(f.image_id),
      publicationIds: normalizeToArray(f.publication_id),
    };
  });

  console.log("RAW HOTSPOTS (pre-hydration):", hotspots);

  return hotspots.filter((h) => {
    if (h.type === "building") return !!h.gis_id;
    return Number.isFinite(h.lat) && Number.isFinite(h.lng);
  });
}
