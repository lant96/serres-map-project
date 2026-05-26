import { nocodbClient } from "./api/nocodbClient";

export async function getPublications() {
  const data = await nocodbClient.getPublications();
  const records = data.records ?? data.list ?? [];

  return records.map((item) => {
    const f = item.fields ?? item;

    return {
      id:      item.Id ?? item.id,
      title:   f.title   ?? f.Title   ?? "Untitled Publication",
      authors: f.authors ?? null,
      year:    f.year    ?? null,

      // Linked records for overlay display
      buildings: f.Buildings ?? f.buildings ?? [],
      images:    f.Images    ?? f.images    ?? [],
    };
  });
}
