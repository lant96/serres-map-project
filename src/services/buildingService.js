import { nocodbClient } from "./api/nocodbClient";

export async function getBuildings() {
  const data = await nocodbClient.getBuildings();
  const records = data.records ?? data.list ?? [];

  return records.map((item) => {
    const f = item.fields ?? item;

    return {
      id:                item.Id ?? item.id,
      title:             f.title             ?? "Unnamed building",
      description:       f.description       ?? null,
      short_description: f.short_description ?? null,

      "2d_plan": Array.isArray(f["2d_plan"])
        ? f["2d_plan"]
        : f["2d_plan"] ? [{ url: f["2d_plan"] }] : null,

      images:       f.images       ?? [],
      publications: f.publications ?? [],
    };
  });
}