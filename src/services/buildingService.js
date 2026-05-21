import { nocodbClient } from "./api/nocodbClient";

export async function getBuildings() {
  const data = await nocodbClient.getHotspots();

  const records = data.records ?? data.list ?? [];

  const buildings = records.map((item) => {
    const f = item.fields || item;

    return {
      id: item.Id ?? item.id,
      gis_id: f.gis_id,
      title: f.title ?? "Unnamed building",
    };
  });

  console.log("RAW BUILDINGS RESPONSE:", data);

  return buildings;
}