import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

import { useAppStore } from "../../state/useAppStore";
import { getRelatedHotspotIds } from "../../state/selectors";

import { createMapInteractions } from "./mapInteractions";
import { createMapMarkers }      from "./mapMarkers";
import { createMapBuildings }    from "./mapBuildings";

import "../../app/styles/map-controls.css";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const FLY_OPTIONS = {
  speed:     0.6,
  curve:     1.5,
  essential: true,
};

const SELECTED_ZOOM = 18.5;

export default function MapView() {
  const mapContainer    = useRef(null);
  const map             = useRef(null);
  const markersRef      = useRef({});
  const hotspotsRef     = useRef([]);
  const markers         = useRef(null);
  const buildings       = useRef(null);

  // Cache the buildings GeoJSON so flyToBuildingPolygon can
  // look up centroids without relying on the private source._data
  const buildingsGeoJSON = useRef(null);

  const [mapLoaded, setMapLoaded] = useState(false);

  const hotspots                = useAppStore((s) => s.hotspots);
  const selectedBuildingId      = useAppStore((s) => s.selectedBuildingId);
  const selectedHotspotId       = useAppStore((s) => s.selectedHotspotId);
  const hoveredRelatedHotspotId = useAppStore((s) => s.hoveredRelatedHotspotId);
  const setSelection            = useAppStore((s) => s.setSelection);

  useEffect(() => {
    hotspotsRef.current = hotspots;
  }, [hotspots]);

  // ── MAP INITIALISATION ────────────────────────────────────────────────────

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [23.5489, 41.089],
      zoom: 17,
    });

    // Fetch and cache buildings GeoJSON for centroid lookups
    fetch("/data/buildings-merarhias_02.geojson")
      .then((r) => r.json())
      .then((data) => { buildingsGeoJSON.current = data; })
      .catch((err) => console.warn("Could not load buildings GeoJSON:", err));

    map.current.on("load", () => {
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

      const interactions = createMapInteractions({
        map: map.current,
        hotspotsRef,
        setSelection,
      });

      map.current.on("click", "buildings-layer", interactions.onBuildingClick);
      map.current.on("click",                    interactions.onMapClick);
      map.current.on("mouseenter", "buildings-layer", interactions.onMouseEnter);
      map.current.on("mouseleave", "buildings-layer", interactions.onMouseLeave);

      markers.current   = createMapMarkers({ map: map.current, markersRef, setSelection });
      buildings.current = createMapBuildings({ map: map.current });

      setMapLoaded(true);
    });

    return () => {
      Object.values(markersRef.current).forEach((m) => m.remove());
      map.current?.remove();
      map.current        = null;
      markers.current    = null;
      buildings.current  = null;
      setMapLoaded(false);
    };
  }, []);

  // ── MARKERS REBUILD ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!mapLoaded || !markers.current) return;
    markers.current.buildMarkers(hotspots);
  }, [mapLoaded, hotspots]);

  // ── SELECTION HIGHLIGHT + FLY-TO ─────────────────────────────────────────

  useEffect(() => {
    if (!mapLoaded || !markers.current || !buildings.current) return;

    const currentHotspot = hotspots.find(
      (h) => String(h.id) === String(selectedHotspotId)
    );

    const relatedIds = getRelatedHotspotIds(currentHotspot, hotspots);

    markers.current.updateMarkerSelection(selectedHotspotId, relatedIds);

    const activeGisId = selectedBuildingId || currentHotspot?.gis_id || "";

    const relatedGisIds = hotspots
      .filter((h) => h.type === "building" && relatedIds.has(String(h.id)))
      .map((h) => h.gis_id)
      .filter(Boolean);

    buildings.current.updateBuildingHighlight(activeGisId, relatedGisIds);

    if (!map.current) return;

    if (currentHotspot) {
      // Image / publication — fly to lat/lng
      if (Number.isFinite(currentHotspot.lat) && Number.isFinite(currentHotspot.lng)) {
        map.current.flyTo({
          center: [currentHotspot.lng, currentHotspot.lat],
          zoom:   SELECTED_ZOOM,
          ...FLY_OPTIONS,
        });
        return;
      }

      // Building hotspot — fly to polygon centroid
      const gisId = activeGisId || currentHotspot.gis_id;
      if (gisId) {
        flyToBuildingPolygon(gisId);
        return;
      }
    }

    // Building selected directly via polygon click
    if (selectedBuildingId) {
      flyToBuildingPolygon(selectedBuildingId);
    }

  }, [mapLoaded, selectedHotspotId, selectedBuildingId, hotspots]);

  // ── Fly to a building polygon centroid ───────────────────────────────────
  // Uses the cached GeoJSON (not source._data which is a private API
  // and only contains the URL string when loaded from a file).

  function flyToBuildingPolygon(gisId) {
    if (!map.current || !buildingsGeoJSON.current) return;

    const feature = buildingsGeoJSON.current.features?.find(
      (f) => f.properties?.gis_id === gisId
    );
    if (!feature) return;

    const centroid = getPolygonCentroid(feature.geometry);
    if (!centroid) return;

    map.current.flyTo({
      center: centroid,
      zoom:   SELECTED_ZOOM,
      ...FLY_OPTIONS,
    });
  }

  function getPolygonCentroid(geometry) {
    if (!geometry) return null;

    let coords = [];
    if (geometry.type === "Polygon") {
      coords = geometry.coordinates[0];
    } else if (geometry.type === "MultiPolygon") {
      coords = geometry.coordinates[0][0];
    }
    if (!coords.length) return null;

    const lng = coords.reduce((s, c) => s + c[0], 0) / coords.length;
    const lat = coords.reduce((s, c) => s + c[1], 0) / coords.length;
    return [lng, lat];
  }

  // ── HOVER HIGHLIGHT ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!mapLoaded || !markers.current || !buildings.current) return;

    if (!hoveredRelatedHotspotId) {
      markers.current.updateHoveredMarker(null);
      buildings.current.updateHoveredBuilding("");
      return;
    }

    const hoveredHotspot = hotspots.find(
      (h) => String(h.id) === String(hoveredRelatedHotspotId)
    );

    markers.current.updateHoveredMarker(hoveredRelatedHotspotId);
    buildings.current.updateHoveredBuilding(hoveredHotspot?.gis_id ?? "");

  }, [mapLoaded, hoveredRelatedHotspotId, hotspots]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}