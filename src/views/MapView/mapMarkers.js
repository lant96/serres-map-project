import mapboxgl from "mapbox-gl";

export function createMapMarkers({
  map,
  markersRef,
  setSelection,
}) {
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
      if (
        h.type === "building" ||
        !Number.isFinite(h.lng) ||
        !Number.isFinite(h.lat)
      )
        return;

      const el = document.createElement("div");
      el.className = "hotspot-marker";

      el.style.width = "18px";
      el.style.height = "18px";
      el.style.borderRadius = "50%";
      el.style.border = "2px solid #ffffff";
      el.style.cursor = "pointer";
      el.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
      el.style.transition =
        "transform 0.15s ease, background-color 0.15s ease";

      if (h.type === "image") el.style.backgroundColor = "#ff4d4d";
      else if (h.type === "publication") el.style.backgroundColor = "#888888";
      else el.style.backgroundColor = "#aa3bff";

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

  function updateMarkerSelection(selectedHotspotId) {
    Object.keys(markersRef.current).forEach((id) => {
      const el = markersRef.current[id].getElement();

      if (String(id) === String(selectedHotspotId)) {
        el.style.transform = "scale(1.4)";
        el.style.borderColor = "#000000";
      } else {
        el.style.transform = "scale(1)";
        el.style.borderColor = "#ffffff";
      }
    });
  }

  return {
    buildMarkers,
    updateMarkerSelection,
  };
}