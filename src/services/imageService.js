import { nocodbClient } from "./api/nocodbClient";

export async function getImages() {
  const data = await nocodbClient.getImages();
  const records = data.records ?? data.list ?? [];

  return records.map((item) => {
    const f = item.fields ?? item;

    return {
      id:                item.Id ?? item.id,
      title:             f.title             ?? "Untitled Image",
      year:              f.year              ?? null,
      description:       f.description       ?? null,
      short_description: f.short_description ?? null,

      image_file: Array.isArray(f.image_file)
        ? f.image_file
        : f.image_file ? [{ url: f.image_file }] : null,

      buildings:    f.buildings    ?? [],
      publications: f.publications ?? [],
    };
  });
}