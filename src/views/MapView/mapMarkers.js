import mapboxgl from "mapbox-gl";

export function createMapMarkers({ map, markersRef, setSelection }) {

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
      // Buildings use polygon footprints, not markers
      if (
        h.type === "building" ||
        !Number.isFinite(h.lng) ||
        !Number.isFinite(h.lat)
      ) return;

      const el = document.createElement("div");
      el.className = "hotspot-marker";

      el.style.width        = "18px";
      el.style.height       = "18px";
      el.style.borderRadius = "50%";
      el.style.border       = "2px solid #ffffff";
      el.style.cursor       = "pointer";
      el.style.boxShadow    = "0 2px 6px rgba(0,0,0,0.3)";

      // Include opacity and border-color in the transition so all three
      // state changes animate smoothly
      el.style.transition =
        "transform 0.15s ease, opacity 0.2s ease, border-color 0.15s ease";

      if (h.type === "image")       el.style.backgroundColor = "#ff4d4d";
      else if (h.type === "publication") el.style.backgroundColor = "#888888";
      else                          el.style.backgroundColor = "#aa3bff";

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        setSelection("hotspot", h.id);
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([h.lng, h.lat])
        .addTo(map);

      markersRef.current[h.id] = marker;
    });
  }

  // Three visual states driven by selection + relation context:
  //
  //   selected  — scaled up, black border, full opacity
  //   related   — slightly enlarged, amber border, full opacity
  //   dimmed    — normal scale, white border, low opacity
  //               (only applied when something IS selected)
  //   default   — normal scale, white border, full opacity
  //               (nothing selected — all markers equally visible)
  //
  function updateMarkerSelection(selectedHotspotId, relatedIds = new Set()) {
    const hasSelection = !!selectedHotspotId || relatedIds.size > 0;

    Object.keys(markersRef.current).forEach((id) => {
      const el = markersRef.current[id].getElement();
      const isSelected = String(id) === String(selectedHotspotId);
      const isRelated  = relatedIds.has(String(id));

      if (isSelected) {
        el.style.transform   = "scale(1.4)";
        el.style.borderColor = "#000000";
        el.style.opacity     = "1";
      } else if (isRelated) {
        // Amber is clearly distinct from all three marker colours
        // (red, grey, purple) and reads as "highlighted but secondary"
        el.style.transform   = "scale(1.2)";
        el.style.borderColor = "#f59e0b";
        el.style.opacity     = "1";
      } else if (hasSelection) {
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

  return { buildMarkers, updateMarkerSelection };
}
