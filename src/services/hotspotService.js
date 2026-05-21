import { nocodbClient } from "./api/nocodbClient";

function safeNumber(v) {
  if (typeof v === "number") return v;
  if (typeof v === "string") return parseFloat(v);
  return NaN;
}

export async function getHotspots() {
  const data = await nocodbClient.getHotspots();
  const records = data.records ?? [];

  const hotspots = records.map((item) => {
    const f = item.fields || {};

    return {
      id: item.Id ?? item.id ?? index,
      
      // core metadata
      title: f.title ?? f.Title ?? f.Name ?? "Unnamed Hotspot",
      type: f.type ?? f.Type ?? "unknown",
      status: f.status ?? "unknown",
      
      // spatial data
      lat: safeNumber(f.lat ?? f.Lat),
      lng: safeNumber(f.lng ?? f.Lng),

      // geojson data
      gis_id: f.gis_id ?? null,

      // relational fields (future-proofing)
      buildingId: f.building_id ?? null,
      imageId: f.image_id ?? null,
      publicationId: f.publication_id ?? null,

      // optional flags
      isActive: f.is_active ?? true,
    };
  });

  console.log("SUCCESSFULLY EXTRACTED HOTSPOTS:", hotspots);

  return hotspots.filter((h) => {
  // buildings use gis_id instead of lat/lng
    if (h.type === "building") {
      return !!h.gis_id;
    }
    // everything else still uses coordinates
    return Number.isFinite(h.lat) && Number.isFinite(h.lng);
    
  });
}