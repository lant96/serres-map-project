import mapboxgl from "mapbox-gl";

export function createMapMarkers({ map, markersRef, setSelection }) {

  // Internal state — stored in the closure so every update function
  // can recompute all markers from a single source of truth.
  let _selectedId = null;
  let _relatedIds = new Set();
  let _hoveredId  = null;

  // ── marker creation ───────────────────────────────────────────────────────

  function clearMarkers() {
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};
  }

  function buildMarkers(hotspots, activeFilter) {
    if (!map) return;
    clearMarkers();

    const filtered =
      activeFilter === "all"
        ? hotspots
        : hotspots.filter((h) => h.type === activeFilter);

    filtered.forEach((h) => {
      if (h.type === "building" || !Number.isFinite(h.lng) || !Number.isFinite(h.lat))
        return;

      const el = document.createElement("div");
      el.className = "hotspot-marker";
      el.style.width        = "18px";
      el.style.height       = "18px";
      el.style.borderRadius = "50%";
      el.style.border       = "2px solid #ffffff";
      el.style.cursor       = "pointer";
      el.style.boxShadow    = "0 2px 6px rgba(0,0,0,0.3)";
      el.style.transition = "opacity 0.2s ease, border-color 0.15s ease";

      if (h.type === "image")            el.style.backgroundColor = "#ff4d4d";
      else if (h.type === "publication") el.style.backgroundColor = "#888888";
      else                               el.style.backgroundColor = "#aa3bff";

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        setSelection("hotspot", h.id);
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([h.lng, h.lat])
        .addTo(map);

      markersRef.current[h.id] = marker;
    });

    // Re-apply current visual state to newly built markers
    _applyStyles();
  }

  // ── visual state ──────────────────────────────────────────────────────────
  //
  // Four states, in priority order:
  //   selected  — black border, scaled up         (the clicked hotspot)
  //   hovered   — cyan border, slightly scaled    (cursor over a related card item)
  //   related   — amber border, slightly scaled   (auto-highlighted on selection)
  //   dimmed    — white border, low opacity       (everything else when something is active)
  //   default   — white border, full opacity      (nothing selected)

  function _applyStyles() {
    const hasActivity =
      !!_selectedId || _relatedIds.size > 0 || !!_hoveredId;

    Object.keys(markersRef.current).forEach((id) => {
      const el         = markersRef.current[id].getElement();
      const isSelected = String(id) === String(_selectedId);
      const isHovered  = String(id) === String(_hoveredId);
      const isRelated  = _relatedIds.has(String(id));

      if (isSelected) {
        el.style.transform   = "scale(1.4)";
        el.style.borderColor = "#000000";
        el.style.opacity     = "1";
      } else if (isHovered) {
        el.style.transform   = "scale(1.35)";
        el.style.borderColor = "#06b6d4";   // cyan
        el.style.opacity     = "1";
      } else if (isRelated) {
        el.style.transform   = "scale(1.2)";
        el.style.borderColor = "#f59e0b";   // amber
        el.style.opacity     = "1";
      } else if (hasActivity) {
        el.style.transform   = "scale(1)";
        el.style.borderColor = "#ffffff";
        el.style.opacity     = "0.2";
      } else {
        el.style.transform   = "scale(1)";
        el.style.borderColor = "#ffffff";
        el.style.opacity     = "1";
      }
    });
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
