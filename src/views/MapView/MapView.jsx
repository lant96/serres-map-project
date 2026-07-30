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

const SELECTED_ZOOM = 18;

export default function MapView() {
  const mapContainer     = useRef(null);
  const map              = useRef(null);
  const markersRef       = useRef({});
  const hotspotsRef      = useRef([]);
  const markers          = useRef(null);
  const buildings        = useRef(null);
  const buildingsGeoJSON = useRef(null);

  const [mapLoaded, setMapLoaded] = useState(false);

  const hotspots                = useAppStore((s) => s.hotspots);
  const selectedBuildingId      = useAppStore((s) => s.selectedBuildingId);
  const selectedHotspotId       = useAppStore((s) => s.selectedHotspotId);
  const hoveredRelatedHotspotId = useAppStore((s) => s.hoveredRelatedHotspotId);
  const setSelection            = useAppStore((s) => s.setSelection);

  const mapVisibility = useAppStore((s) => s.mapVisibility);

  useEffect(() => {
    hotspotsRef.current = hotspots;
  }, [hotspots]);

  // Map Init

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/f8-studio/cm02fobrd00a801plglrh61ue",
      center: [23.5475, 41.0891],
      zoom: 16.8,
      minZoom: 12,
      maxZoom: 19,
    });

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
        type: "line",
        source: "serres-blocks",
        paint: { "line-color": "#5c5a56", "line-width": 0.8 },
      });

      map.current.addSource("buildings", {
        type: "geojson",
        data: "/data/buildings-merarhias_02.geojson",
      });
      map.current.addLayer({
        id: "buildings-layer",
        type: "fill",
        source: "buildings",
        paint: { "fill-color": "#ff4d4d", "fill-opacity": 0.3 },
      });

      map.current.addSource("market", {
        type: "geojson",
        data: "/data/agora.geojson",
      });
      map.current.addLayer({
        id: "market-outline",
        type: "line",
        source: "market",
        paint: { "line-color": "#5c5a56", "line-width": 0.3 },
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

      Object.entries(mapVisibility).forEach(([layerId, visible]) => {
        if (map.current.getLayer(layerId)) {
          map.current.setLayoutProperty(
            layerId,
            "visibility",
            visible ? "visible" : "none"
          );
        }
      });
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

  // Layer Visibility

  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    Object.entries(mapVisibility).forEach(([layerId, visible]) => {
      if (map.current.getLayer(layerId)) {
        map.current.setLayoutProperty(
          layerId,
          "visibility",
          visible ? "visible" : "none"
        );
      }
    });
  }, [mapLoaded, mapVisibility]);

  // Markers

  useEffect(() => {
    if (!mapLoaded || !markers.current) return;
    markers.current.buildMarkers(hotspots);
  }, [mapLoaded, hotspots]);

  // Selection Highlight and Fly to

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
      if (Number.isFinite(currentHotspot.lat) && Number.isFinite(currentHotspot.lng)) {
        map.current.flyTo({
          center:  [currentHotspot.lng, currentHotspot.lat],
          padding: { left: 420, top: 0, right: 0, bottom: 0 },
          zoom:    SELECTED_ZOOM,
          ...FLY_OPTIONS,
        });
        return;
      }

      const gisId = activeGisId || currentHotspot.gis_id;
      if (gisId) {
        flyToBuildingPolygon(gisId);
        return;
      }
    }

    if (selectedBuildingId) {
      flyToBuildingPolygon(selectedBuildingId);
    }

  }, [mapLoaded, selectedHotspotId, selectedBuildingId, hotspots]);

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

// Hover Highlight

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
