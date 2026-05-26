export function createMapBuildings({ map }) {

  function updateBuildingHighlight(activeGisId, relatedGisIds = []) {
    if (!map?.getLayer("buildings-layer")) return;

    const hasSelection =
      !!activeGisId || relatedGisIds.length > 0;

    const dimmedOpacity = hasSelection ? 0.08 : 0.3;

    let expression;

    // ── nothing selected ─────────────────────────────
    if (!hasSelection) {
      expression = 0.3;
    }

    // ── selected only ────────────────────────────────
    else if (relatedGisIds.length === 0) {
      expression = [
        "case",
        ["==", ["get", "gis_id"], activeGisId],
        0.75,
        dimmedOpacity,
      ];
    }

    // ── selected + related ───────────────────────────
    else {
      expression = [
        "case",

        // selected building
        ["==", ["get", "gis_id"], activeGisId],
        0.75,

        // related buildings
        ["in", ["get", "gis_id"], ["literal", relatedGisIds]],
        0.45,

        // everything else
        dimmedOpacity,
      ];
    }

    map.setPaintProperty(
      "buildings-layer",
      "fill-opacity",
      expression
    );
  }

  return {
    updateBuildingHighlight,
  };
}