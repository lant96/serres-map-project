const SOURCE_ID = "hotspot-markers";
const LAYER_ID  = "hotspot-markers-layer";

const CIRCLE_RADIUS = 7;

const COLORS = {
  image:       { base: "#ff4d4d", selected: "#b30000" }
};

export function createMapMarkers({ map, markersRef, setSelection }) {

  let _selectedId = null;
  let _relatedIds = new Set();
  let _hoveredId  = null;

  // ── Source + layer setup ──────────────────────────────────────────────────

  function _ensureSource() {
    if (!map.getSource(SOURCE_ID)) {
      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
    }
  }

  function _ensureLayer() {
    if (map.getLayer(LAYER_ID)) return;

    map.addLayer({
      id:     LAYER_ID,
      type:   "circle",
      source: SOURCE_ID,
      paint: {
        "circle-radius":  CIRCLE_RADIUS,
        "circle-color":   ["get", "baseColor"],
        "circle-opacity": 1,
      },
    });

    map.on("click", LAYER_ID, (e) => {
      const id = e.features?.[0]?.properties?.id;
      if (id != null) {
        e.originalEvent.stopPropagation();
        setSelection("hotspot", id);
      }
    });

    map.on("mouseenter", LAYER_ID, () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", LAYER_ID, () => {
      map.getCanvas().style.cursor = "";
    });
  }

  // ── GeoJSON builder ───────────────────────────────────────────────────────

  function _toGeoJSON(hotspots) {
    const features = hotspots
      .filter(
        (h) =>
          h.type !== "building" &&
          Number.isFinite(h.lat) &&
          Number.isFinite(h.lng)
      )
      .map((h) => {
        const colors = COLORS[h.type] ?? COLORS.building;
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [h.lng, h.lat],
          },
          properties: {
            id:            h.id,
            type:          h.type,
            baseColor:     colors.base,
            selectedColor: colors.selected,
          },
        };
      });

    return { type: "FeatureCollection", features };
  }

  // ── Paint expression builder ──────────────────────────────────────────────

  function _applyStyles() {
    if (!map.getLayer(LAYER_ID)) return;

    const hasActivity =
      !!_selectedId || _relatedIds.size > 0 || !!_hoveredId;

    const selectedIdStr = String(_selectedId ?? "");
    const hoveredIdStr  = String(_hoveredId  ?? "");
    const relatedArr    = Array.from(_relatedIds);

    // circle-color — selected gets darker shade, rest keep base
    const colorExpr = [
      "case",
      ["==", ["to-string", ["get", "id"]], selectedIdStr],
      ["get", "selectedColor"],
      ["get", "baseColor"],
    ];

    // circle-opacity
    let opacityExpr;
    if (!hasActivity) {
      opacityExpr = 1;
    } else {
      const c = [];
      c.push(["==", ["to-string", ["get", "id"]], selectedIdStr], 1);
      if (_hoveredId) {
        c.push(["==", ["to-string", ["get", "id"]], hoveredIdStr], 1);
      }
      if (relatedArr.length > 0) {
        c.push(["in", ["to-string", ["get", "id"]], ["literal", relatedArr]], 0.85);
      }
      c.push(0.15);
      opacityExpr = ["case", ...c];
    }

    // circle-radius
    let radiusExpr;
    if (!hasActivity) {
      radiusExpr = CIRCLE_RADIUS;
    } else {
      const c = [];
      c.push(["==", ["to-string", ["get", "id"]], selectedIdStr], CIRCLE_RADIUS * 1.5);
      if (_hoveredId) {
        c.push(["==", ["to-string", ["get", "id"]], hoveredIdStr], CIRCLE_RADIUS * 1.3);
      }
      if (relatedArr.length > 0) {
        c.push(["in", ["to-string", ["get", "id"]], ["literal", relatedArr]], CIRCLE_RADIUS * 1.15);
      }
      c.push(CIRCLE_RADIUS);
      radiusExpr = ["case", ...c];
    }

    map.setPaintProperty(LAYER_ID, "circle-color",   colorExpr);
    map.setPaintProperty(LAYER_ID, "circle-opacity",  opacityExpr);
    map.setPaintProperty(LAYER_ID, "circle-radius",   radiusExpr);
  }

  // ── Public API ────────────────────────────────────────────────────────────

  function buildMarkers(hotspots) {
    if (!map) return;
    _ensureSource();
    _ensureLayer();
    map.getSource(SOURCE_ID).setData(_toGeoJSON(hotspots));
    _applyStyles();
  }

  function updateMarkerSelection(selectedHotspotId, relatedIds = new Set()) {
    _selectedId = selectedHotspotId;
    _relatedIds = relatedIds;
    _applyStyles();
  }

  function updateHoveredMarker(hotspotId) {
    _hoveredId = hotspotId ?? null;
    _applyStyles();
  }

  return { buildMarkers, updateMarkerSelection, updateHoveredMarker };
}