import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

import { useAppStore } from "../../state/useAppStore";

import MapControls from "../../components/controls/MapControls";

import { createMapInteractions } from "./mapInteractions";
import { createMapMarkers } from "./mapMarkers";
import { createMapBuildings } from "./mapBuildings";

import "../../app/styles/map-controls.css";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapView() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const markersRef = useRef({});
  const hotspotsRef = useRef([]);

  const markers = useRef(null);
  const buildings = useRef(null);

  const hotspots = useAppStore((s) => s.hotspots);
  const activeFilter = useAppStore((s) => s.activeFilter);
  const selectedBuildingId = useAppStore((s) => s.selectedBuildingId);
  const selectedHotspotId = useAppStore((s) => s.selectedHotspotId);
  const setSelection = useAppStore((s) => s.setSelection);

  console.log("RAW HOTSPOTS IN MAPVIEW:", hotspots);

  useEffect(() => {
    hotspotsRef.current = hotspots;
  }, [hotspots]);

  // MAP INITIALISATION
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [23.5489, 41.089],
      zoom: 17,
    });

    map.current.on("load", () => {
      map.current.addSource("serres-blocks", {
        type: "geojson",
        data: "/data/serres-blocks.geojson",
      });

      map.current.addLayer({
        id: "serres-blocks-fill",
        type: "fill",
        source: "serres-blocks",
        paint: {
          "fill-color": "#c4a484",
          "fill-opacity": 0.25,
        },
      });

      map.current.addSource("buildings", {
        type: "geojson",
        data: "/data/buildings-merarhias_02.geojson",
      });

      map.current.addLayer({
        id: "buildings-layer",
        type: "fill",
        source: "buildings",
        paint: {
          "fill-color": "#ff0000",
          "fill-opacity": 0.3,
        },
      });

      map.current.addSource("market", {
        type: "geojson",
        data: "/data/ottoman-market.geojson",
      });

      map.current.addLayer({
        id: "market-outline",
        type: "line",
        source: "market",
        paint: {
          "line-color": "#3a3a3a",
          "line-width": 0.5,
        },
      });

      // INTERACTIONS
      const interactions = createMapInteractions({
        map: map.current,
        hotspotsRef,
        setSelection,
      });

      map.current.on("click", "buildings-layer", interactions.onBuildingClick);
      map.current.on("click", interactions.onMapClick);
      map.current.on("mouseenter", "buildings-layer", interactions.onMouseEnter);
      map.current.on("mouseleave", "buildings-layer", interactions.onMouseLeave);

      // MARKERS
      markers.current = createMapMarkers({
        map: map.current,
        markersRef,
        setSelection,
      });

      // BUILDINGS
      buildings.current = createMapBuildings({
        map: map.current,
        hotspots,
      });
    });

    return () => {
      Object.values(markersRef.current).forEach((m) => m.remove());
      map.current?.remove();
      map.current = null;
    };
  }, []);


  // MARKERS UPDATE

  useEffect(() => {
    if (!markers.current) return;

    markers.current.buildMarkers(hotspots, activeFilter);
  }, [hotspots, activeFilter]);


  // BUILDINGS UPDATE
 
  useEffect(() => {
    if (!map.current || !buildings.current) return;

    const currentHotspot = hotspots.find(
      (h) => String(h.id) === String(selectedHotspotId)
    );

    const activeGisId =
      selectedBuildingId || currentHotspot?.gis_id || "";

    buildings.current.updateBuildingHighlight(activeGisId);
  }, [selectedBuildingId, selectedHotspotId, hotspots]);


  // MARKER SELECTION
 
  useEffect(() => {
    if (!markers.current) return;

    markers.current.updateMarkerSelection(selectedHotspotId);
  }, [selectedHotspotId]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      <MapControls />
    </div>
  );
}