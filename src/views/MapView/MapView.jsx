import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

import { useAppStore } from "../../state/useAppStore";
import { getRelatedHotspotIds } from "../../state/selectors";

import { createMapInteractions } from "./mapInteractions";
import { createMapMarkers }      from "./mapMarkers";
import { createMapBuildings }    from "./mapBuildings";

import "../../app/styles/map-controls.css";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapView() {
  const mapContainer = useRef(null);
  const map          = useRef(null);

  const markersRef   = useRef({});
  const hotspotsRef  = useRef([]);

  const markers   = useRef(null);
  const buildings = useRef(null);

  const hotspots          = useAppStore((s) => s.hotspots);
  const activeFilter      = useAppStore((s) => s.activeFilter);
  const selectedBuildingId = useAppStore((s) => s.selectedBuildingId);
  const selectedHotspotId  = useAppStore((s) => s.selectedHotspotId);
  const setSelection       = useAppStore((s) => s.setSelection);

  // Keep a live ref so interaction callbacks always see fresh hotspot data
  useEffect(() => {
    hotspotsRef.current = hotspots;
  }, [hotspots]);

  // ── MAP INITIALISATION ────────────────────────────────────────────────────
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [23.5489, 41.089],
      zoom: 17,
    });

    map.current.on("load", () => {
      // Serres urban context blocks
      map.current.addSource("serres-blocks", {
        type: "geojson",
        data: "/data/serres-blocks.geojson",
      });
      map.current.addLayer({
        id: "serres-blocks-fill",
        type: "fill",
        source: "serres-blocks",
        paint: { "fill-color": "#c4a484", "fill-opacity": 0.25 },
      });

      // Building footprints
      map.current.addSource("buildings", {
        type: "geojson",
        data: "/data/buildings-merarhias_02.geojson",
      });
      map.current.addLayer({
        id: "buildings-layer",
        type: "fill",
        source: "buildings",
        paint: { "fill-color": "#ff0000", "fill-opacity": 0.3 },
      });

      // Ottoman market outline
      map.current.addSource("market", {
        type: "geojson",
        data: "/data/ottoman-market.geojson",
      });
      map.current.addLayer({
        id: "market-outline",
        type: "line",
        source: "market",
        paint: { "line-color": "#3a3a3a", "line-width": 0.5 },
      });

      // ── INTERACTIONS ────────────────────────────────────────────────────
      const interactions = createMapInteractions({
        map: map.current,
        hotspotsRef,
        setSelection,
      });

      map.current.on("click", "buildings-layer", interactions.onBuildingClick);
      map.current.on("click",                    interactions.onMapClick);
      map.current.on("mouseenter", "buildings-layer", interactions.onMouseEnter);
      map.current.on("mouseleave", "buildings-layer", interactions.onMouseLeave);

      // ── MARKERS ─────────────────────────────────────────────────────────
      markers.current = createMapMarkers({
        map: map.current,
        markersRef,
        setSelection,
      });

      // ── BUILDINGS ───────────────────────────────────────────────────────
      // FIX: no longer pass `hotspots` at creation time (would be stale []).
      // mapBuildings now only needs the map reference.
      buildings.current = createMapBuildings({ map: map.current });
    });

    return () => {
      Object.values(markersRef.current).forEach((m) => m.remove());
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // ── MARKERS REBUILD ───────────────────────────────────────────────────────
  // Re-runs whenever hotspots load or the active filter changes
  useEffect(() => {
    if (!markers.current) return;
    markers.current.buildMarkers(hotspots, activeFilter);
  }, [hotspots, activeFilter]);

  // ── SELECTION HIGHLIGHT ───────────────────────────────────────────────────
  // Shared helper — computes related IDs once and drives both markers and
  // building polygons from the same data.
  useEffect(() => {
    if (!markers.current || !buildings.current) return;

    const currentHotspot = hotspots.find(
      (h) => String(h.id) === String(selectedHotspotId)
    );

    // IDs of hotspots that share an entity with the selected one
    const relatedIds = getRelatedHotspotIds(currentHotspot, hotspots);

    // ── Markers ────────────────────────────────────────────────────────────
    markers.current.updateMarkerSelection(selectedHotspotId, relatedIds);

    // ── Building polygons ──────────────────────────────────────────────────
    // Active polygon: the selected hotspot's own gis_id, or a directly
    // selected building (fallback from mapInteractions)
    const activeGisId =
      selectedBuildingId || currentHotspot?.gis_id || "";

    // Related polygons: gis_ids of building-type hotspots in relatedIds
    const relatedGisIds = hotspots
      .filter((h) => h.type === "building" && relatedIds.has(String(h.id)))
      .map((h) => h.gis_id)
      .filter(Boolean);

    buildings.current.updateBuildingHighlight(activeGisId, relatedGisIds);

  }, [selectedHotspotId, selectedBuildingId, hotspots]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
