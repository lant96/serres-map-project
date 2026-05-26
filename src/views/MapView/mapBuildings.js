export function createMapBuildings({ map }) {

  // Internal state — recomputed into one Mapbox expression on every change
  let _activeGisId   = "";
  let _relatedGisIds = [];
  let _hoveredGisId  = "";

  // ── expression builder ───────────────────────────────────────────────────
  //
  // Opacity levels:
  //   selected  0.65   the clicked building polygon
  //   hovered   0.55   cursor over a related building name in a card
  //   related   0.45   auto-highlighted relations of the selected hotspot
  //   dimmed    0.05   everything else when something is active
  //   default   0.30   nothing selected

  function _applyHighlight() {
    if (!map?.getLayer("buildings-layer")) return;

    const hasActivity =
      !!_activeGisId || _relatedGisIds.length > 0 || !!_hoveredGisId;
    const dimmed = hasActivity ? 0.05 : 0.3;

    const conditions = [];

    if (_activeGisId) {
      conditions.push(["==", ["get", "gis_id"], _activeGisId], 0.65);
    }
    if (_hoveredGisId && _hoveredGisId !== _activeGisId) {
      conditions.push(["==", ["get", "gis_id"], _hoveredGisId], 0.55);
    }
    if (_relatedGisIds.length > 0) {
      conditions.push(
        ["in", ["get", "gis_id"], ["literal", _relatedGisIds]],
        0.45
      );
    }

    const opacity =
      conditions.length > 0 ? ["case", ...conditions, dimmed] : dimmed;

    map.setPaintProperty("buildings-layer", "fill-opacity", opacity);
  }

  function updateBuildingHighlight(activeGisId, relatedGisIds = []) {
    _activeGisId   = activeGisId;
    _relatedGisIds = relatedGisIds;
    _applyHighlight();
  }

  function updateHoveredBuilding(hoveredGisId = "") {
    _hoveredGisId = hoveredGisId;
    _applyHighlight();
  }

  return { updateBuildingHighlight, updateHoveredBuilding };
}
