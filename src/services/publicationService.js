import { nocodbClient } from "./api/nocodbClient";

function normalizeToArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return [val];
}

export async function getPublications() {
  const data = await nocodbClient.getPublications();
  const records = data.records ?? data.list ?? [];

  return records.map((item) => {
    const f = item.fields ?? item;

    return {
      id:    item.Id ?? item.id,
      title: f.title ?? "Untitled",
      year:  f.year  ?? null,
      url:   f.url   ?? null,

      // Linked records — hydrated later
      buildings: normalizeToArray(f.buildings),
      images:    normalizeToArray(f.images),
    };
  });
}
