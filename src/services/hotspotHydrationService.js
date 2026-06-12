// Resolves raw NocoDB linked-record references into full entity objects.
// Works for both top-level hotspot links AND nested entity relations
// (e.g. the images listed on a building record).
//
// Each `linked` item may be:
//   - a plain string:        "IMG-66"
//   - a NocoDB object:       { Id: 1, title: "IMG-66" }
//   - a wrapped object:      { id: 1, id_fields: {...}, fields: { title: "IMG-66" } }
//
function resolveRelations(linkedRecords, collection) {
  if (!linkedRecords?.length || !collection?.length) return [];

  return linkedRecords
    .map((linked) => {
      const titleKey =
        typeof linked === "string"
          ? linked
          : linked?.fields?.title ?? linked?.title ?? null;

      const idKey =
        typeof linked === "object" && linked !== null
          ? String(linked?.Id ?? linked?.id ?? "")
          : null;

      return collection.find((item) => {
        const itemTitle = String(item.title ?? "");
        const itemId    = String(item.Id ?? item.id ?? "");
        if (titleKey && itemTitle === titleKey) return true;
        if (idKey    && idKey !== "" && itemId === idKey) return true;
        return false;
      });
    })
    .filter(Boolean);
}

export function hydrateHotspots({ hotspots, buildings, images, publications }) {
  if (!hotspots?.length) return [];

  return hotspots.map((hotspot) => {

    const resolvedBuildings = resolveRelations(hotspot.buildingIds, buildings);
    const resolvedImages    = resolveRelations(hotspot.imageIds,    images);
    const resolvedPubs      = resolveRelations(hotspot.publicationIds, publications);

    const deepBuildings = resolvedBuildings.map((b) => ({
      ...b,
      images:       resolveRelations(b.images       ?? [], images),
      publications: resolveRelations(b.publications ?? [], publications),
    }));

    const deepImages = resolvedImages.map((img) => ({
      ...img,
      buildings:    resolveRelations(img.buildings    ?? [], buildings),
      publications: resolveRelations(img.publications ?? [], publications),
    }));

    const deepPubs = resolvedPubs.map((p) => ({
      ...p,
      buildings: resolveRelations(p.buildings ?? [], buildings),
      images:    resolveRelations(p.images    ?? [], images),
    }));

    return {
      ...hotspot,
      buildings:    deepBuildings,
      images:       deepImages,
      publications: deepPubs,
    };
  });
}
