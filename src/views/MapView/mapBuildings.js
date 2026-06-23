export function createMapBuildings({ map }) {

  let _activeGisId   = "";
  let _relatedGisIds = [];
  let _hoveredGisId  = "";

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
