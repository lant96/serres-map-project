import { nocodbClient } from "../api/nocodbClient";

function safeNumber(v) {
  if (typeof v === "number") return v;
  if (typeof v === "string") return parseFloat(v);
  return NaN;
}

export async function getHotspots() {
  const data = await nocodbClient.getHotspots();
  const records = data.records ?? [];

  const hotspots = records.map((item) => {
    // 👇 Grab the nested fields object, or an empty object if it's missing
    const f = item.fields || {};

    return {
      id: item.id, // ID usually sits on the outer object in v3
      
      // Look inside the 'f' (fields) object for your data!
      title: f.title ?? f.Title ?? f.Name ?? "Unnamed Hotspot",
      type: f.type ?? f.Type ?? "unknown",
      
      lat: safeNumber(f.lat ?? f.Lat),
      lng: safeNumber(f.lng ?? f.Lng),
    };
  });

  console.log("SUCCESSFULLY EXTRACTED HOTSPOTS:", hotspots);

  // Filter out any hotspots that don't have valid coordinates
  return hotspots.filter(h => Number.isFinite(h.lat) && Number.isFinite(h.lng));
}