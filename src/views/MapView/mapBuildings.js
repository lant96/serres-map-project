export function createMapBuildings({ map, hotspots }) {
  function getActiveGisId(selectedBuildingId, selectedHotspotId) {
    const currentHotspot = hotspots.find(
      (h) => String(h.id) === String(selectedHotspotId)
    );

    return selectedBuildingId || currentHotspot?.gis_id || "";
  }

  function updateBuildingHighlight(activeGisId) {
    if (!map?.getLayer("buildings-layer")) return;

    map.setPaintProperty("buildings-layer", "fill-opacity", [
      "case",
      ["==", ["get", "gis_id"], activeGisId],
      0.6,
      0.3,
    ]);
  }

  return {
    getActiveGisId,
    updateBuildingHighlight,
  };
}