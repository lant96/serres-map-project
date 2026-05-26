import { nocodbClient } from "./api/nocodbClient";

export async function getImages() {
  const data = await nocodbClient.getImages();
  const records = data.records ?? data.list ?? [];

  return records.map((item) => {
    const f = item.fields ?? item;

    return {
      id:    item.Id ?? item.id,
      title: f.title ?? "Untitled Image",
      year:  f.year  ?? null,
      description: f.description ?? null,

      // Attachment field — NocoDB returns as array of objects with .url etc.
      // ImageCard accesses this as image.image_file?.[0]?.url
      // We also handle the case where the API returns a plain URL string.
      image_file: Array.isArray(f.image_file)
        ? f.image_file
        : f.image_file ? [{ url: f.image_file }] : null,

      // Linked records — column names from your images CSV:
      //   "buildings"    and "publications"  (lowercase, as exported)
      buildings:    f.buildings    ?? [],
      publications: f.publications ?? [],
    };
  });
}
