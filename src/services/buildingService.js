import { nocodbClient } from "./api/nocodbClient";

export async function getBuildings() {
  const data = await nocodbClient.getBuildings();
  const records = data.records ?? data.list ?? [];

  return records.map((item) => {
    const f = item.fields ?? item;

    return {
      id:    item.Id ?? item.id,
      title: f.title ?? "Unnamed building",
      description: f.description ?? null,

      // Attachment field — NocoDB API returns attachments as an array of
      // objects: [{ url, title, mimetype, size, ... }]
      // BuildingCard accesses this as building["2d_plan"]?.[0]?.url
      "2d_plan": Array.isArray(f["2d_plan"])
        ? f["2d_plan"]
        : f["2d_plan"] ? [{ url: f["2d_plan"] }] : null,

      // Linked records — column names from your buildings CSV:
      //   "images"       and "publications"  (lowercase, as exported)
      // NocoDB returns these as arrays of objects or strings.
      images:       f.images       ?? [],
      publications: f.publications ?? [],
    };
  });
}
