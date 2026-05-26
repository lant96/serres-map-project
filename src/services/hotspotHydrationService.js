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

    // Level 1: resolve the hotspot's own direct links 
    const resolvedBuildings = resolveRelations(hotspot.buildingIds, buildings);
    const resolvedImages    = resolveRelations(hotspot.imageIds,    images);
    const resolvedPubs      = resolveRelations(hotspot.publicationIds, publications);

    // ── Level 2: resolve each entity's own nested relations 
    // A building record in NocoDB has its own `images` and `publications`
    // columns linking to those tables. We resolve those too so the overlay
    // can render full image cards (with photo, year, description) rather
    // than just titles.

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
